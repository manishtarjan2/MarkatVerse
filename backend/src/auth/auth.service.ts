import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service.js';
import { IdGeneratorService } from '../id-generator/id-generator.service.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private idGenerator: IdGeneratorService
  ) {}

  async signup(data: any) {
    if (!data.email && !data.phone) {
      throw new BadRequestException('Email or Phone is required');
    }

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          data.email ? { email: data.email } : undefined,
          data.phone ? { phone: data.phone } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (existing) {
      if (data.role === 'SELLER' && existing.role !== 'SELLER') {
        const isMatch = await bcrypt.compare(data.password, existing.password);
        if (!isMatch) {
          throw new BadRequestException('Account already exists with this email/phone. Incorrect password.');
        }
        const updated = await this.prisma.user.update({
          where: { id: existing.id },
          data: { role: 'SELLER' }
        });
        return this.generateToken(updated);
      }
      
      if (existing.role === 'SELLER') {
        throw new BadRequestException('Account is already registered as a Seller. Please login.');
      }

      throw new BadRequestException('User with this email or phone already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const markatId = await this.idGenerator.generateUserId();
    const user = await this.prisma.user.create({
      data: {
        markatId,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        password: hashedPassword,
        role: data.role || 'CONSUMER',
      },
    });

    return this.generateToken(user);
  }

  async login(data: any) {
    const identifier = data.email || data.phone;
    if (!identifier) {
      throw new BadRequestException('Email or Phone is required');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier },
          { markatId: identifier }
        ]
      }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  async phoneLogin(phone: string) {
    if (!phone) {
      throw new BadRequestException('Phone is required');
    }

    let user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user) {
      const markatId = await this.idGenerator.generateUserId();
      user = await this.prisma.user.create({
        data: {
          markatId,
          name: 'New User',
          phone: phone,
          email: `${phone}@temporary.markatverse.com`,
          password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
          role: 'CONSUMER',
        },
      });
    }

    return this.generateToken(user);
  }

  async googleLogin(token: string, role: string = 'CONSUMER') {
    if (!token) {
      throw new BadRequestException('Google token is required');
    }

    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new BadRequestException('Invalid Google token');
      }
      
      const payload = await response.json();
      
      if (!payload || !payload.email) {
        throw new BadRequestException('Invalid Google token payload');
      }

      const email = payload.email;
      const name = payload.name || 'Google User';

      let user = await this.prisma.user.findFirst({ where: { email } });

      if (!user) {
        const markatId = await this.idGenerator.generateUserId();
        user = await this.prisma.user.create({
          data: {
            markatId,
            name: name,
            email: email,
            password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
            role: role.toUpperCase(),
          },
        });
      }

      return this.generateToken(user);
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  async getMe(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, markatId: true, name: true, email: true, phone: true, role: true, business: { include: { wallet: true } } }
      });
      if (!user) throw new UnauthorizedException('User not found');
      return user;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async forgotPassword(identifier: string) {
    // Find user by email or phone
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }]
      }
    });

    if (!user) {
      throw new BadRequestException('No account found with this email or phone');
    }

    // Generate 6-character alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let resetCode = '';
    for (let i = 0; i < 6; i++) {
      resetCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Set expiry to 5 minutes from now
    const resetCodeExpires = new Date(Date.now() + 5 * 60 * 1000);

    // Save code to database
    await (this.prisma.user as any).update({
      where: { id: user.id },
      data: { resetCode, resetCodeExpires }
    });

    // Send email using nodemailer (or fallback to console for dev)
    try {
      const nodemailer = await import('nodemailer');
      // If we have SMTP credentials, send a real email
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"MarkatVerse Security" <${process.env.SMTP_USER}>`,
          to: user.email || undefined,
          subject: 'Password Reset Code - MarkatVerse',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Password Reset Request</h2>
              <p>Hi ${user.name},</p>
              <p>You requested to reset your password. Please use the 6-character code below. This code will expire in 5 minutes.</p>
              <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1e3a8a;">${resetCode}</span>
              </div>
              <p>If you did not request this, you can safely ignore this email.</p>
            </div>
          `
        });
        this.logger.log(`Password reset email sent to ${user.email}`);
      } else {
        // Fallback for development if no SMTP is configured
        this.logger.warn(`No SMTP configuration found. Development mode reset code for ${identifier}: ${resetCode}`);
      }
    } catch (error) {
      this.logger.error('Failed to send reset email', error);
      // We don't throw here so the frontend can still proceed in dev mode
    }

    return {
      message: 'Password reset code sent to your email',
      user_name: user.name,
    };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    // Note: Since we updated the controller to accept an email and code,
    // the frontend might still send data in a different shape.
    // The previous implementation used a JWT resetToken.
    // We will assume `resetToken` here is the 6-digit code.
    // However, we need to know WHICH user is resetting the password!
    // Since the original signature was resetPassword(resetToken, newPassword),
    // we'll update it to accept (email, code, newPassword).
    throw new BadRequestException('Method signature changed, use resetPasswordWithCode instead');
  }

  async resetPasswordWithCode(identifier: string, code: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }]
      }
    }) as any;

    if (!user) {
      throw new BadRequestException('No account found with this email or phone');
    }

    if (!user.resetCode || user.resetCode !== code.toUpperCase()) {
      throw new BadRequestException('Invalid or incorrect reset code');
    }

    if (!user.resetCodeExpires || new Date() > new Date(user.resetCodeExpires)) {
      throw new BadRequestException('Reset code has expired (valid for 5 minutes)');
    }

    // Code is valid! Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password and invalidate code
    await (this.prisma.user as any).update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        resetCode: null,
        resetCodeExpires: null
      },
    });

    return { message: 'Password updated successfully' };
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        markatId: user.markatId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    };
  }
}

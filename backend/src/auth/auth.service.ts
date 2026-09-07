import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
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
    const user = await this.prisma.user.create({
      data: {
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
          { phone: identifier }
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
      user = await this.prisma.user.create({
        data: {
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

  async getMe(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, name: true, email: true, phone: true, role: true }
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

    // In production, send OTP/email. For now, return a reset token.
    const resetToken = this.jwtService.sign(
      { sub: user.id, purpose: 'password_reset' },
      { expiresIn: '15m' }
    );

    return {
      message: 'OTP sent successfully',
      reset_token: resetToken, // In production, send this via email/SMS
      user_name: user.name,
    };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(resetToken);
      if (payload.purpose !== 'password_reset') {
        throw new UnauthorizedException('Invalid reset token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { password: hashedPassword },
      });

      return { message: 'Password updated successfully' };
    } catch {
      throw new UnauthorizedException('Reset link is invalid or has expired');
    }
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    };
  }
}

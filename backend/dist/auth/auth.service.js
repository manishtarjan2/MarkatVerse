var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service.js';
import { IdGeneratorService } from '../id-generator/id-generator.service.js';
import { SecurityService } from '../security/security.service.js';
import * as bcrypt from 'bcryptjs';
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    idGenerator;
    securityService;
    logger = new Logger(AuthService_1.name);
    otpStore = new Map();
    constructor(prisma, jwtService, idGenerator, securityService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.idGenerator = idGenerator;
        this.securityService = securityService;
    }
    async signup(data) {
        if (!data.email && !data.phone) {
            throw new BadRequestException('Email or Phone is required');
        }
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [
                    data.email ? { email: data.email } : undefined,
                    data.phone ? { phone: data.phone } : undefined,
                ].filter(Boolean),
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
        await this.securityService.createAuditLog({
            action: 'SIGNUP',
            resource: 'User',
            details: `User ${user.name} registered as ${user.role}`,
            userId: user.id,
        });
        return this.generateToken(user);
    }
    async sendSignupOtp(identifier, type, phone) {
        if (type !== 'email') {
            throw new BadRequestException('Only email OTP is supported currently');
        }
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    ...(phone ? [{ phone }] : [])
                ]
            }
        });
        if (existing) {
            throw new BadRequestException('An account with this email or phone number already exists.');
        }
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const expires = new Date(Date.now() + 5 * 60 * 1000);
        this.otpStore.set(identifier, { code, expires });
        try {
            const nodemailer = await import('nodemailer');
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
                    from: `"MarkatVerse" <${process.env.SMTP_USER}>`,
                    to: identifier,
                    subject: 'Your Registration Code - MarkatVerse',
                    text: `Welcome to MarkatVerse!\n\nYou are one step away from creating your account. Please use the 6-character code below to verify your email address. This code will expire in 5 minutes.\n\nCode: ${code}\n\nIf you did not request this, you can safely ignore this email.`,
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="cid:logo" alt="MarkatVerse" style="height: 60px; max-width: 100%; object-fit: contain;">
              </div>
              <h2>Welcome to MarkatVerse!</h2>
              <p>You are one step away from creating your account. Please use the 6-character code below to verify your email address. This code will expire in 5 minutes.</p>
              <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #10b981;">${code}</span>
              </div>
              <p>If you did not request this, you can safely ignore this email.</p>
            </div>
          `,
                    attachments: [{
                            filename: 'hero-left-logo.png',
                            path: 'D:/MarkatVerse/frontend/public/hero-left-logo.png',
                            cid: 'logo'
                        }]
                });
                this.logger.log(`Signup OTP email sent to ${identifier}`);
            }
            else {
                this.logger.warn(`No SMTP configuration found. Development mode signup OTP for ${identifier}: ${code}`);
            }
        }
        catch (error) {
            this.logger.error('Failed to send signup OTP email', error);
        }
        return { message: `OTP sent successfully to ${identifier}`, success: true };
    }
    async verifySignupOtp(identifier, code, type) {
        const record = this.otpStore.get(identifier);
        if (!record) {
            throw new BadRequestException('No OTP request found for this email or it has expired');
        }
        if (record.code !== code.toUpperCase()) {
            throw new BadRequestException('Invalid OTP code');
        }
        if (new Date() > record.expires) {
            this.otpStore.delete(identifier);
            throw new BadRequestException('OTP code has expired (valid for 5 minutes)');
        }
        this.otpStore.delete(identifier);
        return { message: 'Code verified successfully', success: true };
    }
    async login(data) {
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
            },
            include: { business: true }
        });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) {
            await this.securityService.createAuditLog({
                action: 'LOGIN_FAILED',
                resource: 'User',
                details: `Failed login attempt for ${identifier}`,
            });
            throw new UnauthorizedException('Invalid credentials');
        }
        await this.securityService.createAuditLog({
            action: 'LOGIN',
            resource: 'User',
            details: `User logged in`,
            userId: user.id,
        });
        return this.generateToken(user);
    }
    async phoneLogin(phone) {
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
    async googleLogin(token, role = 'CONSUMER') {
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
        }
        catch (err) {
            console.error(err);
            throw new UnauthorizedException('Google authentication failed');
        }
    }
    async getMe(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: { id: true, markatId: true, name: true, email: true, phone: true, role: true, business: { include: { wallet: true } } }
            });
            if (!user)
                throw new UnauthorizedException('User not found');
            return user;
        }
        catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
    async forgotPassword(identifier) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { phone: identifier }]
            }
        });
        if (!user) {
            throw new BadRequestException('No account found with this email or phone');
        }
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let resetCode = '';
        for (let i = 0; i < 6; i++) {
            resetCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const resetCodeExpires = new Date(Date.now() + 5 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { resetCode, resetCodeExpires }
        });
        try {
            const nodemailer = await import('nodemailer');
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
                    from: `"MarkatVerse" <${process.env.SMTP_USER}>`,
                    to: user.email || undefined,
                    subject: 'Password Reset Code - MarkatVerse',
                    text: `Password Reset Request\n\nHi ${user.name},\n\nYou requested to reset your password. Please use the 6-character code below. This code will expire in 5 minutes.\n\nCode: ${resetCode}\n\nIf you did not request this, you can safely ignore this email.`,
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="cid:logo" alt="MarkatVerse" style="height: 60px; max-width: 100%; object-fit: contain;">
              </div>
              <h2>Password Reset Request</h2>
              <p>Hi ${user.name},</p>
              <p>You requested to reset your password. Please use the 6-character code below. This code will expire in 5 minutes.</p>
              <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1e3a8a;">${resetCode}</span>
              </div>
              <p>If you did not request this, you can safely ignore this email.</p>
            </div>
          `,
                    attachments: [{
                            filename: 'hero-left-logo.png',
                            path: 'D:/MarkatVerse/frontend/public/hero-left-logo.png',
                            cid: 'logo'
                        }]
                });
                this.logger.log(`Password reset email sent to ${user.email}`);
            }
            else {
                this.logger.warn(`No SMTP configuration found. Development mode reset code for ${identifier}: ${resetCode}`);
            }
        }
        catch (error) {
            this.logger.error('Failed to send reset email', error);
        }
        return {
            message: 'Password reset code sent to your email',
            user_name: user.name,
        };
    }
    async resetPassword(resetToken, newPassword) {
        throw new BadRequestException('Method signature changed, use resetPasswordWithCode instead');
    }
    async verifyResetCode(identifier, code) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { phone: identifier }]
            }
        });
        if (!user) {
            throw new BadRequestException('No account found with this email or phone');
        }
        if (!user.resetCode || user.resetCode !== code.toUpperCase()) {
            throw new BadRequestException('Invalid or incorrect reset code');
        }
        if (!user.resetCodeExpires || new Date() > new Date(user.resetCodeExpires)) {
            throw new BadRequestException('Reset code has expired (valid for 5 minutes)');
        }
        return { message: 'Code verified successfully' };
    }
    async resetPasswordWithCode(identifier, code, newPassword) {
        await this.verifyResetCode(identifier, code);
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { phone: identifier }]
            }
        });
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetCode: null,
                resetCodeExpires: null
            },
        });
        return { message: 'Password updated successfully' };
    }
    generateToken(user) {
        const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                markatId: user.markatId,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                business: user.business
            }
        };
    }
};
AuthService = AuthService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService,
        IdGeneratorService,
        SecurityService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service.js';
import * as bcrypt from 'bcryptjs';
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
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
    async login(data) {
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
    async phoneLogin(phone) {
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
    async getMe(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: { id: true, name: true, email: true, phone: true, role: true, business: true }
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
        const resetToken = this.jwtService.sign({ sub: user.id, purpose: 'password_reset' }, { expiresIn: '15m' });
        return {
            message: 'OTP sent successfully',
            reset_token: resetToken,
            user_name: user.name,
        };
    }
    async resetPassword(resetToken, newPassword) {
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
        }
        catch {
            throw new UnauthorizedException('Reset link is invalid or has expired');
        }
    }
    generateToken(user) {
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
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map
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
    // Check if email or phone is provided
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

    let user = await this.prisma.user.findUnique({
      where: { phone }
    });

    if (!user) {
      // Create new user for phone if doesn't exist
      user = await this.prisma.user.create({
        data: {
          name: 'New User',
          phone: phone,
          password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10), // Random password
          role: 'CONSUMER',
        },
      });
    }

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}

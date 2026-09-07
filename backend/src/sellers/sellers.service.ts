import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async create(seller: any) {
    // Find user by email or phone to link business to user
    let user = null;
    if (seller.email || seller.phone) {
      user = await this.prisma.user.findFirst({
        where: {
          OR: [
            seller.email ? { email: seller.email } : undefined,
            seller.phone ? { phone: seller.phone } : undefined,
          ].filter(Boolean) as any,
        },
      });
    }

    // If no user found, create one
    if (!user) {
      const bcrypt = await import('bcryptjs');
      user = await this.prisma.user.create({
        data: {
          name: seller.ownerName || seller.name || 'Seller',
          email: seller.email || null,
          phone: seller.phone || null,
          password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
          role: 'SELLER',
        },
      });
    } else {
      // Update role to SELLER
      await this.prisma.user.update({
        where: { id: user.id },
        data: { role: 'SELLER' },
      });
    }

    // Check if business already exists for this user
    const existingBusiness = await this.prisma.business.findUnique({
      where: { userId: user.id },
    });

    if (existingBusiness) {
      return { ...existingBusiness, status: 'Pending' };
    }

    const business = await this.prisma.business.create({
      data: {
        userId: user.id,
        name: seller.businessName || seller.name || 'My Business',
        description: seller.description || null,
        businessType: seller.businessType || 'WHOLESALER',
        address: seller.address || null,
        verified: false,
      },
    });

    return {
      ...business,
      ownerName: user.name,
      email: user.email,
      phone: user.phone,
      status: 'Pending',
    };
  }

  async findAll() {
    const businesses = await this.prisma.business.findMany({
      include: { user: { select: { name: true, email: true, phone: true, role: true } } },
    });

    return businesses.map(b => ({
      id: b.id,
      businessName: b.name,
      ownerName: b.user.name,
      email: b.user.email,
      phone: b.user.phone,
      businessType: b.businessType,
      address: b.address,
      status: b.verified ? 'Approved' : 'Pending',
      date: b.createdAt.toISOString().split('T')[0],
    }));
  }

  async updateStatus(id: string, status: string) {
    const business = await this.prisma.business.update({
      where: { id },
      data: { verified: status === 'Approved' },
    });
    return { ...business, status };
  }
}

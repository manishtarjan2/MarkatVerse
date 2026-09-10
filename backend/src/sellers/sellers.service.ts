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
        capabilities: seller.mainType === 'SERVICE' ? ['SERVICE'] : ['B2B', 'B2C'],
      },
    });

    if (seller.mainType === 'SERVICE') {
      const queue = await this.prisma.serviceQueue.create({
        data: {
          sellerId: user.id,
          shopName: seller.businessName || seller.name || 'My Shop',
          avgMinutes: 30,
        },
      });
      if (seller.staff && seller.staff.length > 0) {
        await this.prisma.serviceStaff.createMany({
          data: seller.staff.map((s: any) => ({
            queueId: queue.id,
            name: s.name,
            role: s.role,
          })),
        });
      }
      if (seller.resources && seller.resources.length > 0) {
        await this.prisma.serviceResource.createMany({
          data: seller.resources.map((r: any) => ({
            queueId: queue.id,
            name: r.name,
            type: r.type,
          })),
        });
      }
    }

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

  async updateUser(userId: string, data: any) {
    const business = await this.prisma.business.findUnique({ where: { userId } });
    if (!business) throw new Error('Business not found');
    return this.prisma.business.update({
      where: { userId },
      data: {
        name: data.businessName,
        address: data.address,
      }
    });
  }

  async removeUser(userId: string) {
    // Attempt to delete products associated with the user
    await this.prisma.product.deleteMany({
      where: { sellerId: userId },
    });

    // Attempt to delete business associated with the user
    await this.prisma.business.deleteMany({
      where: { userId: userId },
    });

    // Attempt to delete service queue associated with the user
    await this.prisma.serviceQueue.deleteMany({
      where: { sellerId: userId },
    });

    // Delete the user itself
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}

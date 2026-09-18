import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class AdminBusinessService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllBusinesses() {
    return this.prisma.business.findMany({
      include: {
        wallet: true,
        user: {
          select: { name: true, email: true, phone: true }
        }
      }
    });
  }

  async updateSubscription(id: string, data: { subscriptionStatus: string, subscriptionStartDate: Date | null, subscriptionEndDate: Date | null }) {
    return this.prisma.business.update({
      where: { id },
      data
    });
  }

  async updateBilling(id: string, data: { commissionType: string, commissionRate: number, subscriptionStatus: string, subscriptionStartDate: Date | null, subscriptionEndDate: Date | null }) {
    return this.prisma.business.update({
      where: { id },
      data
    });
  }
}

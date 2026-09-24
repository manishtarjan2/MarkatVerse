import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class AdminBusinessService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllBusinesses() {
    const businesses = await this.prisma.business.findMany({
      include: {
        wallet: true,
        user: {
          select: { id: true, markatId: true, name: true, email: true, phone: true }
        }
      }
    });

    // Ensure businessCode and user markatId exist
    const updatedBusinesses = await Promise.all(
      businesses.map(async (b) => {
        let updatedB = { ...b };
        
        // Generate businessCode if missing
        if (!b.businessCode) {
          const newBizCode = `BUS-${Math.floor(10000 + Math.random() * 90000)}`;
          await this.prisma.business.update({
            where: { id: b.id },
            data: { businessCode: newBizCode }
          });
          updatedB.businessCode = newBizCode;
        }
        
        // Generate markatId if missing
        if (b.user && !b.user.markatId) {
          const newUserId = `MV-${Math.floor(10000000 + Math.random() * 90000000)}`;
          await this.prisma.user.update({
            where: { id: b.user.id },
            data: { markatId: newUserId }
          });
          updatedB.user.markatId = newUserId;
        }

        return updatedB;
      })
    );

    return updatedBusinesses;
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

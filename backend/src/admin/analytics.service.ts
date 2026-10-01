import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [
      totalUsers,
      totalSellers,
      totalProducts,
      totalQueues,
      totalOrders,
      totalLeads,
      completedOrders,
      businesses
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'CONSUMER' } }),
      this.prisma.business.count(),
      this.prisma.product.count(),
      this.prisma.serviceQueue.count(),
      this.prisma.order.count(),
      this.prisma.lead.count(),
      this.prisma.order.findMany({
        where: { status: 'COMPLETED' },
        select: { total: true }
      }),
      this.prisma.business.findMany({
        select: { wallet: { select: { totalEarnings: true } }, commissionType: true, commissionRate: true }
      })
    ]);

    // GMV from completed orders
    const gmvFromOrders = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Some legacy fallback using wallets if orders are sparse
    let walletGMV = 0;
    let commission = 0;
    
    for (const b of businesses) {
      const bal = b.wallet?.totalEarnings || 0;
      walletGMV += bal;
      if (b.commissionType === 'FIXED') {
        commission += (b.commissionRate || 999);
      } else {
        commission += bal * ((b.commissionRate || 5) / 100);
      }
    }

    const gmv = Math.max(gmvFromOrders, walletGMV);
    
    return {
      totalUsers,
      totalSellers,
      totalProducts,
      totalQueues,
      totalOrders,
      totalLeads,
      gmv,
      commission,
      bookings: totalOrders + totalQueues,
      retentionRate: '68%' // Placeholder for phase 2 retention metric
    };
  }

  async getFinanceData() {
    const transactions = await this.prisma.ledgerTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        wallet: {
          include: {
            business: {
              select: { name: true }
            }
          }
        }
      }
    });

    const withdrawalRequests = await this.prisma.withdrawalRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        wallet: {
          include: {
            business: {
              select: { name: true }
            }
          }
        },
        bankAccount: true
      }
    });

    return {
      transactions,
      withdrawals: withdrawalRequests
    };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardMetrics() {
    // Phase 5: High-level automated metrics
    const totalSellers = await this.prisma.business.count();
    
    // Buyers are users with role buyer/CONSUMER
    const totalBuyers = await this.prisma.user.count({
      where: { role: { in: ['buyer', 'CONSUMER'] } }
    });

    const activeOrders = await this.prisma.order.count({
      where: { status: { in: ['PENDING', 'PROCESSING'] } }
    });
    
    // Ledger Aggregation for Volume and Revenue
    const ledgerAgg = await this.prisma.ledgerTransaction.aggregate({
      _sum: {
        grossAmount: true,
        platformFee: true
      },
      where: { type: 'CREDIT' }
    });

    const exceptions = await this.prisma.automationException.count({
      where: { status: 'OPEN' }
    });

    const recentTransactions = await this.prisma.ledgerTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { wallet: { include: { business: true } } }
    });

    return {
      totalSellers,
      totalBuyers,
      activeOrders,
      totalVolume: ledgerAgg._sum.grossAmount || 0,
      totalPlatformRevenue: ledgerAgg._sum.platformFee || 0,
      openExceptions: exceptions,
      recentTransactions: recentTransactions.map(t => ({
        ...t,
        sellerName: t.wallet?.business?.name || 'Unknown'
      }))
    };
  }
}

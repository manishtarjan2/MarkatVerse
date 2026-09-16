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
      totalLeads
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'CONSUMER' } }),
      this.prisma.business.count(),
      this.prisma.product.count(),
      this.prisma.serviceQueue.count(),
      this.prisma.order.count(),
      this.prisma.lead.count()
    ]);

    return {
      totalUsers,
      totalSellers,
      totalProducts,
      totalQueues,
      totalOrders,
      totalLeads
    };
  }
}

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardMetrics() {
        const totalSellers = await this.prisma.business.count();
        const totalBuyers = await this.prisma.user.count({
            where: { role: { in: ['buyer', 'CONSUMER'] } }
        });
        const activeOrders = await this.prisma.order.count({
            where: { status: { in: ['PENDING', 'PROCESSING'] } }
        });
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
};
AnalyticsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AnalyticsService);
export { AnalyticsService };
//# sourceMappingURL=analytics.service.js.map
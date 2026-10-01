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
    async getSummary() {
        const [totalUsers, totalSellers, totalProducts, totalQueues, totalOrders, totalLeads, completedOrders, businesses] = await Promise.all([
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
        const gmvFromOrders = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        let walletGMV = 0;
        let commission = 0;
        for (const b of businesses) {
            const bal = b.wallet?.totalEarnings || 0;
            walletGMV += bal;
            if (b.commissionType === 'FIXED') {
                commission += (b.commissionRate || 999);
            }
            else {
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
            retentionRate: '68%'
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
};
AnalyticsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AnalyticsService);
export { AnalyticsService };
//# sourceMappingURL=analytics.service.js.map
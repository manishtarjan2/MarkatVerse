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
        const [totalUsers, totalSellers, totalProducts, totalQueues, totalOrders, totalLeads] = await Promise.all([
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
};
AnalyticsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AnalyticsService);
export { AnalyticsService };
//# sourceMappingURL=analytics.service.js.map
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
let AdminBusinessService = class AdminBusinessService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllBusinesses() {
        const businesses = await this.prisma.business.findMany({
            include: {
                wallet: true,
                user: {
                    select: { id: true, markatId: true, name: true, email: true, phone: true }
                }
            }
        });
        const updatedBusinesses = await Promise.all(businesses.map(async (b) => {
            let updatedB = { ...b };
            if (!b.businessCode) {
                const newBizCode = `BUS-${Math.floor(10000 + Math.random() * 90000)}`;
                await this.prisma.business.update({
                    where: { id: b.id },
                    data: { businessCode: newBizCode }
                });
                updatedB.businessCode = newBizCode;
            }
            if (b.user && !b.user.markatId) {
                const newUserId = `MV-${Math.floor(10000000 + Math.random() * 90000000)}`;
                await this.prisma.user.update({
                    where: { id: b.user.id },
                    data: { markatId: newUserId }
                });
                updatedB.user.markatId = newUserId;
            }
            return updatedB;
        }));
        return updatedBusinesses;
    }
    async updateSubscription(id, data) {
        return this.prisma.business.update({
            where: { id },
            data
        });
    }
    async updateBilling(id, data) {
        return this.prisma.business.update({
            where: { id },
            data
        });
    }
};
AdminBusinessService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AdminBusinessService);
export { AdminBusinessService };
//# sourceMappingURL=admin-business.service.js.map
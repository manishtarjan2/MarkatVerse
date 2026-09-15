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
let LeadsService = class LeadsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.lead.create({
            data: {
                buyerId: data.buyerId,
                sellerId: data.sellerId,
                productId: data.productId,
                message: data.message,
                quantityRequested: parseInt(data.quantityRequested, 10),
                status: 'PENDING'
            }
        });
    }
    findAllForSeller(sellerId) {
        return this.prisma.lead.findMany({
            where: { sellerId },
            include: {
                buyer: { select: { id: true, name: true, email: true } },
                product: { select: { id: true, name: true, image: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    findAllForBuyer(buyerId) {
        return this.prisma.lead.findMany({
            where: { buyerId },
            include: {
                seller: { select: { id: true, name: true, email: true } },
                product: { select: { id: true, name: true, image: true, price: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    updateStatus(id, status) {
        return this.prisma.lead.update({
            where: { id },
            data: { status }
        });
    }
};
LeadsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], LeadsService);
export { LeadsService };
//# sourceMappingURL=leads.service.js.map
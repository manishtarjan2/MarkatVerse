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
let DisputesService = class DisputesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.dispute.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async create(data) {
        return this.prisma.dispute.create({
            data: {
                title: data.title,
                description: data.description || '',
            },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.dispute.update({
            where: { id },
            data: { status },
        });
    }
    async remove(id) {
        return this.prisma.dispute.delete({
            where: { id },
        });
    }
};
DisputesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], DisputesService);
export { DisputesService };
//# sourceMappingURL=disputes.service.js.map
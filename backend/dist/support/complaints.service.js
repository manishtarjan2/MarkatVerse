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
let ComplaintsService = class ComplaintsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.complaint.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        return this.prisma.complaint.findUnique({ where: { id } });
    }
    async create(data) {
        return this.prisma.complaint.create({ data });
    }
    async update(id, data) {
        return this.prisma.complaint.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.complaint.delete({ where: { id } });
    }
};
ComplaintsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ComplaintsService);
export { ComplaintsService };
//# sourceMappingURL=complaints.service.js.map
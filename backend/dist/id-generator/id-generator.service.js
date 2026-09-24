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
let IdGeneratorService = class IdGeneratorService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getNextId(type, prefix, base = 0) {
        const counter = await this.prisma.counter.upsert({
            where: { id: type },
            update: { seq: { increment: 1 } },
            create: { id: type, seq: 1 },
        });
        return `${prefix}${base + counter.seq}`;
    }
    async generateUserId() {
        return this.getNextId('User', 'MV-', 10000000);
    }
    async generateBusinessId() {
        return this.getNextId('Business', 'BUS-', 1000);
    }
    async generateStaffId() {
        return this.getNextId('Staff', 'STAFF-', 2000);
    }
    async generateOrderId() {
        return this.getNextId('Order', 'ORD-', 50000);
    }
    async generateBookingId(isToken = false) {
        if (isToken) {
            return this.getNextId('Token', 'TOKEN-', 3000);
        }
        return this.getNextId('Booking', 'BOOK-', 8000);
    }
    async generateAuditLogId() {
        return this.getNextId('AuditLog', 'AUD-', 10000);
    }
};
IdGeneratorService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], IdGeneratorService);
export { IdGeneratorService };
//# sourceMappingURL=id-generator.service.js.map
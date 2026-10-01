var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
let ExceptionsService = class ExceptionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getExceptions(status) {
        const whereClause = status && status !== 'ALL' ? { status } : {};
        return this.prisma.automationException.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });
    }
    async resolveException(id, notes) {
        const exception = await this.prisma.automationException.findUnique({ where: { id } });
        if (!exception)
            throw new NotFoundException('Exception not found');
        return this.prisma.automationException.update({
            where: { id },
            data: {
                status: 'RESOLVED',
                details: { ...(exception.details || {}), resolveNotes: notes, resolvedAt: new Date().toISOString() },
            }
        });
    }
    async getAuditLogs(entityType, entityId) {
        const where = {};
        if (entityType)
            where.entityType = entityType;
        if (entityId)
            where.entityId = entityId;
        return this.prisma.auditLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
};
ExceptionsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ExceptionsService);
export { ExceptionsService };
//# sourceMappingURL=exceptions.service.js.map
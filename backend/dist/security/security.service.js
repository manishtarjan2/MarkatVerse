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
import { IdGeneratorService } from '../id-generator/id-generator.service.js';
let SecurityService = class SecurityService {
    prisma;
    idGenerator;
    constructor(prisma, idGenerator) {
        this.prisma = prisma;
        this.idGenerator = idGenerator;
    }
    async getAuditLogs() {
        const logs = await this.prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
        const userIds = [...new Set(logs.map(l => l.userId).filter(Boolean))];
        const users = await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, markatId: true }
        });
        const userMap = new Map(users.map(u => [u.id, u.markatId]));
        return logs.map(log => ({
            ...log,
            userMarkatId: log.userId ? userMap.get(log.userId) : null
        }));
    }
    async createAuditLog(data) {
        const logId = await this.idGenerator.generateAuditLogId();
        return this.prisma.auditLog.create({
            data: {
                ...data,
                logId,
            },
        });
    }
};
SecurityService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        IdGeneratorService])
], SecurityService);
export { SecurityService };
//# sourceMappingURL=security.service.js.map
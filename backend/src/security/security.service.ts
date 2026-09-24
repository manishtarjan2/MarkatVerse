import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { IdGeneratorService } from '../id-generator/id-generator.service.js';

@Injectable()
export class SecurityService {
  constructor(
    private prisma: PrismaService,
    private idGenerator: IdGeneratorService
  ) {}

  async getAuditLogs() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit for performance
    });
  }

  async createAuditLog(data: { action: string; resource: string; details?: string; userId?: string; ipAddress?: string }) {
    const logId = await this.idGenerator.generateAuditLogId();
    return this.prisma.auditLog.create({
      data: {
        ...data,
        logId,
      },
    });
  }
}

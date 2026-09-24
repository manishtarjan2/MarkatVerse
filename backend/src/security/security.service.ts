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
    const logs = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit for performance
    });

    const userIds = [...new Set(logs.map(l => l.userId).filter(Boolean))] as string[];
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

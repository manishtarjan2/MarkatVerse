import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class ExceptionsService {
  constructor(private prisma: PrismaService) {}

  async getExceptions(status?: string) {
    const whereClause = status && status !== 'ALL' ? { status } : {};
    
    return this.prisma.automationException.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolveException(id: string, notes?: string) {
    const exception = await this.prisma.automationException.findUnique({ where: { id } });
    if (!exception) throw new NotFoundException('Exception not found');

    return this.prisma.automationException.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        details: { ...(exception.details as object || {}), resolveNotes: notes, resolvedAt: new Date().toISOString() },
      }
    });
  }

  async getAuditLogs(entityType?: string, entityId?: string) {
    const where: any = {};
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}

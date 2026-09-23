import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class SecurityService {
  constructor(private prisma: PrismaService) {}

  async getAuditLogs() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit for performance
    });
  }

  async createAuditLog(data: { action: string; resource: string; details?: string; userId?: string; ipAddress?: string }) {
    return this.prisma.auditLog.create({
      data,
    });
  }
}

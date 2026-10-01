import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getSmsTemplates() {
    return (this.prisma as any).smsTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSmsTemplate(data: { title: string; message: string; status?: string }) {
    return (this.prisma as any).smsTemplate.create({
      data: {
        title: data.title,
        message: data.message,
        status: data.status || 'ACTIVE',
      },
    });
  }

  async updateSmsTemplate(id: string, data: any) {
    return (this.prisma as any).smsTemplate.update({
      where: { id },
      data,
    });
  }

  async deleteSmsTemplate(id: string) {
    return (this.prisma as any).smsTemplate.delete({
      where: { id },
    });
  }

  // --- PUSH TEMPLATES ---
  async getPushTemplates() {
    return (this.prisma as any).pushTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPushTemplate(data: { title: string; message: string; status?: string }) {
    return (this.prisma as any).pushTemplate.create({
      data: {
        title: data.title,
        message: data.message,
        status: data.status || 'ACTIVE',
      },
    });
  }

  async updatePushTemplate(id: string, data: any) {
    return (this.prisma as any).pushTemplate.update({
      where: { id },
      data,
    });
  }

  async deletePushTemplate(id: string) {
    return (this.prisma as any).pushTemplate.delete({
      where: { id },
    });
  }
}

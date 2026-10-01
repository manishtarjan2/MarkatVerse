import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getSmsTemplates() {
    return this.prisma.smsTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSmsTemplate(data: { title: string; message: string; status?: string }) {
    return this.prisma.smsTemplate.create({
      data: {
        title: data.title,
        message: data.message,
        status: data.status || 'ACTIVE',
      },
    });
  }

  async updateSmsTemplate(id: string, data: any) {
    return this.prisma.smsTemplate.update({
      where: { id },
      data,
    });
  }

  async deleteSmsTemplate(id: string) {
    return this.prisma.smsTemplate.delete({
      where: { id },
    });
  }

  // --- PUSH TEMPLATES ---
  async getPushTemplates() {
    return this.prisma.pushTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPushTemplate(data: { title: string; message: string; status?: string }) {
    return this.prisma.pushTemplate.create({
      data: {
        title: data.title,
        message: data.message,
        status: data.status || 'ACTIVE',
      },
    });
  }

  async updatePushTemplate(id: string, data: any) {
    return this.prisma.pushTemplate.update({
      where: { id },
      data,
    });
  }

  async deletePushTemplate(id: string) {
    return this.prisma.pushTemplate.delete({
      where: { id },
    });
  }

  // --- CORE NOTIFICATION ENGINE ---
  async sendNotification(payload: { type: string; recipientId: string; data: any }) {
    console.log(`[Notification Engine] Processing ${payload.type} for recipient ${payload.recipientId}`);
    
    // In a full implementation, this would:
    // 1. Fetch user preferences (email vs SMS vs push)
    // 2. Fetch the active template for payload.type
    // 3. Compile template (replace {{orderId}} with payload.data.orderId)
    // 4. Queue the job in BullMQ or send immediately via AWS SES/Twilio
    // 5. Log to AuditLog for history
    
    let mockMessage = '';
    if (payload.type === 'ORDER_PROCESSING') {
      mockMessage = `Your order ${payload.data.orderId} is now processing!`;
    } else if (payload.type === 'TOKEN_ISSUED') {
      mockMessage = `Your service token is ${payload.data.tokenId}. Please wait for your turn.`;
    } else if (payload.type === 'SELLER_WELCOME') {
      mockMessage = `Welcome to MarkatVerse! Your business registration is under review.`;
    } else {
      mockMessage = `You have a new notification of type ${payload.type}.`;
    }

    console.log(`[Notification Engine] MOCK SEND -> ${mockMessage}`);
    
    // Example: Log to a hypothetical Notifications table
    // return this.prisma.notificationHistory.create({ ... })
    return { success: true, message: mockMessage };
  }
}

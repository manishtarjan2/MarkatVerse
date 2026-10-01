import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../../notifications/notifications.service.js';

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('order.processing')
  async handleOrderProcessing(payload: { orderId: string, customerId: string }) {
    this.logger.log(`Received order.processing event for ${payload.orderId}`);
    await this.notificationsService.sendNotification({
      type: 'ORDER_PROCESSING',
      recipientId: payload.customerId,
      data: payload
    });
  }

  @OnEvent('token.issued')
  async handleTokenIssued(payload: { bookingId: string, tokenId: string, customerId: string }) {
    this.logger.log(`Received token.issued event for booking ${payload.bookingId}`);
    await this.notificationsService.sendNotification({
      type: 'TOKEN_ISSUED',
      recipientId: payload.customerId,
      data: payload
    });
  }

  @OnEvent('business.registered')
  async handleBusinessRegistered(payload: { businessId: string, ownerName: string, email: string }) {
    this.logger.log(`Received business.registered for ${payload.businessId}`);
    await this.notificationsService.sendNotification({
      type: 'SELLER_WELCOME',
      recipientId: payload.businessId,
      data: payload
    });
  }
}

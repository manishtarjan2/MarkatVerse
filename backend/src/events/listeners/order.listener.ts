import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma.service.js';
import { EventsService } from '../events.service.js';

@Injectable()
export class OrderListener {
  private readonly logger = new Logger(OrderListener.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService
  ) {}

  @OnEvent('payment.confirmed')
  async handlePaymentConfirmedEvent(payload: { referenceId: string, referenceType: string, businessId: string }) {
    this.logger.log(`Handling payment.confirmed for ${payload.referenceType} ${payload.referenceId}`);

    if (payload.referenceType === 'ORDER') {
      // 1. Auto-progress order to PROCESSING
      const updatedOrder = await this.prisma.order.update({
        where: { id: payload.referenceId },
        data: { status: 'PROCESSING' }
      });
      
      this.logger.log(`Order ${payload.referenceId} status updated to PROCESSING`);
      
      this.eventsService.emit('order.processing', { 
        orderId: payload.referenceId,
        customerId: updatedOrder.buyerId 
      });
      
    } else if (payload.referenceType === 'BOOKING') {
      // Token Automation: auto-generate queue token
      const booking = await this.prisma.serviceBooking.findUnique({
        where: { id: payload.referenceId },
        include: { queue: true }
      });

      if (booking && booking.queue && booking.queue.enableTokens) {
        const queueId = booking.queue.id;
        
        // Generate Token
        const updatedQueue = await this.prisma.serviceQueue.update({
          where: { id: queueId },
          data: { currentToken: { increment: 1 } }
        });

        await this.prisma.serviceBooking.update({
          where: { id: payload.referenceId },
          data: { 
            status: 'CONFIRMED',
            tokenNumber: updatedQueue.currentToken 
          }
        });

        this.logger.log(`Booking ${payload.referenceId} CONFIRMED and Token ${updatedQueue.currentToken} issued.`);

        this.eventsService.emit('token.issued', {
          bookingId: payload.referenceId,
          tokenId: `${updatedQueue.currentToken}`,
          customerId: booking.phone || booking.customerName
        });
      } else if (booking) {
        await this.prisma.serviceBooking.update({
          where: { id: payload.referenceId },
          data: { status: 'CONFIRMED' }
        });
      }
    }
  }
}

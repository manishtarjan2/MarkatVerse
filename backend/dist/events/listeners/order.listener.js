var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OrderListener_1;
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma.service.js';
import { EventsService } from '../events.service.js';
let OrderListener = OrderListener_1 = class OrderListener {
    prisma;
    eventsService;
    logger = new Logger(OrderListener_1.name);
    constructor(prisma, eventsService) {
        this.prisma = prisma;
        this.eventsService = eventsService;
    }
    async handlePaymentConfirmedEvent(payload) {
        this.logger.log(`Handling payment.confirmed for ${payload.referenceType} ${payload.referenceId}`);
        if (payload.referenceType === 'ORDER') {
            const updatedOrder = await this.prisma.order.update({
                where: { id: payload.referenceId },
                data: { status: 'PROCESSING' }
            });
            this.logger.log(`Order ${payload.referenceId} status updated to PROCESSING`);
            this.eventsService.emit('order.processing', {
                orderId: payload.referenceId,
                customerId: updatedOrder.buyerId
            });
        }
        else if (payload.referenceType === 'BOOKING') {
            const booking = await this.prisma.serviceBooking.findUnique({
                where: { id: payload.referenceId },
                include: { queue: true }
            });
            if (booking && booking.queue && booking.queue.enableTokens) {
                const queueId = booking.queue.id;
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
            }
            else if (booking) {
                await this.prisma.serviceBooking.update({
                    where: { id: payload.referenceId },
                    data: { status: 'CONFIRMED' }
                });
            }
        }
    }
};
__decorate([
    OnEvent('payment.confirmed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderListener.prototype, "handlePaymentConfirmedEvent", null);
OrderListener = OrderListener_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        EventsService])
], OrderListener);
export { OrderListener };
//# sourceMappingURL=order.listener.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationListener_1;
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../../notifications/notifications.service.js';
let NotificationListener = NotificationListener_1 = class NotificationListener {
    notificationsService;
    logger = new Logger(NotificationListener_1.name);
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async handleOrderProcessing(payload) {
        this.logger.log(`Received order.processing event for ${payload.orderId}`);
        await this.notificationsService.sendNotification({
            type: 'ORDER_PROCESSING',
            recipientId: payload.customerId,
            data: payload
        });
    }
    async handleTokenIssued(payload) {
        this.logger.log(`Received token.issued event for booking ${payload.bookingId}`);
        await this.notificationsService.sendNotification({
            type: 'TOKEN_ISSUED',
            recipientId: payload.customerId,
            data: payload
        });
    }
    async handleBusinessRegistered(payload) {
        this.logger.log(`Received business.registered for ${payload.businessId}`);
        await this.notificationsService.sendNotification({
            type: 'SELLER_WELCOME',
            recipientId: payload.businessId,
            data: payload
        });
    }
};
__decorate([
    OnEvent('order.processing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationListener.prototype, "handleOrderProcessing", null);
__decorate([
    OnEvent('token.issued'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationListener.prototype, "handleTokenIssued", null);
__decorate([
    OnEvent('business.registered'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationListener.prototype, "handleBusinessRegistered", null);
NotificationListener = NotificationListener_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [NotificationsService])
], NotificationListener);
export { NotificationListener };
//# sourceMappingURL=notification.listener.js.map
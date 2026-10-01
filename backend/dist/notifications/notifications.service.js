var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSmsTemplates() {
        return this.prisma.smsTemplate.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async createSmsTemplate(data) {
        return this.prisma.smsTemplate.create({
            data: {
                title: data.title,
                message: data.message,
                status: data.status || 'ACTIVE',
            },
        });
    }
    async updateSmsTemplate(id, data) {
        return this.prisma.smsTemplate.update({
            where: { id },
            data,
        });
    }
    async deleteSmsTemplate(id) {
        return this.prisma.smsTemplate.delete({
            where: { id },
        });
    }
    async getPushTemplates() {
        return this.prisma.pushTemplate.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async createPushTemplate(data) {
        return this.prisma.pushTemplate.create({
            data: {
                title: data.title,
                message: data.message,
                status: data.status || 'ACTIVE',
            },
        });
    }
    async updatePushTemplate(id, data) {
        return this.prisma.pushTemplate.update({
            where: { id },
            data,
        });
    }
    async deletePushTemplate(id) {
        return this.prisma.pushTemplate.delete({
            where: { id },
        });
    }
};
NotificationsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], NotificationsService);
export { NotificationsService };
//# sourceMappingURL=notifications.service.js.map
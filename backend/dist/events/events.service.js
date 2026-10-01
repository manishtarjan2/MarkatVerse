var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EventsService_1;
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma.service.js';
let EventsService = EventsService_1 = class EventsService {
    eventEmitter;
    prisma;
    logger = new Logger(EventsService_1.name);
    constructor(eventEmitter, prisma) {
        this.eventEmitter = eventEmitter;
        this.prisma = prisma;
    }
    emit(event, payload) {
        this.logger.log(`Emitting Event: ${event}`);
        this.eventEmitter.emit(event, payload);
    }
    async logAction(data) {
        try {
            return await this.prisma.auditLog.create({
                data: {
                    action: data.action,
                    entityType: data.entityType,
                    entityId: data.entityId,
                    actorId: data.actorId,
                    actorRole: data.actorRole,
                    detailsJson: data.details,
                    status: data.status || 'SUCCESS',
                },
            });
        }
        catch (error) {
            this.logger.error(`Failed to write audit log: ${error.message}`);
        }
    }
    async logException(data) {
        try {
            this.logger.warn(`AUTOMATION EXCEPTION: [${data.type}] ${data.message}`);
            return await this.prisma.automationException.create({
                data: {
                    type: data.type,
                    severity: data.severity || 'NORMAL',
                    referenceId: data.referenceId,
                    referenceType: data.referenceType,
                    message: data.message,
                    details: data.details,
                    status: 'PENDING',
                },
            });
        }
        catch (error) {
            this.logger.error(`Failed to record automation exception: ${error.message}`);
        }
    }
};
EventsService = EventsService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [EventEmitter2,
        PrismaService])
], EventsService);
export { EventsService };
//# sourceMappingURL=events.service.js.map
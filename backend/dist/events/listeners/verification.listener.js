var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VerificationListener_1;
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma.service.js';
import { EventsService } from '../events.service.js';
let VerificationListener = VerificationListener_1 = class VerificationListener {
    prisma;
    eventsService;
    logger = new Logger(VerificationListener_1.name);
    constructor(prisma, eventsService) {
        this.prisma = prisma;
        this.eventsService = eventsService;
    }
    async handleBusinessRegistration(payload) {
        this.logger.log(`Starting automated verification for business ${payload.businessId}`);
        try {
            const business = await this.prisma.business.findUnique({
                where: { id: payload.businessId },
                include: { user: true },
            });
            if (!business) {
                throw new Error('Business not found for verification');
            }
            const hasBasicInfo = !!(business.name && business.businessType && business.sector);
            const hasContactInfo = !!(business.user.phone || business.user.email);
            const isMissingAddress = !business.latitude || !business.longitude;
            if (!hasBasicInfo || !hasContactInfo) {
                await this.prisma.business.update({
                    where: { id: business.id },
                    data: { verificationStatus: 'ACTION_REQUIRED', verificationNotes: 'Missing basic or contact info' },
                });
                await this.eventsService.logException({
                    type: 'VERIFICATION_FAILED',
                    message: 'Business missing basic information for auto-verification',
                    referenceId: business.id,
                    referenceType: 'Business',
                });
                return;
            }
            if (isMissingAddress) {
                await this.prisma.business.update({
                    where: { id: business.id },
                    data: { verificationStatus: 'ADMIN_REVIEW_REQUIRED', verificationNotes: 'Missing location data' },
                });
                await this.eventsService.logException({
                    type: 'MISSING_LOCATION',
                    message: 'Business registered without coordinates',
                    referenceId: business.id,
                    referenceType: 'Business',
                });
                return;
            }
            await this.prisma.business.update({
                where: { id: business.id },
                data: {
                    verificationStatus: 'AUTO_VERIFIED',
                    verified: true,
                    verificationLevel: 1
                },
            });
            await this.eventsService.logAction({
                action: 'BUSINESS_AUTO_VERIFIED',
                entityType: 'Business',
                entityId: business.id,
                actorRole: 'SYSTEM',
                status: 'SUCCESS',
            });
            this.logger.log(`Business ${business.id} successfully AUTO-VERIFIED`);
        }
        catch (error) {
            this.logger.error(`Failed to execute verification workflow: ${error.message}`);
        }
    }
};
__decorate([
    OnEvent('business.registered', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VerificationListener.prototype, "handleBusinessRegistration", null);
VerificationListener = VerificationListener_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        EventsService])
], VerificationListener);
export { VerificationListener };
//# sourceMappingURL=verification.listener.js.map
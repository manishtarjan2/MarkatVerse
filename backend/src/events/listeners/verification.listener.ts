import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma.service.js';
import { EventsService } from '../events.service.js';

@Injectable()
export class VerificationListener {
  private readonly logger = new Logger(VerificationListener.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService,
  ) {}

  @OnEvent('business.registered', { async: true })
  async handleBusinessRegistration(payload: { businessId: string }) {
    this.logger.log(`Starting automated verification for business ${payload.businessId}`);

    try {
      const business = await this.prisma.business.findUnique({
        where: { id: payload.businessId },
        include: { user: true },
      });

      if (!business) {
        throw new Error('Business not found for verification');
      }

      // RULE 1: Basic Information Check
      const hasBasicInfo = !!(business.name && business.businessType && business.sector);
      const hasContactInfo = !!(business.user.phone || business.user.email);
      const isMissingAddress = !business.latitude || !business.longitude;

      if (!hasBasicInfo || !hasContactInfo) {
        // Not enough info to auto-verify
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
        // Needs manual review or action
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

      // If all basic checks pass, Auto-Verify
      await this.prisma.business.update({
        where: { id: business.id },
        data: { 
          verificationStatus: 'AUTO_VERIFIED',
          verified: true, // legacy field
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

    } catch (error: any) {
      this.logger.error(`Failed to execute verification workflow: ${error.message}`);
    }
  }
}

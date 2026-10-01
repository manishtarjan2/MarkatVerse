import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma.service.js';

export interface AuditLogDto {
  action: string;
  entityType: string;
  entityId?: string;
  actorId?: string;
  actorRole?: string;
  details?: Record<string, any>;
  status?: 'SUCCESS' | 'FAILED';
}

export interface ExceptionDto {
  type: string;
  severity?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  referenceId?: string;
  referenceType?: string;
  message: string;
  details?: Record<string, any>;
}

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private prisma: PrismaService,
  ) {}

  /**
   * Broadcast an event to the rest of the application
   */
  emit(event: string, payload: any) {
    this.logger.log(`Emitting Event: ${event}`);
    this.eventEmitter.emit(event, payload);
  }

  /**
   * Record an action in the database Audit Log
   */
  async logAction(data: AuditLogDto) {
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
    } catch (error: any) {
      this.logger.error(`Failed to write audit log: ${error.message}`);
    }
  }

  /**
   * Queue an issue in the Exception Center for Human Admin review
   */
  async logException(data: ExceptionDto) {
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
    } catch (error: any) {
      this.logger.error(`Failed to record automation exception: ${error.message}`);
    }
  }
}

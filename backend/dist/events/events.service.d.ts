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
export declare class EventsService {
    private eventEmitter;
    private prisma;
    private readonly logger;
    constructor(eventEmitter: EventEmitter2, prisma: PrismaService);
    emit(event: string, payload: any): void;
    logAction(data: AuditLogDto): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        userId: string | null;
        logId: string | null;
        action: string;
        resource: string | null;
        entityType: string | null;
        entityId: string | null;
        details: string | null;
        detailsJson: import("@prisma/client/runtime/library").JsonValue | null;
        actorRole: string | null;
        ipAddress: string | null;
    } | undefined>;
    logException(data: ExceptionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        type: string;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        severity: string;
        referenceId: string | null;
        referenceType: string | null;
        message: string;
        assignedTo: string | null;
    } | undefined>;
}

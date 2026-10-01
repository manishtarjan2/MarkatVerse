import { PrismaService } from '../prisma.service.js';
export declare class ExceptionsService {
    private prisma;
    constructor(prisma: PrismaService);
    getExceptions(status?: string): Promise<{
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
    }[]>;
    resolveException(id: string, notes?: string): Promise<{
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
    }>;
    getAuditLogs(entityType?: string, entityId?: string): Promise<{
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
    }[]>;
}

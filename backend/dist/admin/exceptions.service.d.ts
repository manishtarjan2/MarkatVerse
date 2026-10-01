import { PrismaService } from '../prisma.service.js';
export declare class ExceptionsService {
    private prisma;
    constructor(prisma: PrismaService);
    getExceptions(status?: string): Promise<{
        id: string;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        status: string;
        createdAt: Date;
        type: string;
        severity: string;
        referenceId: string | null;
        referenceType: string | null;
        message: string;
        assignedTo: string | null;
        updatedAt: Date;
    }[]>;
    resolveException(id: string, notes?: string): Promise<{
        id: string;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        status: string;
        createdAt: Date;
        type: string;
        severity: string;
        referenceId: string | null;
        referenceType: string | null;
        message: string;
        assignedTo: string | null;
        updatedAt: Date;
    }>;
    getAuditLogs(entityType?: string, entityId?: string): Promise<{
        id: string;
        logId: string | null;
        action: string;
        resource: string | null;
        entityType: string | null;
        entityId: string | null;
        details: string | null;
        detailsJson: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string | null;
        actorRole: string | null;
        ipAddress: string | null;
        status: string;
        createdAt: Date;
    }[]>;
}

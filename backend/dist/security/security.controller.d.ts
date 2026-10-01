import { SecurityService } from './security.service.js';
export declare class SecurityController {
    private readonly securityService;
    constructor(securityService: SecurityService);
    getAuditLogs(): Promise<{
        userMarkatId: string | null | undefined;
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
    createAuditLog(body: any): Promise<{
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
    }>;
}

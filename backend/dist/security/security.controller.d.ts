import { SecurityService } from './security.service.js';
export declare class SecurityController {
    private readonly securityService;
    constructor(securityService: SecurityService);
    getAuditLogs(): Promise<{
        userMarkatId: string | null | undefined;
        id: string;
        createdAt: Date;
        userId: string | null;
        logId: string | null;
        action: string;
        resource: string;
        details: string | null;
        ipAddress: string | null;
    }[]>;
    createAuditLog(body: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        logId: string | null;
        action: string;
        resource: string;
        details: string | null;
        ipAddress: string | null;
    }>;
}

import { SecurityService } from './security.service.js';
export declare class SecurityController {
    private readonly securityService;
    constructor(securityService: SecurityService);
    getAuditLogs(): Promise<{
        id: string;
        logId: string | null;
        action: string;
        resource: string;
        details: string | null;
        userId: string | null;
        ipAddress: string | null;
        createdAt: Date;
    }[]>;
    createAuditLog(body: any): Promise<{
        id: string;
        logId: string | null;
        action: string;
        resource: string;
        details: string | null;
        userId: string | null;
        ipAddress: string | null;
        createdAt: Date;
    }>;
}

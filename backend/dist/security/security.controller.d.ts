import { SecurityService } from './security.service.js';
export declare class SecurityController {
    private readonly securityService;
    constructor(securityService: SecurityService);
    getAuditLogs(): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        resource: string;
        action: string;
        details: string | null;
        ipAddress: string | null;
    }[]>;
    createAuditLog(body: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        resource: string;
        action: string;
        details: string | null;
        ipAddress: string | null;
    }>;
}

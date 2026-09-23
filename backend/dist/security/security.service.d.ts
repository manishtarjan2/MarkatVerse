import { PrismaService } from '../prisma.service.js';
export declare class SecurityService {
    private prisma;
    constructor(prisma: PrismaService);
    getAuditLogs(): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        resource: string;
        action: string;
        details: string | null;
        ipAddress: string | null;
    }[]>;
    createAuditLog(data: {
        action: string;
        resource: string;
        details?: string;
        userId?: string;
        ipAddress?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        resource: string;
        action: string;
        details: string | null;
        ipAddress: string | null;
    }>;
}

import { PrismaService } from '../prisma.service.js';
import { IdGeneratorService } from '../id-generator/id-generator.service.js';
export declare class SecurityService {
    private prisma;
    private idGenerator;
    constructor(prisma: PrismaService, idGenerator: IdGeneratorService);
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
    createAuditLog(data: {
        action: string;
        resource: string;
        details?: string;
        userId?: string;
        ipAddress?: string;
    }): Promise<{
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

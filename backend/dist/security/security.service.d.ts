import { PrismaService } from '../prisma.service.js';
import { IdGeneratorService } from '../id-generator/id-generator.service.js';
export declare class SecurityService {
    private prisma;
    private idGenerator;
    constructor(prisma: PrismaService, idGenerator: IdGeneratorService);
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
        logId: string | null;
        action: string;
        resource: string;
        details: string | null;
        ipAddress: string | null;
    }>;
}

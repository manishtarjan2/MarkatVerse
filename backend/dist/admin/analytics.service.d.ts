import { PrismaService } from '../prisma.service.js';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSummary(): Promise<{
        totalUsers: number;
        totalSellers: number;
        totalProducts: number;
        totalQueues: number;
        totalOrders: number;
        totalLeads: number;
    }>;
}

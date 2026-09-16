import { AnalyticsService } from './analytics.service.js';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getSummary(): Promise<{
        totalUsers: number;
        totalSellers: number;
        totalProducts: number;
        totalQueues: number;
        totalOrders: number;
        totalLeads: number;
    }>;
}

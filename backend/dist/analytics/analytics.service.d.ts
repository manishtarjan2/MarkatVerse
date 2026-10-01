import { PrismaService } from '../prisma.service.js';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardMetrics(): Promise<{
        totalSellers: number;
        totalBuyers: number;
        activeOrders: number;
        totalVolume: number;
        totalPlatformRevenue: number;
        openExceptions: number;
        recentTransactions: {
            sellerName: string;
            wallet: {
                business: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    updatedAt: Date;
                    businessCode: string | null;
                    userId: string;
                    logo: string | null;
                    description: string | null;
                    businessModel: import(".prisma/client").$Enums.MainType;
                    businessType: string;
                    sector: string | null;
                    address: string | null;
                    pincode: string | null;
                    latitude: number | null;
                    longitude: number | null;
                    gstNumber: string | null;
                    businessHours: import("@prisma/client/runtime/library").JsonValue | null;
                    verified: boolean;
                    verificationStatus: string;
                    verificationLevel: number;
                    verificationNotes: string | null;
                    capabilities: string[];
                    maxListings: number;
                    commissionType: string;
                    commissionRate: number;
                    subscriptionStatus: string;
                    subscriptionStartDate: Date | null;
                    subscriptionEndDate: Date | null;
                };
            } & {
                id: string;
                createdAt: Date;
                businessId: string;
                totalEarnings: number;
                pendingBalance: number;
                availableBalance: number;
                withdrawn: number;
                owedToPlatform: number;
                updatedAt: Date;
            };
            grossAmount: number;
            platformFee: number;
            type: string;
            commission: number;
            tax: number;
            netAmount: number;
            status: string;
            id: string;
            walletId: string;
            referenceId: string | null;
            referenceType: string | null;
            paymentRef: string | null;
            createdAt: Date;
            settledAt: Date | null;
        }[];
    }>;
}

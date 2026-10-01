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
        gmv: number;
        commission: number;
        bookings: number;
        retentionRate: string;
    }>;
    getFinanceData(): Promise<{
        transactions: ({
            wallet: {
                business: {
                    name: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                totalEarnings: number;
                pendingBalance: number;
                availableBalance: number;
                withdrawn: number;
                owedToPlatform: number;
            };
        } & {
            commission: number;
            id: string;
            createdAt: Date;
            status: string;
            type: string;
            referenceId: string | null;
            referenceType: string | null;
            walletId: string;
            paymentRef: string | null;
            grossAmount: number;
            platformFee: number;
            tax: number;
            netAmount: number;
            settledAt: Date | null;
        })[];
        withdrawals: ({
            wallet: {
                business: {
                    name: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                totalEarnings: number;
                pendingBalance: number;
                availableBalance: number;
                withdrawn: number;
                owedToPlatform: number;
            };
            bankAccount: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                accountName: string;
                accountNumber: string;
                ifscCode: string | null;
                bankName: string;
                isPrimary: boolean;
                isVerified: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            status: string;
            walletId: string;
            netAmount: number;
            amount: number;
            bankAccountId: string;
            fee: number;
            referenceNumber: string | null;
            processedAt: Date | null;
        })[];
    }>;
}

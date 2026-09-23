import { PrismaService } from '../prisma.service.js';
export declare class AdminBusinessService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllBusinesses(): Promise<({
        user: {
            email: string | null;
            phone: string | null;
            name: string;
        };
        wallet: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            totalEarnings: number;
            pendingBalance: number;
            availableBalance: number;
            withdrawn: number;
            owedToPlatform: number;
        } | null;
    } & {
        businessType: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        pincode: string | null;
        latitude: number | null;
        longitude: number | null;
        businessCode: string | null;
        userId: string;
        logo: string | null;
        businessModel: import(".prisma/client").$Enums.MainType;
        address: string | null;
        verified: boolean;
        capabilities: string[];
        maxListings: number;
        commissionType: string;
        commissionRate: number;
        subscriptionStatus: string;
        subscriptionStartDate: Date | null;
        subscriptionEndDate: Date | null;
    })[]>;
    updateSubscription(id: string, data: {
        subscriptionStatus: string;
        subscriptionStartDate: Date | null;
        subscriptionEndDate: Date | null;
    }): Promise<{
        businessType: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        pincode: string | null;
        latitude: number | null;
        longitude: number | null;
        businessCode: string | null;
        userId: string;
        logo: string | null;
        businessModel: import(".prisma/client").$Enums.MainType;
        address: string | null;
        verified: boolean;
        capabilities: string[];
        maxListings: number;
        commissionType: string;
        commissionRate: number;
        subscriptionStatus: string;
        subscriptionStartDate: Date | null;
        subscriptionEndDate: Date | null;
    }>;
    updateBilling(id: string, data: {
        commissionType: string;
        commissionRate: number;
        subscriptionStatus: string;
        subscriptionStartDate: Date | null;
        subscriptionEndDate: Date | null;
    }): Promise<{
        businessType: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        pincode: string | null;
        latitude: number | null;
        longitude: number | null;
        businessCode: string | null;
        userId: string;
        logo: string | null;
        businessModel: import(".prisma/client").$Enums.MainType;
        address: string | null;
        verified: boolean;
        capabilities: string[];
        maxListings: number;
        commissionType: string;
        commissionRate: number;
        subscriptionStatus: string;
        subscriptionStartDate: Date | null;
        subscriptionEndDate: Date | null;
    }>;
}

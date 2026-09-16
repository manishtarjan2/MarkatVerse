import { AdminBusinessService } from './admin-business.service.js';
export declare class AdminBusinessController {
    private readonly adminBusinessService;
    constructor(adminBusinessService: AdminBusinessService);
    getAllBusinesses(): Promise<({
        user: {
            name: string;
            email: string | null;
            phone: string | null;
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
        description: string | null;
        pincode: string | null;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
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
    updateSubscription(id: string, body: {
        subscriptionStatus: string;
        subscriptionStartDate: string | null;
        subscriptionEndDate: string | null;
    }): Promise<{
        businessType: string;
        id: string;
        name: string;
        description: string | null;
        pincode: string | null;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
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

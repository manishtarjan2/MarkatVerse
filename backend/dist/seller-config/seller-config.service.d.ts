import { PrismaService } from '../prisma.service.js';
export declare class SellerConfigService {
    private prisma;
    constructor(prisma: PrismaService);
    getSellerCapabilities(userId: string): Promise<{
        businessId: string;
        capabilities: string[];
        features: any[];
        businessType: string;
        businessModel: import(".prisma/client").$Enums.MainType;
    }>;
    updateSellerCapabilities(businessId: string, requestedFeatures: string[]): Promise<{
        businessId: string;
        capabilities: string[];
        features: any[];
        businessType: string;
        businessModel: import(".prisma/client").$Enums.MainType;
    }>;
    private getSellerCapabilitiesByBusiness;
}

import { SellerConfigService } from './seller-config.service.js';
export declare class SellerConfigController {
    private readonly sellerConfigService;
    constructor(sellerConfigService: SellerConfigService);
    getCapabilities(userId: string): Promise<{
        businessId: string;
        capabilities: string[];
        features: any[];
        businessType: string;
        businessModel: import(".prisma/client").$Enums.MainType;
    }>;
    updateCapabilities(businessId: string, features: string[]): Promise<{
        businessId: string;
        capabilities: string[];
        features: any[];
        businessType: string;
        businessModel: import(".prisma/client").$Enums.MainType;
    }>;
}

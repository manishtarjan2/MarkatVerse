import { SellersService } from './sellers.service.js';
export declare class SellersController {
    private readonly sellersService;
    constructor(sellersService: SellersService);
    create(createSellerDto: any): Promise<{
        status: string;
        id: string;
        businessType: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        logo: string | null;
        businessModel: import(".prisma/client").$Enums.MainType;
        address: string | null;
        verified: boolean;
        capabilities: string[];
    } | {
        ownerName: string;
        email: string | null;
        phone: string | null;
        status: string;
        id: string;
        businessType: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        logo: string | null;
        businessModel: import(".prisma/client").$Enums.MainType;
        address: string | null;
        verified: boolean;
        capabilities: string[];
    }>;
    findAll(): Promise<{
        id: string;
        businessName: string;
        ownerName: string;
        email: string | null;
        phone: string | null;
        businessType: string;
        address: string | null;
        status: string;
        date: string;
    }[]>;
    updateStatus(id: string, status: string): Promise<{
        status: string;
        id: string;
        businessType: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        logo: string | null;
        businessModel: import(".prisma/client").$Enums.MainType;
        address: string | null;
        verified: boolean;
        capabilities: string[];
    }>;
    updateUser(userId: string, data: any): Promise<{
        id: string;
        businessType: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        logo: string | null;
        businessModel: import(".prisma/client").$Enums.MainType;
        address: string | null;
        verified: boolean;
        capabilities: string[];
    }>;
    removeUser(userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        password: string;
        role: string;
    }>;
}

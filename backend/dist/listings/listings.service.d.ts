import { PrismaService } from '../prisma.service.js';
export declare class ListingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllListings(filters: {
        sectorId?: string;
        businessTypeId?: string;
        status?: string;
    }): Promise<({
        category: {
            workflow: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            parameters: import("@prisma/client/runtime/library").JsonValue | null;
            theme: string | null;
            icon: string | null;
            primaryType: string | null;
            allowedListingTypes: string[];
            businessModels: string[];
            allowedFeatures: string[];
            notApplicable: string[];
            optionalFeatures: string[];
            subcategories: import("@prisma/client/runtime/library").JsonValue | null;
            defaultCommissionRate: number | null;
            defaultFlatRate: number | null;
            parentId: string | null;
            sectorId: string | null;
        } | null;
        businessType: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            mainType: import(".prisma/client").$Enums.MainType;
            isActive: boolean;
        };
        sector: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            businessTypeId: string;
        };
        seller: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sellerId: string;
        status: string;
        description: string | null;
        categoryId: string | null;
        businessTypeId: string;
        sectorId: string;
        title: string;
        attributes: import("@prisma/client/runtime/library").JsonValue | null;
        pricingConfig: import("@prisma/client/runtime/library").JsonValue | null;
        availability: import("@prisma/client/runtime/library").JsonValue | null;
        media: string[];
    })[]>;
    getListingById(id: string): Promise<{
        category: {
            workflow: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            parameters: import("@prisma/client/runtime/library").JsonValue | null;
            theme: string | null;
            icon: string | null;
            primaryType: string | null;
            allowedListingTypes: string[];
            businessModels: string[];
            allowedFeatures: string[];
            notApplicable: string[];
            optionalFeatures: string[];
            subcategories: import("@prisma/client/runtime/library").JsonValue | null;
            defaultCommissionRate: number | null;
            defaultFlatRate: number | null;
            parentId: string | null;
            sectorId: string | null;
        } | null;
        businessType: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            mainType: import(".prisma/client").$Enums.MainType;
            isActive: boolean;
        };
        sector: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            businessTypeId: string;
        };
        seller: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sellerId: string;
        status: string;
        description: string | null;
        categoryId: string | null;
        businessTypeId: string;
        sectorId: string;
        title: string;
        attributes: import("@prisma/client/runtime/library").JsonValue | null;
        pricingConfig: import("@prisma/client/runtime/library").JsonValue | null;
        availability: import("@prisma/client/runtime/library").JsonValue | null;
        media: string[];
    }>;
    createListing(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sellerId: string;
        status: string;
        description: string | null;
        categoryId: string | null;
        businessTypeId: string;
        sectorId: string;
        title: string;
        attributes: import("@prisma/client/runtime/library").JsonValue | null;
        pricingConfig: import("@prisma/client/runtime/library").JsonValue | null;
        availability: import("@prisma/client/runtime/library").JsonValue | null;
        media: string[];
    }>;
    updateListing(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sellerId: string;
        status: string;
        description: string | null;
        categoryId: string | null;
        businessTypeId: string;
        sectorId: string;
        title: string;
        attributes: import("@prisma/client/runtime/library").JsonValue | null;
        pricingConfig: import("@prisma/client/runtime/library").JsonValue | null;
        availability: import("@prisma/client/runtime/library").JsonValue | null;
        media: string[];
    }>;
    deleteListing(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sellerId: string;
        status: string;
        description: string | null;
        categoryId: string | null;
        businessTypeId: string;
        sectorId: string;
        title: string;
        attributes: import("@prisma/client/runtime/library").JsonValue | null;
        pricingConfig: import("@prisma/client/runtime/library").JsonValue | null;
        availability: import("@prisma/client/runtime/library").JsonValue | null;
        media: string[];
    }>;
}

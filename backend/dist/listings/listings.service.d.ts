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
            id: string;
            workflow: string | null;
            name: string;
            parameters: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
            theme: string | null;
            icon: string | null;
            primaryType: string | null;
            allowedListingTypes: string[];
            businessModels: string[];
            allowedFeatures: string[];
            notApplicable: string[];
            optionalFeatures: string[];
            subcategories: import("@prisma/client/runtime/library").JsonValue | null;
            parentId: string | null;
            sectorId: string | null;
        } | null;
        businessType: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            mainType: import(".prisma/client").$Enums.MainType;
            isActive: boolean;
        };
        sector: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            businessTypeId: string;
        };
        seller: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        sellerId: string;
        categoryId: string | null;
        status: string;
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
            id: string;
            workflow: string | null;
            name: string;
            parameters: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
            theme: string | null;
            icon: string | null;
            primaryType: string | null;
            allowedListingTypes: string[];
            businessModels: string[];
            allowedFeatures: string[];
            notApplicable: string[];
            optionalFeatures: string[];
            subcategories: import("@prisma/client/runtime/library").JsonValue | null;
            parentId: string | null;
            sectorId: string | null;
        } | null;
        businessType: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            mainType: import(".prisma/client").$Enums.MainType;
            isActive: boolean;
        };
        sector: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            businessTypeId: string;
        };
        seller: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        sellerId: string;
        categoryId: string | null;
        status: string;
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
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        sellerId: string;
        categoryId: string | null;
        status: string;
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
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        sellerId: string;
        categoryId: string | null;
        status: string;
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
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        sellerId: string;
        categoryId: string | null;
        status: string;
        businessTypeId: string;
        sectorId: string;
        title: string;
        attributes: import("@prisma/client/runtime/library").JsonValue | null;
        pricingConfig: import("@prisma/client/runtime/library").JsonValue | null;
        availability: import("@prisma/client/runtime/library").JsonValue | null;
        media: string[];
    }>;
}

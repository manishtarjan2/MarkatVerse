import { ConfigurationService } from './configuration.service.js';
import { MainType } from '@prisma/client';
export declare class ConfigurationController {
    private readonly configService;
    constructor(configService: ConfigurationService);
    getBusinessTypes(mainType?: MainType): Promise<({
        sectors: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            businessTypeId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        mainType: import(".prisma/client").$Enums.MainType;
        isActive: boolean;
    })[]>;
    createBusinessType(data: {
        mainType: MainType;
        name: string;
        description?: string;
    }): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        mainType: import(".prisma/client").$Enums.MainType;
        isActive: boolean;
    }>;
    getSectors(businessTypeId?: string): Promise<({
        categories: {
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
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        businessTypeId: string;
    })[]>;
    createSector(data: {
        businessTypeId: string;
        name: string;
        description?: string;
    }): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        businessTypeId: string;
    }>;
    updateSector(id: string, data: {
        isActive?: boolean;
        name?: string;
        description?: string;
    }): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        businessTypeId: string;
    }>;
    getCategories(sectorId?: string): Promise<{
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
    }[]>;
    createCategory(data: {
        sectorId: string;
        name: string;
        parentId?: string;
    }): Promise<{
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
    }>;
    getWorkflows(): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        version: number;
        steps: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    createWorkflow(data: {
        name: string;
        description?: string;
        steps: any;
    }): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        version: number;
        steps: import("@prisma/client/runtime/library").JsonValue;
    }>;
}

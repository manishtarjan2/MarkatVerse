import { PrismaService } from '../prisma.service.js';
export declare class SystemConfigService {
    private prisma;
    constructor(prisma: PrismaService);
    getSeoConfig(): Promise<{
        title: string;
        description: string;
    }>;
    updateSeoConfig(data: {
        title: string;
        description: string;
    }): Promise<{
        title: string;
        description: string;
    }>;
    getAuthConfig(): Promise<{
        enableEmail: boolean;
        enablePhone: boolean;
        enableGoogle: boolean;
        require2FA: boolean;
    }>;
    updateAuthConfig(data: {
        enableEmail: boolean;
        enablePhone: boolean;
        enableGoogle: boolean;
        require2FA: boolean;
    }): Promise<{
        enableEmail: boolean;
        enablePhone: boolean;
        enableGoogle: boolean;
        require2FA: boolean;
    }>;
    getQueueConfig(): Promise<{
        travelSpeedKmh: number;
        notificationBufferMin: number;
    }>;
    updateQueueConfig(data: {
        travelSpeedKmh: number;
        notificationBufferMin: number;
    }): Promise<{
        travelSpeedKmh: number;
        notificationBufferMin: number;
    }>;
    getPaymentMethods(): Promise<any>;
    savePaymentMethods(methods: any[]): Promise<any[]>;
    addPaymentMethod(data: any): Promise<any[]>;
    updatePaymentMethod(id: string, data: any): Promise<any[]>;
    deletePaymentMethod(id: string): Promise<any[]>;
    getTaxRules(): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        rate: number;
    }[]>;
    addTaxRule(data: {
        name: string;
        rate: number;
        status?: string;
    }): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        rate: number;
    }>;
    updateTaxRule(id: string, data: {
        name?: string;
        rate?: number;
        status?: string;
    }): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        rate: number;
    }>;
    deleteTaxRule(id: string): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        rate: number;
    }>;
}

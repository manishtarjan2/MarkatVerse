import { PrismaService } from '../prisma.service.js';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<any>;
    findAll(location?: string, lat?: number, lng?: number, radius?: number): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
    updateAdminStatus(id: string, status: string): Promise<any>;
    toggleDummyData(enable: boolean): Promise<{
        success: boolean;
        message: string;
    }>;
    getDummyStatus(): Promise<{
        enabled: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    private mapProduct;
}

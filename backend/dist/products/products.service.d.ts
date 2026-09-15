import { PrismaService } from '../prisma.service.js';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    private mapProduct;
}

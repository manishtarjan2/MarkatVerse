import { PrismaService } from '../prisma.service.js';
export declare class ComplaintsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: string;
        title: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: string;
        title: string;
    } | null>;
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: string;
        title: string;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: string;
        title: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        status: string;
        title: string;
    }>;
}

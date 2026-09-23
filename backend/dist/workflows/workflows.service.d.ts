import { PrismaService } from '../prisma.service.js';
import { Prisma } from '@prisma/client';
export declare class WorkflowsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.WorkflowCreateInput): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        version: number;
        steps: Prisma.JsonValue;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        version: number;
        steps: Prisma.JsonValue;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        version: number;
        steps: Prisma.JsonValue;
    }>;
    update(id: string, data: Prisma.WorkflowUpdateInput): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        version: number;
        steps: Prisma.JsonValue;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        version: number;
        steps: Prisma.JsonValue;
    }>;
}

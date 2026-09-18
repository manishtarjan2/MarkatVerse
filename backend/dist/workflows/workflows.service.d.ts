import { PrismaService } from '../prisma.service.js';
import { Prisma } from '@prisma/client';
export declare class WorkflowsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.WorkflowCreateInput): Promise<{
        id: string;
        name: string;
        description: string | null;
        version: number;
        steps: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        description: string | null;
        version: number;
        steps: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        version: number;
        steps: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: Prisma.WorkflowUpdateInput): Promise<{
        id: string;
        name: string;
        description: string | null;
        version: number;
        steps: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        version: number;
        steps: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
}

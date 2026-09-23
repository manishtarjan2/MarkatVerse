import { WorkflowsService } from './workflows.service.js';
export declare class WorkflowsController {
    private readonly workflowsService;
    constructor(workflowsService: WorkflowsService);
    create(createWorkflowDto: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        version: number;
        steps: import("@prisma/client/runtime/library").JsonValue;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        version: number;
        steps: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        version: number;
        steps: import("@prisma/client/runtime/library").JsonValue;
    }>;
    update(id: string, updateWorkflowDto: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        version: number;
        steps: import("@prisma/client/runtime/library").JsonValue;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        version: number;
        steps: import("@prisma/client/runtime/library").JsonValue;
    }>;
}

import { ComplaintsService } from './complaints.service.js';
export declare class ComplaintsController {
    private readonly complaintsService;
    constructor(complaintsService: ComplaintsService);
    create(createComplaintDto: any): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
    }>;
    findAll(): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
    } | null>;
    update(id: string, updateComplaintDto: any): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
    }>;
}

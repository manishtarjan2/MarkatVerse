import { PrismaService } from '../prisma.service.js';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSmsTemplates(): Promise<{
        id: string;
        title: string;
        message: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createSmsTemplate(data: {
        title: string;
        message: string;
        status?: string;
    }): Promise<{
        id: string;
        title: string;
        message: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateSmsTemplate(id: string, data: any): Promise<{
        id: string;
        title: string;
        message: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteSmsTemplate(id: string): Promise<{
        id: string;
        title: string;
        message: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getPushTemplates(): Promise<{
        id: string;
        title: string;
        message: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createPushTemplate(data: {
        title: string;
        message: string;
        status?: string;
    }): Promise<{
        id: string;
        title: string;
        message: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePushTemplate(id: string, data: any): Promise<{
        id: string;
        title: string;
        message: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deletePushTemplate(id: string): Promise<{
        id: string;
        title: string;
        message: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    sendNotification(payload: {
        type: string;
        recipientId: string;
        data: any;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}

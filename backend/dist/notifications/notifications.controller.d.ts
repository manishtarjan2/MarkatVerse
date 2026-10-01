import { NotificationsService } from './notifications.service.js';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
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
    getEmailTemplates(): Promise<{
        id: string;
        title: string;
        message: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createEmailTemplate(data: {
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
    updateEmailTemplate(id: string, data: any): Promise<{
        id: string;
        title: string;
        message: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteEmailTemplate(id: string): Promise<{
        id: string;
        title: string;
        message: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}

import { PrismaService } from '../prisma.service.js';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSmsTemplates(): Promise<any>;
    createSmsTemplate(data: {
        title: string;
        message: string;
        status?: string;
    }): Promise<any>;
    updateSmsTemplate(id: string, data: any): Promise<any>;
    deleteSmsTemplate(id: string): Promise<any>;
    getPushTemplates(): Promise<any>;
    createPushTemplate(data: {
        title: string;
        message: string;
        status?: string;
    }): Promise<any>;
    updatePushTemplate(id: string, data: any): Promise<any>;
    deletePushTemplate(id: string): Promise<any>;
}

import { SystemConfigService } from './system-config.service.js';
export declare class SystemConfigController {
    private readonly systemConfigService;
    constructor(systemConfigService: SystemConfigService);
    getSeo(): Promise<{
        title: string;
        description: string;
    }>;
    updateSeo(body: {
        title: string;
        description: string;
    }): Promise<{
        title: string;
        description: string;
    }>;
    getAuth(): Promise<{
        enableEmail: boolean;
        enablePhone: boolean;
        enableGoogle: boolean;
        require2FA: boolean;
    }>;
    updateAuth(body: any): Promise<{
        enableEmail: boolean;
        enablePhone: boolean;
        enableGoogle: boolean;
        require2FA: boolean;
    }>;
    getQueueConfig(): Promise<{
        travelSpeedKmh: number;
        notificationBufferMin: number;
    }>;
    updateQueueConfig(body: {
        travelSpeedKmh: number;
        notificationBufferMin: number;
    }): Promise<{
        travelSpeedKmh: number;
        notificationBufferMin: number;
    }>;
    getPayment(): Promise<any>;
    addPaymentMethod(body: any): Promise<any[]>;
    updatePaymentMethod(id: string, body: any): Promise<any[]>;
    deletePaymentMethod(id: string): Promise<any[]>;
}

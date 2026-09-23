import { PrismaService } from '../prisma.service.js';
export declare class SystemConfigService {
    private prisma;
    constructor(prisma: PrismaService);
    getSeoConfig(): Promise<{
        title: string;
        description: string;
    }>;
    updateSeoConfig(data: {
        title: string;
        description: string;
    }): Promise<{
        title: string;
        description: string;
    }>;
    getAuthConfig(): Promise<{
        enableEmail: boolean;
        enablePhone: boolean;
        enableGoogle: boolean;
        require2FA: boolean;
    }>;
    updateAuthConfig(data: {
        enableEmail: boolean;
        enablePhone: boolean;
        enableGoogle: boolean;
        require2FA: boolean;
    }): Promise<{
        enableEmail: boolean;
        enablePhone: boolean;
        enableGoogle: boolean;
        require2FA: boolean;
    }>;
}

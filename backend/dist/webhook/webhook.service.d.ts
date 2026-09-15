import { PrismaService } from '../prisma.service.js';
import { WalletService } from '../wallet/wallet.service.js';
export declare class WebhookService {
    private prisma;
    private walletService;
    constructor(prisma: PrismaService, walletService: WalletService);
    handlePaymentSuccess(data: any): Promise<{
        status: string;
        message: string;
    } | {
        status: string;
        message?: undefined;
    }>;
}

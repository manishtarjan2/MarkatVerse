import { PrismaService } from '../prisma.service.js';
import { WalletService } from '../wallet/wallet.service.js';
import { EventsService } from '../events/events.service.js';
export declare class WebhookService {
    private prisma;
    private walletService;
    private eventsService;
    constructor(prisma: PrismaService, walletService: WalletService, eventsService: EventsService);
    handlePaymentSuccess(data: any): Promise<{
        status: string;
        message: string;
    } | {
        status: string;
        message?: undefined;
    }>;
}

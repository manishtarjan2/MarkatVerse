import { PrismaService } from '../../prisma.service.js';
import { EventsService } from '../events.service.js';
export declare class OrderListener {
    private readonly prisma;
    private readonly eventsService;
    private readonly logger;
    constructor(prisma: PrismaService, eventsService: EventsService);
    handlePaymentConfirmedEvent(payload: {
        referenceId: string;
        referenceType: string;
        businessId: string;
    }): Promise<void>;
}

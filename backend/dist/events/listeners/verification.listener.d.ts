import { PrismaService } from '../../prisma.service.js';
import { EventsService } from '../events.service.js';
export declare class VerificationListener {
    private readonly prisma;
    private readonly eventsService;
    private readonly logger;
    constructor(prisma: PrismaService, eventsService: EventsService);
    handleBusinessRegistration(payload: {
        businessId: string;
    }): Promise<void>;
}

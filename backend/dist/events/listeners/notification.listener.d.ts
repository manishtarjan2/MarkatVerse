import { NotificationsService } from '../../notifications/notifications.service.js';
export declare class NotificationListener {
    private readonly notificationsService;
    private readonly logger;
    constructor(notificationsService: NotificationsService);
    handleOrderProcessing(payload: {
        orderId: string;
        customerId: string;
    }): Promise<void>;
    handleTokenIssued(payload: {
        bookingId: string;
        tokenId: string;
        customerId: string;
    }): Promise<void>;
    handleBusinessRegistered(payload: {
        businessId: string;
        ownerName: string;
        email: string;
    }): Promise<void>;
}

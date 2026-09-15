import { WebhookService } from './webhook.service.js';
export declare class WebhookController {
    private readonly webhookService;
    constructor(webhookService: WebhookService);
    handlePaymentSuccess(data: any): Promise<{
        status: string;
        message: string;
    } | {
        status: string;
        message?: undefined;
    }>;
}

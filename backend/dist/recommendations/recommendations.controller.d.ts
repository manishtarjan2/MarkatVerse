import { RecommendationsService } from './recommendations.service.js';
export declare class RecommendationsController {
    private readonly recommendationsService;
    constructor(recommendationsService: RecommendationsService);
    getRecommendations(userId?: string): Promise<any[]>;
    logInteraction(body: {
        userId?: string;
        productId?: string;
        serviceId?: string;
        type: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        type: string;
        productId: string | null;
        serviceId: string | null;
        weight: number;
    }>;
}

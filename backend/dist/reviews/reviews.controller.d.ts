import { ReviewsService } from './reviews.service.js';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(body: {
        entityId: string;
        entityType: string;
        rating: number;
        comment?: string;
        userId: string;
        userName: string;
    }): Promise<{
        id: string;
        entityType: string;
        entityId: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        comment: string | null;
        userName: string | null;
    }>;
    getReviews(entityType: string, entityId: string): Promise<{
        id: string;
        entityType: string;
        entityId: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        comment: string | null;
        userName: string | null;
    }[]>;
}

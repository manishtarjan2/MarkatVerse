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
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        userId: string;
        comment: string | null;
        entityId: string;
        entityType: string;
        userName: string | null;
    }>;
    getReviews(entityType: string, entityId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        userId: string;
        comment: string | null;
        entityId: string;
        entityType: string;
        userName: string | null;
    }[]>;
}

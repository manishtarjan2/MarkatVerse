import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(req: any, body: {
        entityId: string;
        entityType: string;
        rating: number;
        comment?: string;
    }): Promise<any>;
    getReviews(entityType: string, entityId: string): Promise<any>;
}

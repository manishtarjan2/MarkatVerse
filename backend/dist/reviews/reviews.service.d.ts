import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    createReview(data: {
        entityId: string;
        entityType: string;
        rating: number;
        comment?: string;
        userId: string;
        userName?: string;
    }): Promise<any>;
    getReviews(entityType: string, entityId: string): Promise<any>;
}

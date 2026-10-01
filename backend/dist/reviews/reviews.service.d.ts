import { PrismaService } from '../prisma.service.js';
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

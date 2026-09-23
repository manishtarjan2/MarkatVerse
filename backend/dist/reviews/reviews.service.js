var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createReview(data) {
        if (data.rating < 1 || data.rating > 5) {
            throw new BadRequestException('Rating must be between 1 and 5');
        }
        if (data.entityType !== 'PRODUCT' && data.entityType !== 'SERVICE') {
            throw new BadRequestException('Entity type must be PRODUCT or SERVICE');
        }
        if (data.entityType === 'PRODUCT') {
            const product = await this.prisma.product.findUnique({ where: { id: data.entityId } });
            if (!product)
                throw new BadRequestException('Product not found');
        }
        else {
            const service = await this.prisma.serviceQueue.findUnique({ where: { id: data.entityId } });
            if (!service)
                throw new BadRequestException('Service not found');
        }
        const review = await this.prisma.review.create({
            data: {
                entityId: data.entityId,
                entityType: data.entityType,
                rating: data.rating,
                comment: data.comment,
                userId: data.userId,
                userName: data.userName,
            },
        });
        const allReviews = await this.prisma.review.findMany({
            where: { entityId: data.entityId, entityType: data.entityType },
            select: { rating: true },
        });
        const totalReviews = allReviews.length;
        const averageRating = totalReviews === 0
            ? 0
            : allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
        const formattedRating = averageRating.toFixed(1);
        const formattedReviews = totalReviews.toString();
        if (data.entityType === 'PRODUCT') {
            await this.prisma.product.update({
                where: { id: data.entityId },
                data: {
                    rating: formattedRating,
                    reviews: formattedReviews,
                },
            });
        }
        else {
            await this.prisma.serviceQueue.update({
                where: { id: data.entityId },
                data: {
                    rating: formattedRating,
                    reviews: formattedReviews,
                },
            });
        }
        return review;
    }
    async getReviews(entityType, entityId) {
        if (entityType !== 'PRODUCT' && entityType !== 'SERVICE') {
            throw new BadRequestException('Entity type must be PRODUCT or SERVICE');
        }
        return this.prisma.review.findMany({
            where: { entityId, entityType },
            orderBy: { createdAt: 'desc' },
        });
    }
};
ReviewsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ReviewsService);
export { ReviewsService };
//# sourceMappingURL=reviews.service.js.map
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(data: {
    entityId: string;
    entityType: string;
    rating: number;
    comment?: string;
    userId: string;
    userName?: string;
  }) {
    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }
    
    if (data.entityType !== 'PRODUCT' && data.entityType !== 'SERVICE') {
      throw new BadRequestException('Entity type must be PRODUCT or SERVICE');
    }

    // Check if the entity exists
    if (data.entityType === 'PRODUCT') {
      const product = await this.prisma.product.findUnique({ where: { id: data.entityId } });
      if (!product) throw new BadRequestException('Product not found');
    } else {
      const service = await this.prisma.serviceQueue.findUnique({ where: { id: data.entityId } });
      if (!service) throw new BadRequestException('Service not found');
    }

    // Save the review
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

    // Recalculate average rating
    const allReviews = await this.prisma.review.findMany({
      where: { entityId: data.entityId, entityType: data.entityType },
      select: { rating: true },
    });

    const totalReviews = allReviews.length;
    const averageRating = totalReviews === 0 
      ? 0 
      : allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews;

    const formattedRating = averageRating.toFixed(1);
    const formattedReviews = totalReviews.toString();

    // Update the target entity
    if (data.entityType === 'PRODUCT') {
      await this.prisma.product.update({
        where: { id: data.entityId },
        data: {
          rating: formattedRating,
          reviews: formattedReviews,
        },
      });
    } else {
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

  async getReviews(entityType: string, entityId: string) {
    if (entityType !== 'PRODUCT' && entityType !== 'SERVICE') {
      throw new BadRequestException('Entity type must be PRODUCT or SERVICE');
    }
    return this.prisma.review.findMany({
      where: { entityId, entityType },
      orderBy: { createdAt: 'desc' },
    });
  }
}

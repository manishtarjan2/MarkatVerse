import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async createReview(
    @Body() body: { entityId: string; entityType: string; rating: number; comment?: string; userId: string; userName: string }
  ) {
    return this.reviewsService.createReview({
      ...body,
    });
  }

  @Get(':entityType/:entityId')
  async getReviews(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string
  ) {
    return this.reviewsService.getReviews(entityType, entityId);
  }
}

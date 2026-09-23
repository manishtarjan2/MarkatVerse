import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReview(
    @Request() req,
    @Body() body: { entityId: string; entityType: string; rating: number; comment?: string }
  ) {
    return this.reviewsService.createReview({
      ...body,
      userId: req.user.userId,
      userName: req.user.name,
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

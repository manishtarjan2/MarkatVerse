import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service.js';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get()
  getRecommendations(@Query('userId') userId?: string) {
    return this.recommendationsService.getRecommendations(userId);
  }

  @Post('interactions')
  logInteraction(@Body() body: { userId?: string; productId?: string; serviceId?: string; type: string }) {
    return this.recommendationsService.logInteraction(body);
  }
}

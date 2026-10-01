import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service.js';

@Controller('admin/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.analyticsService.getDashboardMetrics();
  }
}

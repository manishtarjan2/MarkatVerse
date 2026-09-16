import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller.js';
import { AnalyticsService } from './analytics.service.js';
import { AdminBusinessController } from './admin-business.controller.js';
import { AdminBusinessService } from './admin-business.service.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [AnalyticsController, AdminBusinessController],
  providers: [AnalyticsService, AdminBusinessService, PrismaService],
})
export class AdminModule {}

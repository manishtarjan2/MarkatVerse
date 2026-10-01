import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller.js';
import { AnalyticsService } from './analytics.service.js';
import { AdminBusinessController } from './admin-business.controller.js';
import { AdminBusinessService } from './admin-business.service.js';
import { PrismaService } from '../prisma.service.js';
import { ExceptionsService } from './exceptions.service.js';
import { ExceptionsController } from './exceptions.controller.js';

@Module({
  controllers: [AnalyticsController, AdminBusinessController, ExceptionsController],
  providers: [AnalyticsService, AdminBusinessService, PrismaService, ExceptionsService],
})
export class AdminModule {}

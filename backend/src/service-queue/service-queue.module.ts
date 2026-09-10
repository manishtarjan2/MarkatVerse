import { Module } from '@nestjs/common';
import { ServiceQueueService } from './service-queue.service.js';
import { ServiceQueueController } from './service-queue.controller.js';

@Module({
  controllers: [ServiceQueueController],
  providers: [ServiceQueueService],
})
export class ServiceQueueModule {}

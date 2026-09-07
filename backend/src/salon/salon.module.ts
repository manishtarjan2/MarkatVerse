import { Module } from '@nestjs/common';
import { SalonService } from './salon.service.js';
import { SalonController } from './salon.controller.js';

@Module({
  controllers: [SalonController],
  providers: [SalonService],
})
export class SalonModule {}

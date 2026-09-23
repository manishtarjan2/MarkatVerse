import { Module } from '@nestjs/common';
import { CommercialController } from './commercial.controller.js';
import { CommercialService } from './commercial.service.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [CommercialController],
  providers: [CommercialService, PrismaService],
})
export class CommercialModule {}

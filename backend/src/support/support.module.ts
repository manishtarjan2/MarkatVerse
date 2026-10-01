import { Module } from '@nestjs/common';
import { ComplaintsController } from './complaints.controller.js';
import { ComplaintsService } from './complaints.service.js';
import { DisputesController } from './disputes.controller.js';
import { DisputesService } from './disputes.service.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [ComplaintsController, DisputesController],
  providers: [ComplaintsService, DisputesService, PrismaService],
})
export class SupportModule {}

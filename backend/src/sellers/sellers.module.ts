import { Module } from '@nestjs/common';
import { SellersService } from './sellers.service.js';
import { SellersController } from './sellers.controller.js';
import { PrismaModule } from '../prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SellersController],
  providers: [SellersService],
})
export class SellersModule {}

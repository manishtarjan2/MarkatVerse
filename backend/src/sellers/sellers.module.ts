import { Module } from '@nestjs/common';
import { SellersService } from './sellers.service.js';
import { SellersController } from './sellers.controller.js';
import { PrismaModule } from '../prisma.module.js';
import { IdGeneratorModule } from '../id-generator/id-generator.module.js';

@Module({
  imports: [PrismaModule, IdGeneratorModule],
  controllers: [SellersController],
  providers: [SellersService],
})
export class SellersModule {}

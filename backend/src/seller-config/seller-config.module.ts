import { Module } from '@nestjs/common';
import { SellerConfigController } from './seller-config.controller.js';
import { SellerConfigService } from './seller-config.service.js';
import { PrismaModule } from '../prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SellerConfigController],
  providers: [SellerConfigService]
})
export class SellerConfigModule {}


import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller.js';
import { WebhookService } from './webhook.service.js';
import { PrismaModule } from '../prisma.module.js';
import { WalletModule } from '../wallet/wallet.module.js';

@Module({
  imports: [PrismaModule, WalletModule],
  controllers: [WebhookController],
  providers: [WebhookService]
})
export class WebhookModule {}


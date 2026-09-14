import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service.js';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('payment/success')
  async handlePaymentSuccess(@Body() data: any) {
    return this.webhookService.handlePaymentSuccess(data);
  }
}


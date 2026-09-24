import { Controller, Get, Patch, Body, Post, Delete, Param } from '@nestjs/common';
import { SystemConfigService } from './system-config.service.js';

@Controller('system-config')
export class SystemConfigController {
  constructor(private readonly systemConfigService: SystemConfigService) {}

  @Get('seo')
  getSeo() {
    return this.systemConfigService.getSeoConfig();
  }

  @Patch('seo')
  updateSeo(@Body() body: { title: string; description: string }) {
    return this.systemConfigService.updateSeoConfig(body);
  }

  @Get('auth')
  getAuth() {
    return this.systemConfigService.getAuthConfig();
  }

  @Patch('auth')
  updateAuth(@Body() body: any) {
    return this.systemConfigService.updateAuthConfig(body);
  }

  // --- Payment Endpoints ---

  @Get('payment')
  getPayment() {
    return this.systemConfigService.getPaymentMethods();
  }

  @Post('payment')
  addPaymentMethod(@Body() body: any) {
    return this.systemConfigService.addPaymentMethod(body);
  }

  @Patch('payment/:id')
  updatePaymentMethod(@Param('id') id: string, @Body() body: any) {
    return this.systemConfigService.updatePaymentMethod(id, body);
  }

  @Delete('payment/:id')
  deletePaymentMethod(@Param('id') id: string) {
    return this.systemConfigService.deletePaymentMethod(id);
  }
}

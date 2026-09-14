import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { SellerConfigService } from './seller-config.service.js';

@Controller('seller-config')
export class SellerConfigController {
  constructor(private readonly sellerConfigService: SellerConfigService) {}

  @Get(':userId')
  async getCapabilities(@Param('userId') userId: string) {
    return this.sellerConfigService.getSellerCapabilities(userId);
  }

  @Patch('business/:businessId/capabilities')
  async updateCapabilities(
    @Param('businessId') businessId: string,
    @Body('features') features: string[]
  ) {
    return this.sellerConfigService.updateSellerCapabilities(businessId, features);
  }
}


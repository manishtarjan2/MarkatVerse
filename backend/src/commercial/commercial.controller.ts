import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CommercialService } from './commercial.service.js';

@Controller('commercial')
export class CommercialController {
  constructor(private readonly commercialService: CommercialService) {}

  // Advertisements
  @Get('advertisements')
  getAdvertisements() { return this.commercialService.getAdvertisements(); }

  @Get('advertisements/:id')
  getAdvertisement(@Param('id') id: string) { return this.commercialService.getAdvertisement(id); }

  @Post('advertisements')
  createAdvertisement(@Body() data: any) { return this.commercialService.createAdvertisement(data); }

  @Patch('advertisements/:id')
  updateAdvertisement(@Param('id') id: string, @Body() data: any) { return this.commercialService.updateAdvertisement(id, data); }

  @Delete('advertisements/:id')
  deleteAdvertisement(@Param('id') id: string) { return this.commercialService.deleteAdvertisement(id); }

  // Coupons
  @Get('coupons')
  getCoupons() { return this.commercialService.getCoupons(); }

  @Get('coupons/:id')
  getCoupon(@Param('id') id: string) { return this.commercialService.getCoupon(id); }

  @Post('coupons')
  createCoupon(@Body() data: any) { return this.commercialService.createCoupon(data); }

  @Patch('coupons/:id')
  updateCoupon(@Param('id') id: string, @Body() data: any) { return this.commercialService.updateCoupon(id, data); }

  @Delete('coupons/:id')
  deleteCoupon(@Param('id') id: string) { return this.commercialService.deleteCoupon(id); }

  // Subscriptions
  @Get('subscriptions')
  getSubscriptions() { return this.commercialService.getSubscriptions(); }

  @Get('subscriptions/:id')
  getSubscription(@Param('id') id: string) { return this.commercialService.getSubscription(id); }

  @Post('subscriptions')
  createSubscription(@Body() data: any) { return this.commercialService.createSubscription(data); }

  @Patch('subscriptions/:id')
  updateSubscription(@Param('id') id: string, @Body() data: any) { return this.commercialService.updateSubscription(id, data); }

  @Delete('subscriptions/:id')
  deleteSubscription(@Param('id') id: string) { return this.commercialService.deleteSubscription(id); }

  // Commission
  @Get('commissions')
  getCommissions() { return this.commercialService.getCommissions(); }

  @Get('commissions/:id')
  getCommission(@Param('id') id: string) { return this.commercialService.getCommission(id); }

  @Post('commissions')
  createCommission(@Body() data: any) { return this.commercialService.createCommission(data); }

  @Patch('commissions/:id')
  updateCommission(@Param('id') id: string, @Body() data: any) { return this.commercialService.updateCommission(id, data); }

  @Delete('commissions/:id')
  deleteCommission(@Param('id') id: string) { return this.commercialService.deleteCommission(id); }
}

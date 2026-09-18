import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { AdminBusinessService } from './admin-business.service.js';

@Controller('admin/businesses')
export class AdminBusinessController {
  constructor(private readonly adminBusinessService: AdminBusinessService) {}

  @Get()
  getAllBusinesses() {
    return this.adminBusinessService.getAllBusinesses();
  }

  @Patch(':id/subscription')
  updateSubscription(
    @Param('id') id: string,
    @Body() body: { subscriptionStatus: string, subscriptionStartDate: string | null, subscriptionEndDate: string | null }
  ) {
    const data = {
      subscriptionStatus: body.subscriptionStatus,
      subscriptionStartDate: body.subscriptionStartDate ? new Date(body.subscriptionStartDate) : null,
      subscriptionEndDate: body.subscriptionEndDate ? new Date(body.subscriptionEndDate) : null,
    };
    return this.adminBusinessService.updateSubscription(id, data);
  }

  @Patch(':id/billing')
  updateBilling(
    @Param('id') id: string,
    @Body() body: { commissionType: string, commissionRate: number, subscriptionStatus: string, subscriptionStartDate: string | null, subscriptionEndDate: string | null }
  ) {
    const data = {
      commissionType: body.commissionType,
      commissionRate: Number(body.commissionRate),
      subscriptionStatus: body.subscriptionStatus,
      subscriptionStartDate: body.subscriptionStartDate ? new Date(body.subscriptionStartDate) : null,
      subscriptionEndDate: body.subscriptionEndDate ? new Date(body.subscriptionEndDate) : null,
    };
    return this.adminBusinessService.updateBilling(id, data);
  }
}

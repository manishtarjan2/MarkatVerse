import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ConfigurationService } from './configuration.service.js';
import { MainType } from '@prisma/client';

@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configService: ConfigurationService) {}

  @Get('business-types')
  getBusinessTypes(@Query('mainType') mainType?: MainType) {
    return this.configService.getBusinessTypes(mainType);
  }

  @Post('business-types')
  createBusinessType(@Body() data: { mainType: MainType; name: string; description?: string }) {
    return this.configService.createBusinessType(data);
  }

  @Get('sectors')
  getSectors(@Query('businessTypeId') businessTypeId?: string) {
    return this.configService.getSectors(businessTypeId);
  }

  @Post('sectors')
  createSector(@Body() data: { businessTypeId: string; name: string; description?: string }) {
    return this.configService.createSector(data);
  }

  @Get('categories')
  getCategories(@Query('sectorId') sectorId?: string) {
    return this.configService.getCategories(sectorId);
  }

  @Post('categories')
  createCategory(@Body() data: { sectorId: string; name: string; parentId?: string }) {
    return this.configService.createCategory(data);
  }

  @Get('workflows')
  getWorkflows() {
    return this.configService.getWorkflows();
  }

  @Post('workflows')
  createWorkflow(@Body() data: { name: string; description?: string; steps: any }) {
    return this.configService.createWorkflow(data);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() data: any) {
    return this.productsService.create(data);
  }

  @Get()
  findAll(
    @Query('location') location?: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('radius') radius?: string,
  ) {
    return this.productsService.findAll(location, lat ? parseFloat(lat) : undefined, lng ? parseFloat(lng) : undefined, radius ? parseFloat(radius) : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post('toggle-dummy')
  toggleDummy(@Body('enable') enable: boolean) {
    return this.productsService.toggleDummyData(enable);
  }

  @Patch(':id/admin-status')
  updateAdminStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.productsService.updateAdminStatus(id, status);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.productsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}

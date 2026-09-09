import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ListingsService } from './listings.service.js';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  getAllListings(
    @Query('sectorId') sectorId?: string,
    @Query('businessTypeId') businessTypeId?: string,
    @Query('status') status?: string,
  ) {
    return this.listingsService.getAllListings({ sectorId, businessTypeId, status });
  }

  @Get(':id')
  getListingById(@Param('id') id: string) {
    return this.listingsService.getListingById(id);
  }

  @Post()
  createListing(@Body() data: any) {
    return this.listingsService.createListing(data);
  }

  @Put(':id')
  updateListing(@Param('id') id: string, @Body() data: any) {
    return this.listingsService.updateListing(id, data);
  }

  @Delete(':id')
  deleteListing(@Param('id') id: string) {
    return this.listingsService.deleteListing(id);
  }
}

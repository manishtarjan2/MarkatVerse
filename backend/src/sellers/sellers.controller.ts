import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SellersService } from './sellers.service.js';

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post()
  create(@Body() createSellerDto: any) {
    return this.sellersService.create(createSellerDto);
  }

  @Get()
  findAll() {
    return this.sellersService.findAll();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.sellersService.updateStatus(id, status);
  }

  @Patch('user/:userId')
  updateUser(@Param('userId') userId: string, @Body() data: any) {
    return this.sellersService.updateUser(userId, data);
  }

  @Delete('user/:userId')
  removeUser(@Param('userId') userId: string) {
    return this.sellersService.removeUser(userId);
  }
}

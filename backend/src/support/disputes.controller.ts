import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { DisputesService } from './disputes.service.js';

@Controller('support/disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Get()
  findAll() {
    return this.disputesService.findAll();
  }

  @Post()
  create(@Body() body: { title: string; description?: string }) {
    return this.disputesService.create(body);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.disputesService.updateStatus(id, body.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.disputesService.remove(id);
  }
}

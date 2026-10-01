import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ExceptionsService } from './exceptions.service.js';

@Controller('admin/exceptions')
export class ExceptionsController {
  constructor(private readonly exceptionsService: ExceptionsService) {}

  @Get()
  async getExceptions(@Query('status') status: string) {
    return this.exceptionsService.getExceptions(status);
  }

  @Post(':id/resolve')
  async resolveException(@Param('id') id: string, @Body() body: { notes?: string }) {
    return this.exceptionsService.resolveException(id, body.notes);
  }

  @Get('audit')
  async getAuditLogs(
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string
  ) {
    return this.exceptionsService.getAuditLogs(entityType, entityId);
  }
}

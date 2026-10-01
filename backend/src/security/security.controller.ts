import { Controller, Get, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import { SecurityService } from './security.service.js';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('audit')
  getAuditLogs() {
    return this.securityService.getAuditLogs();
  }

  @Post('audit')
  createAuditLog(@Body() body: any) {
    return this.securityService.createAuditLog(body);
  }

  // --- Alerts ---
  @Get('alerts')
  getAlerts() {
    return this.securityService.getAlerts();
  }

  @Post('alerts')
  createAlert(@Body() body: any) {
    return this.securityService.createAlert(body);
  }

  @Patch('alerts/:id')
  updateAlert(@Param('id') id: string, @Body() body: any) {
    return this.securityService.updateAlert(id, body);
  }

  @Delete('alerts/:id')
  deleteAlert(@Param('id') id: string) {
    return this.securityService.deleteAlert(id);
  }
}


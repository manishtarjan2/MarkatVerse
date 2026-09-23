import { Controller, Get, Post, Body } from '@nestjs/common';
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
}

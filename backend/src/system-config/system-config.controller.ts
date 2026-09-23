import { Controller, Get, Patch, Body } from '@nestjs/common';
import { SystemConfigService } from './system-config.service.js';

@Controller('system-config')
export class SystemConfigController {
  constructor(private readonly systemConfigService: SystemConfigService) {}

  @Get('seo')
  getSeo() {
    return this.systemConfigService.getSeoConfig();
  }

  @Patch('seo')
  updateSeo(@Body() body: { title: string; description: string }) {
    return this.systemConfigService.updateSeoConfig(body);
  }

  @Get('auth')
  getAuth() {
    return this.systemConfigService.getAuthConfig();
  }

  @Patch('auth')
  updateAuth(@Body() body: any) {
    return this.systemConfigService.updateAuthConfig(body);
  }
}

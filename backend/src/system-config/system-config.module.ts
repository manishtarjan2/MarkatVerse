import { Module } from '@nestjs/common';
import { SystemConfigController } from './system-config.controller.js';
import { SystemConfigService } from './system-config.service.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [SystemConfigController],
  providers: [SystemConfigService, PrismaService],
})
export class SystemConfigModule {}

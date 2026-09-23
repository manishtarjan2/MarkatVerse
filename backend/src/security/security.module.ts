import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller.js';
import { SecurityService } from './security.service.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [SecurityController],
  providers: [SecurityService, PrismaService],
  exports: [SecurityService],
})
export class SecurityModule {}

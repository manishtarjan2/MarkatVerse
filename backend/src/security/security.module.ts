import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller.js';
import { SecurityService } from './security.service.js';
import { PrismaService } from '../prisma.service.js';
import { IdGeneratorService } from '../id-generator/id-generator.service.js';

@Module({
  controllers: [SecurityController],
  providers: [SecurityService, PrismaService, IdGeneratorService],
  exports: [SecurityService],
})
export class SecurityModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';

import { PrismaModule } from '../prisma.module.js';
import { EventsModule } from '../events/events.module.js';

@Module({
  imports: [PrismaModule, EventsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

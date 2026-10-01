import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsService } from './events.service.js';
import { VerificationListener } from './listeners/verification.listener.js';
import { OrderListener } from './listeners/order.listener.js';
import { NotificationListener } from './listeners/notification.listener.js';
import { PrismaModule } from '../prisma.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 20,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
    PrismaModule,
    NotificationsModule,
  ],
  providers: [EventsService, VerificationListener, OrderListener, NotificationListener],
  exports: [EventsService, EventEmitterModule],
})
export class EventsModule {}

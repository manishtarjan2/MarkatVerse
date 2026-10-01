var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsService } from './events.service.js';
import { VerificationListener } from './listeners/verification.listener.js';
import { OrderListener } from './listeners/order.listener.js';
import { NotificationListener } from './listeners/notification.listener.js';
import { PrismaModule } from '../prisma.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
let EventsModule = class EventsModule {
};
EventsModule = __decorate([
    Global(),
    Module({
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
], EventsModule);
export { EventsModule };
//# sourceMappingURL=events.module.js.map
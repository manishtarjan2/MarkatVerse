var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller.js';
import { AnalyticsService } from './analytics.service.js';
import { AdminBusinessController } from './admin-business.controller.js';
import { AdminBusinessService } from './admin-business.service.js';
import { PrismaService } from '../prisma.service.js';
let AdminModule = class AdminModule {
};
AdminModule = __decorate([
    Module({
        controllers: [AnalyticsController, AdminBusinessController],
        providers: [AnalyticsService, AdminBusinessService, PrismaService],
    })
], AdminModule);
export { AdminModule };
//# sourceMappingURL=admin.module.js.map
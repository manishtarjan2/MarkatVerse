var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { CommercialController } from './commercial.controller.js';
import { CommercialService } from './commercial.service.js';
import { PrismaService } from '../prisma.service.js';
let CommercialModule = class CommercialModule {
};
CommercialModule = __decorate([
    Module({
        controllers: [CommercialController],
        providers: [CommercialService, PrismaService],
    })
], CommercialModule);
export { CommercialModule };
//# sourceMappingURL=commercial.module.js.map
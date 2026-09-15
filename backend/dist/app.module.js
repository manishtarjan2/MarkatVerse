var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { ProductsModule } from './products/products.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { SellersModule } from './sellers/sellers.module.js';
import { PrismaModule } from './prisma.module.js';
import { LeadsModule } from './leads/leads.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UploadModule } from './upload/upload.module.js';
import { ServiceQueueModule } from './service-queue/service-queue.module.js';
import { ConfigurationModule } from './configuration/configuration.module.js';
import { ListingsModule } from './listings/listings.module.js';
import { WalletModule } from './wallet/wallet.module.js';
import { WebhookModule } from './webhook/webhook.module.js';
import { SellerConfigModule } from './seller-config/seller-config.module.js';
import { CategoriesModule } from './categories/categories.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [PrismaModule, UsersModule, ProductsModule, OrdersModule, SellersModule, LeadsModule, AuthModule, UploadModule, ServiceQueueModule, ConfigurationModule, ListingsModule, WalletModule, WebhookModule, SellerConfigModule, CategoriesModule],
        controllers: [AppController],
        providers: [AppService],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map
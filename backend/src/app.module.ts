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
import { AdminModule } from './admin/admin.module.js';
import { WorkflowsModule } from './workflows/workflows.module.js';
import { IdGeneratorModule } from './id-generator/id-generator.module.js';

@Module({
  imports: [PrismaModule, UsersModule, ProductsModule, OrdersModule, SellersModule, LeadsModule, AuthModule, UploadModule, ServiceQueueModule, ConfigurationModule, ListingsModule, WalletModule, WebhookModule, SellerConfigModule, CategoriesModule, AdminModule, WorkflowsModule, IdGeneratorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

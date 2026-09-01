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

@Module({
  imports: [PrismaModule, UsersModule, ProductsModule, OrdersModule, SellersModule, LeadsModule, AuthModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

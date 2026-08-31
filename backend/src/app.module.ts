import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { ProductsModule } from './products/products.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { SellersModule } from './sellers/sellers.module.js';

@Module({
  imports: [UsersModule, ProductsModule, OrdersModule, SellersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

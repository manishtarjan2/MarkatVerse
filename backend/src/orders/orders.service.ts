import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';

@Injectable()
export class OrdersService {
  create(createOrderDto: CreateOrderDto) {
    return { message: 'This action adds a new order' };
  }

  findAll() {
    return [];
  }

  findOne(id: number) {
    return { message: `This action returns a #${id} order` };
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return { message: `This action updates a #${id} order` };
  }

  remove(id: number) {
    return { message: `This action removes a #${id} order` };
  }
}

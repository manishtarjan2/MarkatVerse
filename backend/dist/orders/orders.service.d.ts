import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
export declare class OrdersService {
    create(createOrderDto: CreateOrderDto): {
        message: string;
    };
    findAll(): never[];
    findOne(id: number): {
        message: string;
    };
    update(id: number, updateOrderDto: UpdateOrderDto): {
        message: string;
    };
    remove(id: number): {
        message: string;
    };
}

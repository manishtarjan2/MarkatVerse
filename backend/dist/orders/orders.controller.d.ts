import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): {
        message: string;
    };
    findAll(): never[];
    findOne(id: string): {
        message: string;
    };
    update(id: string, updateOrderDto: UpdateOrderDto): {
        message: string;
    };
    remove(id: string): {
        message: string;
    };
}

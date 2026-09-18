import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { PrismaService } from '../prisma.service.js';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createOrderDto: CreateOrderDto): Promise<{
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            productName: string | null;
            sellerId: string | null;
            quantity: number;
            price: number;
            orderId: string;
        }[];
    } & {
        id: string;
        buyerId: string | null;
        total: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        customerId: string | null;
        customerName: string;
        totalAmount: number;
        status: string;
        createdAt: Date;
    }[]>;
    findBySeller(sellerId: string): Promise<{
        id: string;
        buyer: string;
        item: string;
        amount: string;
        date: string;
        status: string;
        customerId: string | null;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__OrderClient<{
        id: string;
        buyerId: string | null;
        total: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<{
        id: string;
        buyerId: string | null;
        total: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__OrderClient<{
        id: string;
        buyerId: string | null;
        total: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}

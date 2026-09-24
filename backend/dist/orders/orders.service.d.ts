import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { PrismaService } from '../prisma.service.js';
import { IdGeneratorService } from '../id-generator/id-generator.service.js';
export declare class OrdersService {
    private prisma;
    private idGenerator;
    constructor(prisma: PrismaService, idGenerator: IdGeneratorService);
    create(createOrderDto: CreateOrderDto): Promise<{
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sellerId: string | null;
            productId: string;
            productName: string | null;
            quantity: number;
            price: number;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        buyerId: string | null;
        orderNumber: string | null;
        total: number;
    }>;
    findAll(): Promise<{
        id: string;
        orderNumber: string | null;
        customerId: string | null;
        customerName: string;
        totalAmount: number;
        status: string;
        createdAt: Date;
    }[]>;
    findBySeller(sellerId: string): Promise<{
        id: string;
        orderNumber: string | null;
        buyer: string;
        item: string;
        amount: string;
        date: string;
        status: string;
        customerId: string | null;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__OrderClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        buyerId: string | null;
        orderNumber: string | null;
        total: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        buyerId: string | null;
        orderNumber: string | null;
        total: number;
    }>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__OrderClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        buyerId: string | null;
        orderNumber: string | null;
        total: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}

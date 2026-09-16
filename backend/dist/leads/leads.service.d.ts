import { PrismaService } from '../prisma.service.js';
export declare class LeadsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): import(".prisma/client").Prisma.Prisma__LeadClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        sellerId: string;
        message: string;
        quantityRequested: number;
        buyerId: string;
        productId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAllForSeller(sellerId: string): import(".prisma/client").Prisma.PrismaPromise<({
        product: {
            id: string;
            name: string;
            image: string | null;
        };
        buyer: {
            id: string;
            name: string;
            email: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        sellerId: string;
        message: string;
        quantityRequested: number;
        buyerId: string;
        productId: string;
    })[]>;
    findAllForBuyer(buyerId: string): import(".prisma/client").Prisma.PrismaPromise<({
        product: {
            id: string;
            name: string;
            price: number;
            image: string | null;
        };
        seller: {
            id: string;
            name: string;
            email: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        sellerId: string;
        message: string;
        quantityRequested: number;
        buyerId: string;
        productId: string;
    })[]>;
    updateStatus(id: string, status: string): import(".prisma/client").Prisma.Prisma__LeadClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        sellerId: string;
        message: string;
        quantityRequested: number;
        buyerId: string;
        productId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}

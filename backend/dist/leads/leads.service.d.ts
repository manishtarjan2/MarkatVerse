import { PrismaService } from '../prisma.service.js';
export declare class LeadsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): import(".prisma/client").Prisma.Prisma__LeadClient<{
        id: string;
        status: string;
        createdAt: Date;
        message: string;
        updatedAt: Date;
        sellerId: string;
        buyerId: string;
        productId: string;
        quantityRequested: number;
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
        status: string;
        createdAt: Date;
        message: string;
        updatedAt: Date;
        sellerId: string;
        buyerId: string;
        productId: string;
        quantityRequested: number;
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
        status: string;
        createdAt: Date;
        message: string;
        updatedAt: Date;
        sellerId: string;
        buyerId: string;
        productId: string;
        quantityRequested: number;
    })[]>;
    updateStatus(id: string, status: string): import(".prisma/client").Prisma.Prisma__LeadClient<{
        id: string;
        status: string;
        createdAt: Date;
        message: string;
        updatedAt: Date;
        sellerId: string;
        buyerId: string;
        productId: string;
        quantityRequested: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}

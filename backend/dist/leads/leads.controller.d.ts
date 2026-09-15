import { LeadsService } from './leads.service.js';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    create(data: any): import(".prisma/client").Prisma.Prisma__LeadClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sellerId: string;
        status: string;
        message: string;
        quantityRequested: number;
        buyerId: string;
        productId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAllForSeller(id: string): import(".prisma/client").Prisma.PrismaPromise<({
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
        sellerId: string;
        status: string;
        message: string;
        quantityRequested: number;
        buyerId: string;
        productId: string;
    })[]>;
    findAllForBuyer(id: string): import(".prisma/client").Prisma.PrismaPromise<({
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
        sellerId: string;
        status: string;
        message: string;
        quantityRequested: number;
        buyerId: string;
        productId: string;
    })[]>;
    updateStatus(id: string, status: string): import(".prisma/client").Prisma.Prisma__LeadClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sellerId: string;
        status: string;
        message: string;
        quantityRequested: number;
        buyerId: string;
        productId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}

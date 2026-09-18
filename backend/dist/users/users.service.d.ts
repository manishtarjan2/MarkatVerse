import { PrismaService } from '../prisma.service.js';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: any): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string | null;
        phone: string | null;
        password: string;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string | null;
        phone: string | null;
        password: string;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string | null;
        phone: string | null;
        password: string;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateUserDto: any): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string | null;
        phone: string | null;
        password: string;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string | null;
        phone: string | null;
        password: string;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}

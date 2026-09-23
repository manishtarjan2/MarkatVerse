import { PrismaService } from '../prisma.service.js';
import { IdGeneratorService } from '../id-generator/id-generator.service.js';
export declare class UsersService {
    private prisma;
    private idGenerator;
    constructor(prisma: PrismaService, idGenerator: IdGeneratorService);
    create(createUserDto: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        role: string;
        markatId: string | null;
        email: string | null;
        password: string;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        role: string;
        markatId: string | null;
        email: string | null;
        password: string;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        role: string;
        markatId: string | null;
        email: string | null;
        password: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateUserDto: any): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        role: string;
        markatId: string | null;
        email: string | null;
        password: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        role: string;
        markatId: string | null;
        email: string | null;
        password: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}

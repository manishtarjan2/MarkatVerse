import { PrismaService } from '../prisma.service.js';
import { IdGeneratorService } from '../id-generator/id-generator.service.js';
export declare class UsersService {
    private prisma;
    private idGenerator;
    constructor(prisma: PrismaService, idGenerator: IdGeneratorService);
    create(createUserDto: any): Promise<{
        id: string;
        name: string;
        markatId: string | null;
        email: string | null;
        phone: string | null;
        password: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        resetCode: string | null;
        resetCodeExpires: Date | null;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        markatId: string | null;
        email: string | null;
        phone: string | null;
        password: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        resetCode: string | null;
        resetCodeExpires: Date | null;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        name: string;
        markatId: string | null;
        email: string | null;
        phone: string | null;
        password: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        resetCode: string | null;
        resetCodeExpires: Date | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateUserDto: any): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        name: string;
        markatId: string | null;
        email: string | null;
        phone: string | null;
        password: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        resetCode: string | null;
        resetCodeExpires: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        name: string;
        markatId: string | null;
        email: string | null;
        phone: string | null;
        password: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        resetCode: string | null;
        resetCodeExpires: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}

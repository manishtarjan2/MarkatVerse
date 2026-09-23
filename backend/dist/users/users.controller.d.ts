import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
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
    update(id: string, updateUserDto: UpdateUserDto): import(".prisma/client").Prisma.Prisma__UserClient<{
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

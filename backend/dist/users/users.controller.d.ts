import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
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
    update(id: string, updateUserDto: UpdateUserDto): import(".prisma/client").Prisma.Prisma__UserClient<{
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

import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): {
        message: string;
    };
    findAll(): never[];
    findOne(id: string): {
        message: string;
    };
    update(id: string, updateUserDto: UpdateUserDto): {
        message: string;
    };
    remove(id: string): {
        message: string;
    };
}

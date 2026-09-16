import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
export declare class UsersService {
    create(createUserDto: CreateUserDto): {
        message: string;
    };
    findAll(): never[];
    findOne(id: number): {
        message: string;
    };
    update(id: number, updateUserDto: UpdateUserDto): {
        message: string;
    };
    remove(id: number): {
        message: string;
    };
}

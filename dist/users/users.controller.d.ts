import { UsersService } from './users.service';
import type { User } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): User[];
    findOne(id: number): User | undefined;
    create(createUserDto: Omit<User, 'id'>): User;
}

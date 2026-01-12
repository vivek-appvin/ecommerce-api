export interface User {
    id: number;
    email: string;
    name: string;
    role: 'customer' | 'admin';
}
export declare class UsersService {
    private users;
    findAll(): User[];
    findOne(id: number): User | undefined;
    findByEmail(email: string): User | undefined;
    create(user: Omit<User, 'id'>): User;
}

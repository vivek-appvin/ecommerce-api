import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/user.entity';
import { RoleEntity } from '../roles/role.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userRepository;
    private roleRepository;
    private jwtService;
    constructor(userRepository: Repository<UserEntity>, roleRepository: Repository<RoleEntity>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    validateUser(userId: string): Promise<UserEntity>;
}

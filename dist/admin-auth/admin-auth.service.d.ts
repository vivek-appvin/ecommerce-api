import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/user.entity';
import { RoleEntity } from '../roles/role.entity';
import { RefreshTokenService } from '../refresh-tokens/refresh-token.service';
import { AdminLoginDto } from './dto/login.dto';
export declare class AdminAuthService {
    private userRepository;
    private roleRepository;
    private jwtService;
    private refreshTokenService;
    constructor(userRepository: Repository<UserEntity>, roleRepository: Repository<RoleEntity>, jwtService: JwtService, refreshTokenService: RefreshTokenService);
    login(loginDto: AdminLoginDto, deviceId?: string, ipAddress?: string, userAgent?: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: any;
    }>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
}

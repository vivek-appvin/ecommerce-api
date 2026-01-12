import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/user.entity';
import { RoleEntity } from '../roles/role.entity';
import { RefreshTokenService } from '../refresh-tokens/refresh-token.service';
import { OtpService } from '../otp/otp.service';
import { SellerRegisterDto } from './dto/register.dto';
import { SellerLoginDto } from './dto/login.dto';
export declare class SellerAuthService {
    private userRepository;
    private roleRepository;
    private jwtService;
    private refreshTokenService;
    private otpService;
    constructor(userRepository: Repository<UserEntity>, roleRepository: Repository<RoleEntity>, jwtService: JwtService, refreshTokenService: RefreshTokenService, otpService: OtpService);
    sendRegistrationOtp(email: string, phone: string): Promise<{
        message: string;
    }>;
    register(registerDto: SellerRegisterDto, deviceId?: string, ipAddress?: string, userAgent?: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: any;
        message: string;
    }>;
    login(loginDto: SellerLoginDto, deviceId?: string, ipAddress?: string, userAgent?: string): Promise<{
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

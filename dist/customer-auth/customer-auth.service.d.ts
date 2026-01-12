import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/user.entity';
import { RoleEntity } from '../roles/role.entity';
import { OtpService } from '../otp/otp.service';
import { OtpPurpose } from '../otp/otp.entity';
import { RefreshTokenService } from '../refresh-tokens/refresh-token.service';
import { CustomerRegisterDto } from './dto/register.dto';
import { CustomerLoginDto } from './dto/login.dto';
export declare class CustomerAuthService {
    private userRepository;
    private roleRepository;
    private jwtService;
    private otpService;
    private refreshTokenService;
    constructor(userRepository: Repository<UserEntity>, roleRepository: Repository<RoleEntity>, jwtService: JwtService, otpService: OtpService, refreshTokenService: RefreshTokenService);
    sendRegistrationOtp(phone: string, purpose: OtpPurpose): Promise<{
        message: string;
    }>;
    register(registerDto: CustomerRegisterDto, deviceId?: string, ipAddress?: string, userAgent?: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: any;
    }>;
    login(loginDto: CustomerLoginDto, deviceId?: string, ipAddress?: string, userAgent?: string): Promise<{
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
    sendPasswordResetOtp(email: string | null, phone: string | null, purpose: OtpPurpose): Promise<{
        message: string;
    }>;
    resetPassword(email: string | null, phone: string | null, otpCode: string, newPassword: string): Promise<{
        message: string;
    }>;
}

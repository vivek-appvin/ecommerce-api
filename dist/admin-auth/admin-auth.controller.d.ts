import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/login.dto';
import { RefreshTokenDto } from '../customer-auth/dto/refresh-token.dto';
export declare class AdminAuthController {
    private readonly adminAuthService;
    constructor(adminAuthService: AdminAuthService);
    login(loginDto: AdminLoginDto, req: any): Promise<{
        msg: string;
        data: {
            access_token: string;
            refresh_token: string;
            user: any;
        };
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        msg: string;
        data: {
            access_token: string;
            refresh_token: string;
        };
    }>;
    logout(refreshTokenDto: RefreshTokenDto): Promise<{
        msg: string;
    }>;
    getMe(req: any): Promise<{
        msg: string;
        data: any;
    }>;
}

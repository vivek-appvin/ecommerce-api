import { SellerAuthService } from './seller-auth.service';
import { SellerRegisterDto } from './dto/register.dto';
import { SellerLoginDto } from './dto/login.dto';
import { RefreshTokenDto } from '../customer-auth/dto/refresh-token.dto';
export declare class SellerAuthController {
    private readonly sellerAuthService;
    constructor(sellerAuthService: SellerAuthService);
    sendOtp(body: {
        email: string;
        phone_number: string;
    }): Promise<{
        msg: string;
    }>;
    register(registerDto: SellerRegisterDto, req: any): Promise<{
        msg: string;
        data: {
            access_token: string;
            refresh_token: string;
            user: any;
        };
    }>;
    login(loginDto: SellerLoginDto, req: any): Promise<{
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

import { CustomerAuthService } from './customer-auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { CustomerRegisterDto } from './dto/register.dto';
import { CustomerLoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class CustomerAuthController {
    private readonly customerAuthService;
    constructor(customerAuthService: CustomerAuthService);
    sendOtp(sendOtpDto: SendOtpDto): Promise<{
        msg: string;
    }>;
    register(registerDto: CustomerRegisterDto, req: any): Promise<{
        msg: string;
        data: {
            access_token: string;
            refresh_token: string;
            user: any;
        };
    }>;
    login(loginDto: CustomerLoginDto, req: any): Promise<{
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
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        msg: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        msg: string;
    }>;
    getMe(req: any): Promise<{
        msg: string;
        data: any;
    }>;
}

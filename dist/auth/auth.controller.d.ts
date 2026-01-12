import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        msg: string;
        data: {
            access_token: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        msg: string;
        data: {
            access_token: string;
        };
    }>;
    getMe(req: any): Promise<{
        msg: string;
        data: any;
    }>;
}

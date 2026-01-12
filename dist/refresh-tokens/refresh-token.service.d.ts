import { Repository } from 'typeorm';
import { RefreshTokenEntity } from './refresh-token.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class RefreshTokenService {
    private refreshTokenRepository;
    private jwtService;
    private configService;
    private readonly REFRESH_TOKEN_EXPIRY_DAYS;
    constructor(refreshTokenRepository: Repository<RefreshTokenEntity>, jwtService: JwtService, configService: ConfigService);
    private generateRefreshToken;
    createRefreshToken(userId: string, deviceId?: string, ipAddress?: string, userAgent?: string): Promise<string>;
    verifyRefreshToken(token: string): Promise<RefreshTokenEntity>;
    revokeRefreshToken(token: string): Promise<void>;
    revokeAllUserTokens(userId: string): Promise<void>;
    cleanupExpiredTokens(): Promise<void>;
}

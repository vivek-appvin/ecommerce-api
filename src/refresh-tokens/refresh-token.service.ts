import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { RefreshTokenEntity } from './refresh-token.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class RefreshTokenService {
  private readonly REFRESH_TOKEN_EXPIRY_DAYS = 30;

  constructor(
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Generate refresh token
   */
  private generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Create refresh token for user
   */
  async createRefreshToken(
    userId: string,
    deviceId?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<string> {
    const token = this.generateRefreshToken();
    const expiresAt = new Date(
      Date.now() + this.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    );

    const refreshToken = this.refreshTokenRepository.create({
      user_id: userId,
      token,
      device_id: deviceId || null,
      ip_address: ipAddress || null,
      user_agent: userAgent || null,
      expires_at: expiresAt,
    });

    await this.refreshTokenRepository.save(refreshToken);
    return token;
  }

  /**
   * Verify refresh token
   */
  async verifyRefreshToken(token: string): Promise<RefreshTokenEntity> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: {
        token,
        is_active: true,
      },
      relations: ['user'],
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (new Date() > refreshToken.expires_at) {
      // Mark as inactive
      refreshToken.is_active = false;
      await this.refreshTokenRepository.save(refreshToken);
      throw new UnauthorizedException('Refresh token has expired');
    }

    return refreshToken;
  }

  /**
   * Revoke refresh token
   */
  async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { token },
      { is_active: false },
    );
  }

  /**
   * Revoke all refresh tokens for a user
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { user_id: userId, is_active: true },
      { is_active: false },
    );
  }

  /**
   * Clean up expired refresh tokens
   */
  async cleanupExpiredTokens(): Promise<void> {
    await this.refreshTokenRepository.delete({
      expires_at: LessThan(new Date()),
    });
  }
}

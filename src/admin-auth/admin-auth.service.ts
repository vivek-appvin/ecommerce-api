import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/user.entity';
import { RoleEntity, RoleName } from '../roles/role.entity';
import { RefreshTokenService } from '../refresh-tokens/refresh-token.service';
import { AdminLoginDto } from './dto/login.dto';
import { JwtPayload } from '../auth/strategies/jwt.strategy';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Login admin
   */
  async login(
    loginDto: AdminLoginDto,
    deviceId?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ access_token: string; refresh_token: string; user: any }> {
    // Find admin by email
    const admin = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: ['role'],
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is an admin
    if (admin.role.name !== RoleName.ADMIN) {
      throw new UnauthorizedException('Invalid user type');
    }

    if (!admin.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const payload: JwtPayload = {
      sub: admin.id,
      role: admin.role.name,
      phone_number: admin.phone_number,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = await this.refreshTokenService.createRefreshToken(
      admin.id,
      deviceId,
      ipAddress,
      userAgent,
    );

    return {
      access_token,
      refresh_token,
      user: {
        id: admin.id,
        email: admin.email,
        phone_number: admin.phone_number,
        first_name: admin.first_name,
        last_name: admin.last_name,
        role: admin.role.name,
      },
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    const tokenEntity = await this.refreshTokenService.verifyRefreshToken(refreshToken);
    
    const admin = await this.userRepository.findOne({
      where: { id: tokenEntity.user_id },
      relations: ['role'],
    });

    if (!admin || !admin.is_active) {
      throw new UnauthorizedException('Admin not found or inactive');
    }

    if (admin.role.name !== RoleName.ADMIN) {
      throw new UnauthorizedException('Invalid user type');
    }

    // Revoke old token
    await this.refreshTokenService.revokeRefreshToken(refreshToken);

    // Generate new tokens
    const payload: JwtPayload = {
      sub: admin.id,
      role: admin.role.name,
      phone_number: admin.phone_number,
    };

    const access_token = this.jwtService.sign(payload);
    const new_refresh_token = await this.refreshTokenService.createRefreshToken(
      admin.id,
      tokenEntity.device_id ?? undefined,
      tokenEntity.ip_address ?? undefined,
      tokenEntity.user_agent ?? undefined,
    );

    return {
      access_token,
      refresh_token: new_refresh_token,
    };
  }

  /**
   * Logout (revoke refresh token)
   */
  async logout(refreshToken: string): Promise<{ message: string }> {
    await this.refreshTokenService.revokeRefreshToken(refreshToken);
    return { message: 'Logged out successfully' };
  }
}

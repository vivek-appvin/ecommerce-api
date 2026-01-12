import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/user.entity';
import { RoleEntity, RoleName } from '../roles/role.entity';
import { OtpService } from '../otp/otp.service';
import { OtpType, OtpPurpose } from '../otp/otp.entity';
import { RefreshTokenService } from '../refresh-tokens/refresh-token.service';
import { CustomerRegisterDto } from './dto/register.dto';
import { CustomerLoginDto } from './dto/login.dto';
import { JwtPayload } from '../auth/strategies/jwt.strategy';

@Injectable()
export class CustomerAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    private jwtService: JwtService,
    private otpService: OtpService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Send OTP for registration (phone number only)
   */
  async sendRegistrationOtp(
    phone: string,
    purpose: OtpPurpose,
  ): Promise<{ message: string }> {
    if (!phone) {
      throw new BadRequestException('Phone number is required for registration');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { phone_number: phone },
    });

    if (existingUser) {
      throw new ConflictException('Phone number already registered');
    }

    // Generate OTP only for phone number
    await this.otpService.generateOtp(phone, OtpType.MOBILE, purpose);
    
    return {
      message: 'OTP sent to your phone number',
    };
  }

  /**
   * Register customer with OTP verification (phone number only)
   */
  async register(
    registerDto: CustomerRegisterDto,
    deviceId?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ access_token: string; refresh_token: string; user: any }> {
    // Verify OTP for phone number only
    const isOtpValid = await this.otpService.verifyOtp(
      registerDto.phone_number,
      registerDto.otp_code,
      OtpType.MOBILE,
      OtpPurpose.REGISTRATION,
    );

    if (!isOtpValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { phone_number: registerDto.phone_number },
    });

    if (existingUser) {
      throw new ConflictException('Phone number already registered');
    }

    // Get USER role
    const userRole = await this.roleRepository.findOne({
      where: { name: RoleName.USER },
    });

    if (!userRole) {
      throw new Error('USER role not found. Please seed the database.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user (email will be added later when they add address)
    const user = this.userRepository.create({
      phone_number: registerDto.phone_number,
      email: null, // Email will be added later
      password: hashedPassword,
      role_id: userRole.id,
      first_name: registerDto.first_name || null,
      last_name: registerDto.last_name || null,
      is_active: true,
      is_phone_verified: true, // Phone verified during registration
      is_email_verified: false, // Email not verified yet (will be verified later)
    });

    await this.userRepository.save(user);

    // Generate tokens
    const payload: JwtPayload = {
      sub: user.id,
      role: userRole.name,
      phone_number: user.phone_number,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = await this.refreshTokenService.createRefreshToken(
      user.id,
      deviceId,
      ipAddress,
      userAgent,
    );

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        phone_number: user.phone_number,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        is_phone_verified: user.is_phone_verified,
        is_email_verified: user.is_email_verified,
      },
    };
  }

  /**
   * Login customer
   */
  async login(
    loginDto: CustomerLoginDto,
    deviceId?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ access_token: string; refresh_token: string; user: any }> {
    // Find user by phone or email
    const user = await this.userRepository.findOne({
      where: [
        { phone_number: loginDto.identifier },
        { email: loginDto.identifier },
      ],
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is a customer
    if (user.role.name !== RoleName.USER) {
      throw new UnauthorizedException('Invalid user type');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role.name,
      phone_number: user.phone_number,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = await this.refreshTokenService.createRefreshToken(
      user.id,
      deviceId,
      ipAddress,
      userAgent,
    );

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        phone_number: user.phone_number,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        is_phone_verified: user.is_phone_verified,
        is_email_verified: user.is_email_verified,
      },
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    const tokenEntity = await this.refreshTokenService.verifyRefreshToken(refreshToken);
    
    const user = await this.userRepository.findOne({
      where: { id: tokenEntity.user_id },
      relations: ['role'],
    });

    if (!user || !user.is_active) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Revoke old token
    await this.refreshTokenService.revokeRefreshToken(refreshToken);

    // Generate new tokens
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role.name,
      phone_number: user.phone_number,
    };

    const access_token = this.jwtService.sign(payload);
    const new_refresh_token = await this.refreshTokenService.createRefreshToken(
      user.id,
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

  /**
   * Send OTP for password reset
   */
  async sendPasswordResetOtp(
    email: string | null,
    phone: string | null,
    purpose: OtpPurpose,
  ): Promise<{ message: string }> {
    if (!email && !phone) {
      throw new BadRequestException('Either email or phone number is required');
    }

    // Find user by email or phone
    let user: UserEntity | null = null;
    if (email) {
      user = await this.userRepository.findOne({
        where: { email },
        relations: ['role'],
      });
    }
    if (!user && phone) {
      user = await this.userRepository.findOne({
        where: { phone_number: phone },
        relations: ['role'],
      });
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role.name !== RoleName.USER) {
      throw new BadRequestException('Invalid user type');
    }

    // Use the user's actual email and phone (in case identifier doesn't match)
    const userEmail = user.email;
    const userPhone = user.phone_number;

    // Generate same OTP for both email and phone (if user has both)
    await this.otpService.generateOtpForMultiple(userEmail, userPhone, purpose);
    
    const destinations: string[] = [];
    if (userEmail) destinations.push('email');
    if (userPhone) destinations.push('phone');
    
    return {
      message: `Same OTP sent to your ${destinations.join(' and ')}`,
    };
  }

  /**
   * Reset password with OTP
   */
  async resetPassword(
    email: string | null,
    phone: string | null,
    otpCode: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    if (!email && !phone) {
      throw new BadRequestException('Either email or phone number is required');
    }

    // Find user by email or phone
    let user: UserEntity | null = null;
    if (email) {
      user = await this.userRepository.findOne({
        where: { email },
        relations: ['role'],
      });
    }
    if (!user && phone) {
      user = await this.userRepository.findOne({
        where: { phone_number: phone },
        relations: ['role'],
      });
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role.name !== RoleName.USER) {
      throw new BadRequestException('Invalid user type');
    }

    // Verify OTP from either email or phone (same OTP was sent to both)
    const isOtpValid = await this.otpService.verifyOtpFromEither(
      user.email,
      user.phone_number,
      otpCode,
      OtpPurpose.PASSWORD_RESET,
    );

    if (!isOtpValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Revoke all refresh tokens
    await this.refreshTokenService.revokeAllUserTokens(user.id);

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }
}

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/user.entity';
import { RoleEntity, RoleName } from '../roles/role.entity';
import { RefreshTokenService } from '../refresh-tokens/refresh-token.service';
import { OtpService } from '../otp/otp.service';
import { OtpType, OtpPurpose } from '../otp/otp.entity';
import { SellerRegisterDto } from './dto/register.dto';
import { SellerLoginDto } from './dto/login.dto';
import { JwtPayload } from '../auth/strategies/jwt.strategy';

@Injectable()
export class SellerAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
    private otpService: OtpService,
  ) {}

  /**
   * Send OTP for seller registration (sends same OTP to both email and phone)
   */
  async sendRegistrationOtp(
    email: string,
    phone: string,
  ): Promise<{ message: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { phone_number: phone },
    });

    if (existingUser) {
      throw new ConflictException('Phone number already registered');
    }

    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });

    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    // Generate same OTP for both email and phone
    await this.otpService.generateOtpForMultiple(email, phone, OtpPurpose.REGISTRATION);
    
    return {
      message: 'Same OTP sent to your email and phone number',
    };
  }

  /**
   * Register seller (requires admin approval) - verifies both email and phone with OTP
   */
  async register(
    registerDto: SellerRegisterDto,
    deviceId?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ access_token: string; refresh_token: string; user: any; message: string }> {
    // Verify OTP from either email or phone (same OTP was sent to both)
    const isOtpValid = await this.otpService.verifyOtpFromEither(
      registerDto.email,
      registerDto.phone_number,
      registerDto.otp_code,
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

    const existingEmail = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    // Get SELLER role
    const sellerRole = await this.roleRepository.findOne({
      where: { name: RoleName.SELLER },
    });

    if (!sellerRole) {
      throw new Error('SELLER role not found. Please seed the database.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create seller (pending approval) - both email and phone verified via OTP
    const seller = this.userRepository.create({
      phone_number: registerDto.phone_number,
      email: registerDto.email,
      password: hashedPassword,
      role_id: sellerRole.id,
      first_name: registerDto.first_name,
      last_name: registerDto.last_name,
      is_active: true,
      is_seller_approved: false, // Pending admin approval
      is_phone_verified: true, // Verified via OTP
      is_email_verified: true, // Verified via OTP
      is_kyc_verified: false,
    });

    await this.userRepository.save(seller);

    // Generate tokens (seller can login but needs approval for full access)
    const payload: JwtPayload = {
      sub: seller.id,
      role: sellerRole.name,
      phone_number: seller.phone_number,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = await this.refreshTokenService.createRefreshToken(
      seller.id,
      deviceId,
      ipAddress,
      userAgent,
    );

    return {
      access_token,
      refresh_token,
      user: {
        id: seller.id,
        phone_number: seller.phone_number,
        email: seller.email,
        first_name: seller.first_name,
        last_name: seller.last_name,
        is_seller_approved: seller.is_seller_approved,
        is_kyc_verified: seller.is_kyc_verified,
      },
      message: 'Seller registered successfully. Pending admin approval.',
    };
  }

  /**
   * Login seller
   */
  async login(
    loginDto: SellerLoginDto,
    deviceId?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ access_token: string; refresh_token: string; user: any }> {
    // Find seller by phone or email
    const seller = await this.userRepository.findOne({
      where: [
        { phone_number: loginDto.identifier },
        { email: loginDto.identifier },
      ],
      relations: ['role'],
    });

    if (!seller) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is a seller
    if (seller.role.name !== RoleName.SELLER) {
      throw new UnauthorizedException('Invalid user type');
    }

    if (!seller.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      seller.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const payload: JwtPayload = {
      sub: seller.id,
      role: seller.role.name,
      phone_number: seller.phone_number,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = await this.refreshTokenService.createRefreshToken(
      seller.id,
      deviceId,
      ipAddress,
      userAgent,
    );

    return {
      access_token,
      refresh_token,
      user: {
        id: seller.id,
        phone_number: seller.phone_number,
        email: seller.email,
        first_name: seller.first_name,
        last_name: seller.last_name,
        is_seller_approved: seller.is_seller_approved,
        is_kyc_verified: seller.is_kyc_verified,
      },
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    const tokenEntity = await this.refreshTokenService.verifyRefreshToken(refreshToken);
    
    const seller = await this.userRepository.findOne({
      where: { id: tokenEntity.user_id },
      relations: ['role'],
    });

    if (!seller || !seller.is_active) {
      throw new UnauthorizedException('Seller not found or inactive');
    }

    if (seller.role.name !== RoleName.SELLER) {
      throw new UnauthorizedException('Invalid user type');
    }

    // Revoke old token
    await this.refreshTokenService.revokeRefreshToken(refreshToken);

    // Generate new tokens
    const payload: JwtPayload = {
      sub: seller.id,
      role: seller.role.name,
      phone_number: seller.phone_number,
    };

    const access_token = this.jwtService.sign(payload);
    const new_refresh_token = await this.refreshTokenService.createRefreshToken(
      seller.id,
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

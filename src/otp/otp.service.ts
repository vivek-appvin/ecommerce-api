import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { OtpEntity, OtpType, OtpPurpose } from './otp.entity';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  private readonly OTP_EXPIRY_MINUTES = 10;
  private readonly OTP_LENGTH = 6;
  private readonly MAX_OTP_ATTEMPTS = 5; // Max OTPs per hour per identifier

  constructor(
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
  ) {}

  /**
   * Generate a random 6-digit OTP code
   */
  private generateOtpCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Check if identifier has exceeded max OTP attempts
   */
  private async checkOtpRateLimit(
    identifier: string,
    type: OtpType,
    purpose: OtpPurpose,
  ): Promise<void> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOtps = await this.otpRepository.count({
      where: {
        identifier,
        type,
        purpose,
        created_at: LessThan(new Date()),
      },
    });

    if (recentOtps >= this.MAX_OTP_ATTEMPTS) {
      throw new BadRequestException(
        'Too many OTP requests. Please try again after some time.',
      );
    }
  }

  /**
   * Invalidate previous unused OTPs for the same identifier and purpose
   */
  private async invalidatePreviousOtps(
    identifier: string,
    type: OtpType,
    purpose: OtpPurpose,
  ): Promise<void> {
    await this.otpRepository.update(
      {
        identifier,
        type,
        purpose,
        is_used: false,
        is_verified: false,
      },
      {
        is_used: true,
      },
    );
  }

  /**
   * Generate and save OTP
   */
  async generateOtp(
    identifier: string,
    type: OtpType,
    purpose: OtpPurpose,
  ): Promise<string> {
    // Check rate limit
    await this.checkOtpRateLimit(identifier, type, purpose);

    // Invalidate previous unused OTPs
    await this.invalidatePreviousOtps(identifier, type, purpose);

    // Generate new OTP
    const code = this.generateOtpCode();
    const expiresAt = new Date(
      Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000,
    );

    const otp = this.otpRepository.create({
      identifier,
      type,
      purpose,
      code,
      expires_at: expiresAt,
    });

    await this.otpRepository.save(otp);

    // TODO: Integrate with email/SMS service
    // For now, we'll return the OTP (remove this in production)
    console.log(`OTP for ${identifier} (${type}): ${code}`);

    return code;
  }

  /**
   * Generate same OTP for multiple identifiers (email and phone)
   */
  async generateOtpForMultiple(
    email: string | null,
    phone: string | null,
    purpose: OtpPurpose,
  ): Promise<string> {
    if (!email && !phone) {
      throw new BadRequestException('Either email or phone number is required');
    }

    // Generate single OTP code for both
    const code = this.generateOtpCode();
    const expiresAt = new Date(
      Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000,
    );

    // Invalidate previous unused OTPs for both identifiers
    if (email) {
      await this.invalidatePreviousOtps(email, OtpType.EMAIL, purpose);
    }
    if (phone) {
      await this.invalidatePreviousOtps(phone, OtpType.MOBILE, purpose);
    }

    // Create OTP entries for both identifiers
    const otps: OtpEntity[] = [];
    
    if (email) {
      // Check rate limit for email
      await this.checkOtpRateLimit(email, OtpType.EMAIL, purpose);
      otps.push(
        this.otpRepository.create({
          identifier: email,
          type: OtpType.EMAIL,
          purpose,
          code,
          expires_at: expiresAt,
        }),
      );
    }
    
    if (phone) {
      // Check rate limit for phone
      await this.checkOtpRateLimit(phone, OtpType.MOBILE, purpose);
      otps.push(
        this.otpRepository.create({
          identifier: phone,
          type: OtpType.MOBILE,
          purpose,
          code,
          expires_at: expiresAt,
        }),
      );
    }

    // Save all OTPs
    await this.otpRepository.save(otps);

    // TODO: Integrate with email/SMS service
    // For now, we'll log the OTP (remove this in production)
    if (email) {
      console.log(`OTP for ${email} (EMAIL): ${code}`);
    }
    if (phone) {
      console.log(`OTP for ${phone} (MOBILE): ${code}`);
    }

    return code;
  }

  /**
   * Verify OTP
   */
  async verifyOtp(
    identifier: string,
    code: string,
    type: OtpType,
    purpose: OtpPurpose,
  ): Promise<boolean> {
    const otp = await this.otpRepository.findOne({
      where: {
        identifier,
        code,
        type,
        purpose,
        is_used: false,
        is_verified: false,
      },
      order: {
        created_at: 'DESC',
      },
    });

    if (!otp) {
      return false;
    }

    // Check if OTP is expired
    if (new Date() > otp.expires_at) {
      throw new BadRequestException('OTP has expired');
    }

    // Mark OTP as verified and used
    otp.is_verified = true;
    otp.is_used = true;
    await this.otpRepository.save(otp);

    return true;
  }

  /**
   * Verify OTP from either email or phone (same OTP code)
   */
  async verifyOtpFromEither(
    email: string | null,
    phone: string | null,
    code: string,
    purpose: OtpPurpose,
  ): Promise<boolean> {
    if (!email && !phone) {
      throw new BadRequestException('Either email or phone number is required');
    }

    // Try to find OTP with the code and purpose from either identifier
    const conditions: any[] = [];
    
    if (email) {
      conditions.push({
        identifier: email,
        type: OtpType.EMAIL,
        code,
        purpose,
        is_used: false,
        is_verified: false,
      });
    }
    
    if (phone) {
      conditions.push({
        identifier: phone,
        type: OtpType.MOBILE,
        code,
        purpose,
        is_used: false,
        is_verified: false,
      });
    }

    // Find OTP from either email or phone
    let otp: OtpEntity | null = null;
    for (const condition of conditions) {
      otp = await this.otpRepository.findOne({
        where: condition,
        order: {
          created_at: 'DESC',
        },
      });
      if (otp) break;
    }

    if (!otp) {
      return false;
    }

    // Check if OTP is expired
    if (new Date() > otp.expires_at) {
      throw new BadRequestException('OTP has expired');
    }

    // Mark all OTPs with same code and purpose as verified and used
    // (because same code was sent to both email and phone)
    await this.otpRepository.update(
      {
        code,
        purpose,
        is_used: false,
        is_verified: false,
      },
      {
        is_verified: true,
        is_used: true,
      },
    );

    return true;
  }

  /**
   * Resend OTP
   */
  async resendOtp(
    identifier: string,
    type: OtpType,
    purpose: OtpPurpose,
  ): Promise<string> {
    return this.generateOtp(identifier, type, purpose);
  }

  /**
   * Clean up expired OTPs (can be called by a cron job)
   */
  async cleanupExpiredOtps(): Promise<void> {
    await this.otpRepository.delete({
      expires_at: LessThan(new Date()),
      is_used: true,
    });
  }
}

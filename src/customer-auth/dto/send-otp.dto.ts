import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { OtpType, OtpPurpose } from '../../otp/otp.entity';

export class SendOtpDto {
  @ApiPropertyOptional({
    description: 'Email address (optional, at least one of email or phone is required)',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail()
  @ValidateIf((o) => !o.phone_number)
  @IsNotEmpty()
  email?: string;

  @ApiPropertyOptional({
    description: 'Phone number (optional, at least one of email or phone is required)',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.email)
  @IsNotEmpty()
  phone_number?: string;

  @ApiProperty({
    description: 'Purpose of OTP',
    enum: OtpPurpose,
    example: OtpPurpose.REGISTRATION,
  })
  @IsEnum(OtpPurpose)
  @IsNotEmpty()
  purpose: OtpPurpose;

  // Legacy fields for backward compatibility (for password reset)
  @ApiPropertyOptional({
    description: 'Email address or phone number (legacy, use email/phone_number instead)',
    example: 'user@example.com or +1234567890',
  })
  @IsOptional()
  @IsString()
  identifier?: string;

  @ApiPropertyOptional({
    description: 'Type of OTP (EMAIL or MOBILE) - legacy, used only with identifier',
    enum: OtpType,
  })
  @IsOptional()
  @IsEnum(OtpType)
  type?: OtpType;
}

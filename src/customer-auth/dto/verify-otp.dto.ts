import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { OtpType, OtpPurpose } from '../../otp/otp.entity';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Email address or phone number',
    example: 'user@example.com or +1234567890',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({
    description: 'OTP code',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Type of OTP (EMAIL or MOBILE)',
    enum: OtpType,
  })
  @IsEnum(OtpType)
  @IsNotEmpty()
  type: OtpType;

  @ApiProperty({
    description: 'Purpose of OTP',
    enum: OtpPurpose,
  })
  @IsEnum(OtpPurpose)
  @IsNotEmpty()
  purpose: OtpPurpose;
}

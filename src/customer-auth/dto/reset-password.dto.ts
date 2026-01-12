import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, MinLength } from 'class-validator';
import { OtpType } from '../../otp/otp.entity';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email address or phone number',
    example: 'user@example.com or +1234567890',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({
    description: 'Type of identifier (EMAIL or MOBILE)',
    enum: OtpType,
  })
  @IsEnum(OtpType)
  @IsNotEmpty()
  type: OtpType;

  @ApiProperty({
    description: 'OTP code',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  otp_code: string;

  @ApiProperty({
    description: 'New password (minimum 6 characters)',
    example: 'newpassword123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  new_password: string;
}

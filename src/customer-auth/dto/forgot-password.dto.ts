import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { OtpType } from '../../otp/otp.entity';

export class ForgotPasswordDto {
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
}

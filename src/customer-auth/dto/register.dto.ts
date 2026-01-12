import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail, MinLength } from 'class-validator';

export class CustomerRegisterDto {
  @ApiProperty({
    description: 'Phone number (required, unique)',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'OTP code for phone number verification',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  otp_code: string;

  @ApiPropertyOptional({
    description: 'First name',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiPropertyOptional({
    description: 'Last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  last_name?: string;
}

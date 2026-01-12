import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail, MinLength } from 'class-validator';

export class SellerRegisterDto {
  @ApiProperty({
    description: 'Phone number (required, unique)',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    description: 'Email address (required)',
    example: 'seller@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

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
    description: 'OTP code for email and phone verification (same OTP sent to both)',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  otp_code: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiPropertyOptional({
    description: 'Business name',
    example: 'ABC Store',
  })
  @IsOptional()
  @IsString()
  business_name?: string;
}

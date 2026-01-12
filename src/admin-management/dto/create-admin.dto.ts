import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Email address',
    example: 'admin@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    description: 'Password for the new admin',
    example: 'securePassword123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

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
    description: 'Send credentials email to new admin',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  send_credentials_email?: boolean;
}

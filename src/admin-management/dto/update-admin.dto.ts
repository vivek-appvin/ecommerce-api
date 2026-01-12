import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, MinLength, IsBoolean } from 'class-validator';

export class UpdateAdminDto {
  @ApiPropertyOptional({
    description: 'Email address',
    example: 'admin@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone_number?: string;

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

  @ApiPropertyOptional({
    description: 'Is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

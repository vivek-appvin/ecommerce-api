import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({
    description: 'Email address',
    example: 'admin@example.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'admin123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

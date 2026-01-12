import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CustomerLoginDto {
  @ApiProperty({
    description: 'Phone number or email',
    example: '+1234567890 or user@example.com',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({
    description: 'Password',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

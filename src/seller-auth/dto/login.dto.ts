import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SellerLoginDto {
  @ApiProperty({
    description: 'Phone number or email',
    example: '+1234567890 or seller@example.com',
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

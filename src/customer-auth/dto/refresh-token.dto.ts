import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token',
    example: 'refresh_token_string_here',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}

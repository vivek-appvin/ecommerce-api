import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsBoolean } from 'class-validator';

export class BlockUserDto {
  @ApiProperty({
    description: 'User ID',
    example: 'uuid-here',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Block status (true to block, false to unblock)',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  is_blocked: boolean;
}

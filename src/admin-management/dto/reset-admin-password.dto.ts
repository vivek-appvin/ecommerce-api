import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNotEmpty, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class ResetAdminPasswordDto {
  @ApiProperty({
    description: 'Admin user ID',
    example: 'uuid-here',
  })
  @IsUUID()
  @IsNotEmpty()
  admin_id: string;

  @ApiProperty({
    description: 'New password',
    example: 'newSecurePassword123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  new_password: string;

  @ApiProperty({
    description: 'Send password reset email to admin',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  send_email?: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class ApproveSellerDto {
  @ApiProperty({
    description: 'Seller user ID',
    example: 'uuid-here',
  })
  @IsUUID()
  @IsNotEmpty()
  seller_id: string;
}

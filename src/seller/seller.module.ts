import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { SellerKycEntity } from './entities/seller-kyc.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SellerKycEntity, UserEntity])],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminManagementController } from './admin-management.controller';
import { AdminManagementService } from './admin-management.service';
import { UserEntity } from '../users/user.entity';
import { RoleEntity } from '../roles/role.entity';
import { KycEntity } from '../kyc/kyc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, KycEntity])],
  controllers: [AdminManagementController],
  providers: [AdminManagementService],
  exports: [AdminManagementService],
})
export class AdminManagementModule {}

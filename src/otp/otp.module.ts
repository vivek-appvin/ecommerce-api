import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpService } from './otp.service';
import { OtpEntity } from './entities/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity])],
  providers: [OtpService]
})
export class OtpModule {}

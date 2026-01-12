import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RefreshTokenEntity } from './refresh-token.entity';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    JwtModule,
    ConfigModule,
  ],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}

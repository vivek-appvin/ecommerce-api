import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokensService } from './refresh-tokens.service';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity, UserEntity])],
  providers: [RefreshTokensService]
})
export class RefreshTokensModule {}

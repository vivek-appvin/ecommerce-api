import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { CustomerAuthController } from './customer-auth.controller';
import { CustomerAuthService } from './customer-auth.service';
import { UserEntity } from '../users/user.entity';
import { RoleEntity } from '../roles/role.entity';
import { OtpModule } from '../otp/otp.module';
import { RefreshTokenModule } from '../refresh-tokens/refresh-token.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: {
          expiresIn: '15m',
        },
      }),
      inject: [ConfigService],
    }),
    OtpModule,
    RefreshTokenModule,
  ],
  controllers: [CustomerAuthController],
  providers: [CustomerAuthService, JwtStrategy],
  exports: [CustomerAuthService],
})
export class CustomerAuthModule {}

import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CustomerAuthModule } from './customer-auth/customer-auth.module';
import { SellerAuthModule } from './seller-auth/seller-auth.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { AdminManagementModule } from './admin-management/admin-management.module';
import { OtpModule } from './otp/otp.module';
import { RefreshTokenModule } from './refresh-tokens/refresh-token.module';
import { UserEntity } from './users/user.entity';
import { RoleEntity } from './roles/role.entity';
import { OtpEntity } from './otp/otp.entity';
import { RefreshTokenEntity } from './refresh-tokens/refresh-token.entity';
import { AddressEntity } from './addresses/address.entity';
import { KycEntity } from './kyc/kyc.entity';
import { DataSource } from 'typeorm';
import { LoggerMiddleware } from './utils/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
   TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    url: configService.get<string>('DATABASE_URL'),
    autoLoadEntities: true,
    synchronize: false,
    logging: true,
  }),
}),
    UsersModule,
    AuthModule,
    CustomerAuthModule,
    SellerAuthModule,
    AdminAuthModule,
    AdminManagementModule,
    OtpModule,
    RefreshTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) { }

  onModuleInit() {
    if (this.dataSource.isInitialized) {
      console.log('✅ Database connected successfully');
    } else {
      console.error('❌ Failed to connect to the database');
    }
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}


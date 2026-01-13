import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LoggerMiddleware } from './utils/middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SellerModule } from './seller/seller.module';
import { AdminModule } from './admin/admin.module';
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';
import { RolesModule } from './roles/roles.module';
import { OtpModule } from './otp/otp.module';

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
    synchronize: true,
    logging: true,
    ssl: {
      rejectUnauthorized: false,
    },
  }),
}),
   AuthModule,
   UserModule,
   SellerModule,
   AdminModule,
   RefreshTokensModule,
   RolesModule,
   OtpModule,
   
  ],
  controllers: [],
  providers: [],
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


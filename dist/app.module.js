"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const customer_auth_module_1 = require("./customer-auth/customer-auth.module");
const seller_auth_module_1 = require("./seller-auth/seller-auth.module");
const admin_auth_module_1 = require("./admin-auth/admin-auth.module");
const admin_management_module_1 = require("./admin-management/admin-management.module");
const otp_module_1 = require("./otp/otp.module");
const refresh_token_module_1 = require("./refresh-tokens/refresh-token.module");
const typeorm_2 = require("typeorm");
const logger_middleware_1 = require("./utils/middleware/logger.middleware");
let AppModule = class AppModule {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    onModuleInit() {
        if (this.dataSource.isInitialized) {
            console.log('✅ Database connected successfully');
        }
        else {
            console.error('❌ Failed to connect to the database');
        }
    }
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    url: configService.get('DATABASE_URL'),
                    autoLoadEntities: true,
                    synchronize: false,
                    logging: true,
                }),
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            customer_auth_module_1.CustomerAuthModule,
            seller_auth_module_1.SellerAuthModule,
            admin_auth_module_1.AdminAuthModule,
            admin_management_module_1.AdminManagementModule,
            otp_module_1.OtpModule,
            refresh_token_module_1.RefreshTokenModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AppModule);
//# sourceMappingURL=app.module.js.map
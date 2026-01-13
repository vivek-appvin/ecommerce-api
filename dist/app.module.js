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
const typeorm_2 = require("typeorm");
const logger_middleware_1 = require("./utils/middleware/logger.middleware");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const seller_module_1 = require("./seller/seller.module");
const admin_module_1 = require("./admin/admin.module");
const refresh_tokens_module_1 = require("./refresh-tokens/refresh-tokens.module");
const roles_module_1 = require("./roles/roles.module");
const otp_module_1 = require("./otp/otp.module");
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
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            seller_module_1.SellerModule,
            admin_module_1.AdminModule,
            refresh_tokens_module_1.RefreshTokensModule,
            roles_module_1.RolesModule,
            otp_module_1.OtpModule,
        ],
        controllers: [],
        providers: [],
    }),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AppModule);
//# sourceMappingURL=app.module.js.map
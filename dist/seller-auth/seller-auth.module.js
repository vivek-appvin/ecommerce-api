"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerAuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const seller_auth_controller_1 = require("./seller-auth.controller");
const seller_auth_service_1 = require("./seller-auth.service");
const user_entity_1 = require("../users/user.entity");
const role_entity_1 = require("../roles/role.entity");
const refresh_token_module_1 = require("../refresh-tokens/refresh-token.module");
const otp_module_1 = require("../otp/otp.module");
const jwt_strategy_1 = require("../auth/strategies/jwt.strategy");
let SellerAuthModule = class SellerAuthModule {
};
exports.SellerAuthModule = SellerAuthModule;
exports.SellerAuthModule = SellerAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, role_entity_1.RoleEntity]),
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'your-secret-key',
                    signOptions: {
                        expiresIn: '15m',
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            refresh_token_module_1.RefreshTokenModule,
            otp_module_1.OtpModule,
        ],
        controllers: [seller_auth_controller_1.SellerAuthController],
        providers: [seller_auth_service_1.SellerAuthService, jwt_strategy_1.JwtStrategy],
        exports: [seller_auth_service_1.SellerAuthService],
    })
], SellerAuthModule);
//# sourceMappingURL=seller-auth.module.js.map
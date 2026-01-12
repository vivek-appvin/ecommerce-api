"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const refresh_token_entity_1 = require("./refresh-token.entity");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
let RefreshTokenService = class RefreshTokenService {
    refreshTokenRepository;
    jwtService;
    configService;
    REFRESH_TOKEN_EXPIRY_DAYS = 30;
    constructor(refreshTokenRepository, jwtService, configService) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    generateRefreshToken() {
        return crypto.randomBytes(64).toString('hex');
    }
    async createRefreshToken(userId, deviceId, ipAddress, userAgent) {
        const token = this.generateRefreshToken();
        const expiresAt = new Date(Date.now() + this.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        const refreshToken = this.refreshTokenRepository.create({
            user_id: userId,
            token,
            device_id: deviceId || null,
            ip_address: ipAddress || null,
            user_agent: userAgent || null,
            expires_at: expiresAt,
        });
        await this.refreshTokenRepository.save(refreshToken);
        return token;
    }
    async verifyRefreshToken(token) {
        const refreshToken = await this.refreshTokenRepository.findOne({
            where: {
                token,
                is_active: true,
            },
            relations: ['user'],
        });
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        if (new Date() > refreshToken.expires_at) {
            refreshToken.is_active = false;
            await this.refreshTokenRepository.save(refreshToken);
            throw new common_1.UnauthorizedException('Refresh token has expired');
        }
        return refreshToken;
    }
    async revokeRefreshToken(token) {
        await this.refreshTokenRepository.update({ token }, { is_active: false });
    }
    async revokeAllUserTokens(userId) {
        await this.refreshTokenRepository.update({ user_id: userId, is_active: true }, { is_active: false });
    }
    async cleanupExpiredTokens() {
        await this.refreshTokenRepository.delete({
            expires_at: (0, typeorm_2.LessThan)(new Date()),
        });
    }
};
exports.RefreshTokenService = RefreshTokenService;
exports.RefreshTokenService = RefreshTokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshTokenEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], RefreshTokenService);
//# sourceMappingURL=refresh-token.service.js.map
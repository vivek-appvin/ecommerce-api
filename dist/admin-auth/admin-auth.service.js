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
exports.AdminAuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/user.entity");
const role_entity_1 = require("../roles/role.entity");
const refresh_token_service_1 = require("../refresh-tokens/refresh-token.service");
let AdminAuthService = class AdminAuthService {
    userRepository;
    roleRepository;
    jwtService;
    refreshTokenService;
    constructor(userRepository, roleRepository, jwtService, refreshTokenService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }
    async login(loginDto, deviceId, ipAddress, userAgent) {
        const admin = await this.userRepository.findOne({
            where: { email: loginDto.email },
            relations: ['role'],
        });
        if (!admin) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (admin.role.name !== role_entity_1.RoleName.ADMIN) {
            throw new common_1.UnauthorizedException('Invalid user type');
        }
        if (!admin.is_active) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: admin.id,
            role: admin.role.name,
            phone_number: admin.phone_number,
        };
        const access_token = this.jwtService.sign(payload);
        const refresh_token = await this.refreshTokenService.createRefreshToken(admin.id, deviceId, ipAddress, userAgent);
        return {
            access_token,
            refresh_token,
            user: {
                id: admin.id,
                email: admin.email,
                phone_number: admin.phone_number,
                first_name: admin.first_name,
                last_name: admin.last_name,
                role: admin.role.name,
            },
        };
    }
    async refreshToken(refreshToken) {
        const tokenEntity = await this.refreshTokenService.verifyRefreshToken(refreshToken);
        const admin = await this.userRepository.findOne({
            where: { id: tokenEntity.user_id },
            relations: ['role'],
        });
        if (!admin || !admin.is_active) {
            throw new common_1.UnauthorizedException('Admin not found or inactive');
        }
        if (admin.role.name !== role_entity_1.RoleName.ADMIN) {
            throw new common_1.UnauthorizedException('Invalid user type');
        }
        await this.refreshTokenService.revokeRefreshToken(refreshToken);
        const payload = {
            sub: admin.id,
            role: admin.role.name,
            phone_number: admin.phone_number,
        };
        const access_token = this.jwtService.sign(payload);
        const new_refresh_token = await this.refreshTokenService.createRefreshToken(admin.id, tokenEntity.device_id ?? undefined, tokenEntity.ip_address ?? undefined, tokenEntity.user_agent ?? undefined);
        return {
            access_token,
            refresh_token: new_refresh_token,
        };
    }
    async logout(refreshToken) {
        await this.refreshTokenService.revokeRefreshToken(refreshToken);
        return { message: 'Logged out successfully' };
    }
};
exports.AdminAuthService = AdminAuthService;
exports.AdminAuthService = AdminAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.RoleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        refresh_token_service_1.RefreshTokenService])
], AdminAuthService);
//# sourceMappingURL=admin-auth.service.js.map
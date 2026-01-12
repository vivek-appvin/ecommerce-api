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
exports.SellerAuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/user.entity");
const role_entity_1 = require("../roles/role.entity");
const refresh_token_service_1 = require("../refresh-tokens/refresh-token.service");
const otp_service_1 = require("../otp/otp.service");
const otp_entity_1 = require("../otp/otp.entity");
let SellerAuthService = class SellerAuthService {
    userRepository;
    roleRepository;
    jwtService;
    refreshTokenService;
    otpService;
    constructor(userRepository, roleRepository, jwtService, refreshTokenService, otpService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.otpService = otpService;
    }
    async sendRegistrationOtp(email, phone) {
        const existingUser = await this.userRepository.findOne({
            where: { phone_number: phone },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Phone number already registered');
        }
        const existingEmail = await this.userRepository.findOne({
            where: { email },
        });
        if (existingEmail) {
            throw new common_1.ConflictException('Email already registered');
        }
        await this.otpService.generateOtpForMultiple(email, phone, otp_entity_1.OtpPurpose.REGISTRATION);
        return {
            message: 'Same OTP sent to your email and phone number',
        };
    }
    async register(registerDto, deviceId, ipAddress, userAgent) {
        const isOtpValid = await this.otpService.verifyOtpFromEither(registerDto.email, registerDto.phone_number, registerDto.otp_code, otp_entity_1.OtpPurpose.REGISTRATION);
        if (!isOtpValid) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        const existingUser = await this.userRepository.findOne({
            where: { phone_number: registerDto.phone_number },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Phone number already registered');
        }
        const existingEmail = await this.userRepository.findOne({
            where: { email: registerDto.email },
        });
        if (existingEmail) {
            throw new common_1.ConflictException('Email already registered');
        }
        const sellerRole = await this.roleRepository.findOne({
            where: { name: role_entity_1.RoleName.SELLER },
        });
        if (!sellerRole) {
            throw new Error('SELLER role not found. Please seed the database.');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const seller = this.userRepository.create({
            phone_number: registerDto.phone_number,
            email: registerDto.email,
            password: hashedPassword,
            role_id: sellerRole.id,
            first_name: registerDto.first_name,
            last_name: registerDto.last_name,
            is_active: true,
            is_seller_approved: false,
            is_phone_verified: true,
            is_email_verified: true,
            is_kyc_verified: false,
        });
        await this.userRepository.save(seller);
        const payload = {
            sub: seller.id,
            role: sellerRole.name,
            phone_number: seller.phone_number,
        };
        const access_token = this.jwtService.sign(payload);
        const refresh_token = await this.refreshTokenService.createRefreshToken(seller.id, deviceId, ipAddress, userAgent);
        return {
            access_token,
            refresh_token,
            user: {
                id: seller.id,
                phone_number: seller.phone_number,
                email: seller.email,
                first_name: seller.first_name,
                last_name: seller.last_name,
                is_seller_approved: seller.is_seller_approved,
                is_kyc_verified: seller.is_kyc_verified,
            },
            message: 'Seller registered successfully. Pending admin approval.',
        };
    }
    async login(loginDto, deviceId, ipAddress, userAgent) {
        const seller = await this.userRepository.findOne({
            where: [
                { phone_number: loginDto.identifier },
                { email: loginDto.identifier },
            ],
            relations: ['role'],
        });
        if (!seller) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (seller.role.name !== role_entity_1.RoleName.SELLER) {
            throw new common_1.UnauthorizedException('Invalid user type');
        }
        if (!seller.is_active) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, seller.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: seller.id,
            role: seller.role.name,
            phone_number: seller.phone_number,
        };
        const access_token = this.jwtService.sign(payload);
        const refresh_token = await this.refreshTokenService.createRefreshToken(seller.id, deviceId, ipAddress, userAgent);
        return {
            access_token,
            refresh_token,
            user: {
                id: seller.id,
                phone_number: seller.phone_number,
                email: seller.email,
                first_name: seller.first_name,
                last_name: seller.last_name,
                is_seller_approved: seller.is_seller_approved,
                is_kyc_verified: seller.is_kyc_verified,
            },
        };
    }
    async refreshToken(refreshToken) {
        const tokenEntity = await this.refreshTokenService.verifyRefreshToken(refreshToken);
        const seller = await this.userRepository.findOne({
            where: { id: tokenEntity.user_id },
            relations: ['role'],
        });
        if (!seller || !seller.is_active) {
            throw new common_1.UnauthorizedException('Seller not found or inactive');
        }
        if (seller.role.name !== role_entity_1.RoleName.SELLER) {
            throw new common_1.UnauthorizedException('Invalid user type');
        }
        await this.refreshTokenService.revokeRefreshToken(refreshToken);
        const payload = {
            sub: seller.id,
            role: seller.role.name,
            phone_number: seller.phone_number,
        };
        const access_token = this.jwtService.sign(payload);
        const new_refresh_token = await this.refreshTokenService.createRefreshToken(seller.id, tokenEntity.device_id ?? undefined, tokenEntity.ip_address ?? undefined, tokenEntity.user_agent ?? undefined);
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
exports.SellerAuthService = SellerAuthService;
exports.SellerAuthService = SellerAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.RoleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        refresh_token_service_1.RefreshTokenService,
        otp_service_1.OtpService])
], SellerAuthService);
//# sourceMappingURL=seller-auth.service.js.map
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
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const otp_entity_1 = require("./otp.entity");
const crypto = __importStar(require("crypto"));
let OtpService = class OtpService {
    otpRepository;
    OTP_EXPIRY_MINUTES = 10;
    OTP_LENGTH = 6;
    MAX_OTP_ATTEMPTS = 5;
    constructor(otpRepository) {
        this.otpRepository = otpRepository;
    }
    generateOtpCode() {
        return crypto.randomInt(100000, 999999).toString();
    }
    async checkOtpRateLimit(identifier, type, purpose) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentOtps = await this.otpRepository.count({
            where: {
                identifier,
                type,
                purpose,
                created_at: (0, typeorm_2.LessThan)(new Date()),
            },
        });
        if (recentOtps >= this.MAX_OTP_ATTEMPTS) {
            throw new common_1.BadRequestException('Too many OTP requests. Please try again after some time.');
        }
    }
    async invalidatePreviousOtps(identifier, type, purpose) {
        await this.otpRepository.update({
            identifier,
            type,
            purpose,
            is_used: false,
            is_verified: false,
        }, {
            is_used: true,
        });
    }
    async generateOtp(identifier, type, purpose) {
        await this.checkOtpRateLimit(identifier, type, purpose);
        await this.invalidatePreviousOtps(identifier, type, purpose);
        const code = this.generateOtpCode();
        const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);
        const otp = this.otpRepository.create({
            identifier,
            type,
            purpose,
            code,
            expires_at: expiresAt,
        });
        await this.otpRepository.save(otp);
        console.log(`OTP for ${identifier} (${type}): ${code}`);
        return code;
    }
    async generateOtpForMultiple(email, phone, purpose) {
        if (!email && !phone) {
            throw new common_1.BadRequestException('Either email or phone number is required');
        }
        const code = this.generateOtpCode();
        const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);
        if (email) {
            await this.invalidatePreviousOtps(email, otp_entity_1.OtpType.EMAIL, purpose);
        }
        if (phone) {
            await this.invalidatePreviousOtps(phone, otp_entity_1.OtpType.MOBILE, purpose);
        }
        const otps = [];
        if (email) {
            await this.checkOtpRateLimit(email, otp_entity_1.OtpType.EMAIL, purpose);
            otps.push(this.otpRepository.create({
                identifier: email,
                type: otp_entity_1.OtpType.EMAIL,
                purpose,
                code,
                expires_at: expiresAt,
            }));
        }
        if (phone) {
            await this.checkOtpRateLimit(phone, otp_entity_1.OtpType.MOBILE, purpose);
            otps.push(this.otpRepository.create({
                identifier: phone,
                type: otp_entity_1.OtpType.MOBILE,
                purpose,
                code,
                expires_at: expiresAt,
            }));
        }
        await this.otpRepository.save(otps);
        if (email) {
            console.log(`OTP for ${email} (EMAIL): ${code}`);
        }
        if (phone) {
            console.log(`OTP for ${phone} (MOBILE): ${code}`);
        }
        return code;
    }
    async verifyOtp(identifier, code, type, purpose) {
        const otp = await this.otpRepository.findOne({
            where: {
                identifier,
                code,
                type,
                purpose,
                is_used: false,
                is_verified: false,
            },
            order: {
                created_at: 'DESC',
            },
        });
        if (!otp) {
            return false;
        }
        if (new Date() > otp.expires_at) {
            throw new common_1.BadRequestException('OTP has expired');
        }
        otp.is_verified = true;
        otp.is_used = true;
        await this.otpRepository.save(otp);
        return true;
    }
    async verifyOtpFromEither(email, phone, code, purpose) {
        if (!email && !phone) {
            throw new common_1.BadRequestException('Either email or phone number is required');
        }
        const conditions = [];
        if (email) {
            conditions.push({
                identifier: email,
                type: otp_entity_1.OtpType.EMAIL,
                code,
                purpose,
                is_used: false,
                is_verified: false,
            });
        }
        if (phone) {
            conditions.push({
                identifier: phone,
                type: otp_entity_1.OtpType.MOBILE,
                code,
                purpose,
                is_used: false,
                is_verified: false,
            });
        }
        let otp = null;
        for (const condition of conditions) {
            otp = await this.otpRepository.findOne({
                where: condition,
                order: {
                    created_at: 'DESC',
                },
            });
            if (otp)
                break;
        }
        if (!otp) {
            return false;
        }
        if (new Date() > otp.expires_at) {
            throw new common_1.BadRequestException('OTP has expired');
        }
        await this.otpRepository.update({
            code,
            purpose,
            is_used: false,
            is_verified: false,
        }, {
            is_verified: true,
            is_used: true,
        });
        return true;
    }
    async resendOtp(identifier, type, purpose) {
        return this.generateOtp(identifier, type, purpose);
    }
    async cleanupExpiredOtps() {
        await this.otpRepository.delete({
            expires_at: (0, typeorm_2.LessThan)(new Date()),
            is_used: true,
        });
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(otp_entity_1.OtpEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OtpService);
//# sourceMappingURL=otp.service.js.map
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
exports.AdminManagementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/user.entity");
const role_entity_1 = require("../roles/role.entity");
const kyc_entity_1 = require("../kyc/kyc.entity");
let AdminManagementService = class AdminManagementService {
    userRepository;
    roleRepository;
    kycRepository;
    constructor(userRepository, roleRepository, kycRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.kycRepository = kycRepository;
    }
    async getAllUsers(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [users, total] = await this.userRepository.findAndCount({
            where: {
                role: { name: role_entity_1.RoleName.USER },
            },
            relations: ['role'],
            skip,
            take: limit,
            order: { created_at: 'DESC' },
        });
        return {
            data: users.map((user) => ({
                id: user.id,
                phone_number: user.phone_number,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                is_active: user.is_active,
                is_phone_verified: user.is_phone_verified,
                is_email_verified: user.is_email_verified,
                created_at: user.created_at,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getUserById(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['role'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            id: user.id,
            phone_number: user.phone_number,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_active: user.is_active,
            is_phone_verified: user.is_phone_verified,
            is_email_verified: user.is_email_verified,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
    }
    async blockUser(userId, isBlocked, adminId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['role'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.is_active = !isBlocked;
        await this.userRepository.save(user);
        return {
            message: isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
            user: {
                id: user.id,
                phone_number: user.phone_number,
                email: user.email,
                is_active: user.is_active,
            },
        };
    }
    async getAllSellers(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [sellers, total] = await this.userRepository.findAndCount({
            where: {
                role: { name: role_entity_1.RoleName.SELLER },
            },
            relations: ['role'],
            skip,
            take: limit,
            order: { created_at: 'DESC' },
        });
        return {
            data: sellers.map((seller) => ({
                id: seller.id,
                phone_number: seller.phone_number,
                email: seller.email,
                first_name: seller.first_name,
                last_name: seller.last_name,
                is_active: seller.is_active,
                is_seller_approved: seller.is_seller_approved,
                seller_approved_at: seller.seller_approved_at,
                is_kyc_verified: seller.is_kyc_verified,
                created_at: seller.created_at,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getSellerById(sellerId) {
        const seller = await this.userRepository.findOne({
            where: { id: sellerId },
            relations: ['role'],
        });
        if (!seller || seller.role.name !== role_entity_1.RoleName.SELLER) {
            throw new common_1.NotFoundException('Seller not found');
        }
        const kyc = await this.kycRepository.findOne({
            where: { user_id: sellerId },
        });
        return {
            id: seller.id,
            phone_number: seller.phone_number,
            email: seller.email,
            first_name: seller.first_name,
            last_name: seller.last_name,
            is_active: seller.is_active,
            is_seller_approved: seller.is_seller_approved,
            seller_approved_at: seller.seller_approved_at,
            is_kyc_verified: seller.is_kyc_verified,
            kyc: kyc ? {
                status: kyc.status,
                is_pan_verified: kyc.is_pan_verified,
                is_gst_verified: kyc.is_gst_verified,
                is_bank_verified: kyc.is_bank_verified,
            } : null,
            created_at: seller.created_at,
            updated_at: seller.updated_at,
        };
    }
    async approveSeller(sellerId, adminId) {
        const seller = await this.userRepository.findOne({
            where: { id: sellerId },
            relations: ['role'],
        });
        if (!seller) {
            throw new common_1.NotFoundException('Seller not found');
        }
        if (seller.role.name !== role_entity_1.RoleName.SELLER) {
            throw new common_1.BadRequestException('User is not a seller');
        }
        if (seller.is_seller_approved) {
            throw new common_1.BadRequestException('Seller is already approved');
        }
        seller.is_seller_approved = true;
        seller.seller_approved_at = new Date();
        seller.approved_by = adminId;
        await this.userRepository.save(seller);
        return {
            message: 'Seller approved successfully',
            seller: {
                id: seller.id,
                email: seller.email,
                is_seller_approved: seller.is_seller_approved,
                seller_approved_at: seller.seller_approved_at,
            },
        };
    }
    async rejectSeller(sellerId, adminId, reason) {
        const seller = await this.userRepository.findOne({
            where: { id: sellerId },
            relations: ['role'],
        });
        if (!seller) {
            throw new common_1.NotFoundException('Seller not found');
        }
        if (seller.role.name !== role_entity_1.RoleName.SELLER) {
            throw new common_1.BadRequestException('User is not a seller');
        }
        seller.is_seller_approved = false;
        seller.approved_by = adminId;
        await this.userRepository.save(seller);
        return {
            message: 'Seller rejected successfully',
            seller: {
                id: seller.id,
                email: seller.email,
                is_seller_approved: seller.is_seller_approved,
            },
        };
    }
    async getPendingSellers(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [sellers, total] = await this.userRepository.findAndCount({
            where: {
                role: { name: role_entity_1.RoleName.SELLER },
                is_seller_approved: false,
            },
            relations: ['role'],
            skip,
            take: limit,
            order: { created_at: 'DESC' },
        });
        return {
            data: sellers.map((seller) => ({
                id: seller.id,
                phone_number: seller.phone_number,
                email: seller.email,
                first_name: seller.first_name,
                last_name: seller.last_name,
                created_at: seller.created_at,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getAllAdmins(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [admins, total] = await this.userRepository.findAndCount({
            where: {
                role: { name: role_entity_1.RoleName.ADMIN },
            },
            relations: ['role'],
            skip,
            take: limit,
            order: { created_at: 'DESC' },
        });
        return {
            data: admins.map((admin) => ({
                id: admin.id,
                phone_number: admin.phone_number,
                email: admin.email,
                first_name: admin.first_name,
                last_name: admin.last_name,
                is_active: admin.is_active,
                is_phone_verified: admin.is_phone_verified,
                is_email_verified: admin.is_email_verified,
                created_at: admin.created_at,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getAdminById(adminId) {
        const admin = await this.userRepository.findOne({
            where: { id: adminId },
            relations: ['role'],
        });
        if (!admin || admin.role.name !== role_entity_1.RoleName.ADMIN) {
            throw new common_1.NotFoundException('Admin not found');
        }
        return {
            id: admin.id,
            phone_number: admin.phone_number,
            email: admin.email,
            first_name: admin.first_name,
            last_name: admin.last_name,
            is_active: admin.is_active,
            is_phone_verified: admin.is_phone_verified,
            is_email_verified: admin.is_email_verified,
            created_at: admin.created_at,
            updated_at: admin.updated_at,
        };
    }
    async createAdmin(createAdminDto, createdByAdminId) {
        const existingEmail = await this.userRepository.findOne({
            where: { email: createAdminDto.email },
        });
        if (existingEmail) {
            throw new common_1.ConflictException('Email already registered');
        }
        const existingPhone = await this.userRepository.findOne({
            where: { phone_number: createAdminDto.phone_number },
        });
        if (existingPhone) {
            throw new common_1.ConflictException('Phone number already registered');
        }
        const adminRole = await this.roleRepository.findOne({
            where: { name: role_entity_1.RoleName.ADMIN },
        });
        if (!adminRole) {
            throw new Error('ADMIN role not found. Please seed the database.');
        }
        const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
        const admin = this.userRepository.create({
            phone_number: createAdminDto.phone_number,
            email: createAdminDto.email,
            password: hashedPassword,
            role_id: adminRole.id,
            first_name: createAdminDto.first_name,
            last_name: createAdminDto.last_name,
            is_active: true,
            is_phone_verified: true,
            is_email_verified: true,
        });
        await this.userRepository.save(admin);
        const credentials = {
            email: createAdminDto.email,
            password: createAdminDto.password,
        };
        return {
            admin: {
                id: admin.id,
                email: admin.email,
                phone_number: admin.phone_number,
                first_name: admin.first_name,
                last_name: admin.last_name,
                is_active: admin.is_active,
                is_phone_verified: admin.is_phone_verified,
                is_email_verified: admin.is_email_verified,
            },
            credentials,
        };
    }
    async updateAdmin(adminId, updateAdminDto) {
        const admin = await this.userRepository.findOne({
            where: { id: adminId },
            relations: ['role'],
        });
        if (!admin || admin.role.name !== role_entity_1.RoleName.ADMIN) {
            throw new common_1.NotFoundException('Admin not found');
        }
        if (updateAdminDto.email && updateAdminDto.email !== admin.email) {
            const existingEmail = await this.userRepository.findOne({
                where: { email: updateAdminDto.email },
            });
            if (existingEmail) {
                throw new common_1.ConflictException('Email already registered');
            }
        }
        if (updateAdminDto.phone_number && updateAdminDto.phone_number !== admin.phone_number) {
            const existingPhone = await this.userRepository.findOne({
                where: { phone_number: updateAdminDto.phone_number },
            });
            if (existingPhone) {
                throw new common_1.ConflictException('Phone number already registered');
            }
        }
        if (updateAdminDto.email)
            admin.email = updateAdminDto.email;
        if (updateAdminDto.phone_number)
            admin.phone_number = updateAdminDto.phone_number;
        if (updateAdminDto.first_name)
            admin.first_name = updateAdminDto.first_name;
        if (updateAdminDto.last_name)
            admin.last_name = updateAdminDto.last_name;
        if (typeof updateAdminDto.is_active === 'boolean')
            admin.is_active = updateAdminDto.is_active;
        await this.userRepository.save(admin);
        return {
            admin: {
                id: admin.id,
                email: admin.email,
                phone_number: admin.phone_number,
                first_name: admin.first_name,
                last_name: admin.last_name,
                is_active: admin.is_active,
                is_phone_verified: admin.is_phone_verified,
                is_email_verified: admin.is_email_verified,
            },
        };
    }
    async resetAdminPassword(adminId, newPassword) {
        const admin = await this.userRepository.findOne({
            where: { id: adminId },
            relations: ['role'],
        });
        if (!admin || admin.role.name !== role_entity_1.RoleName.ADMIN) {
            throw new common_1.NotFoundException('Admin not found');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        await this.userRepository.save(admin);
        return {
            message: 'Admin password reset successfully',
        };
    }
    async sendCredentialsEmail(email, password, firstName, lastName) {
        console.log(`
========================================
Admin Credentials Email
========================================
To: ${email}
Subject: Your Admin Account Credentials

Dear ${firstName} ${lastName},

Your admin account has been created. Here are your login credentials:

Email: ${email}
Password: ${password}

Please login and change your password for security.

Login URL: [Your Admin Dashboard URL]

Note: This is a temporary password. Please change it after first login.

Best regards,
Admin Team
========================================
    `);
    }
};
exports.AdminManagementService = AdminManagementService;
exports.AdminManagementService = AdminManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.RoleEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(kyc_entity_1.KycEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminManagementService);
//# sourceMappingURL=admin-management.service.js.map
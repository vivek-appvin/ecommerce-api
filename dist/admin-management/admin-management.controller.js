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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminManagementController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_management_service_1 = require("./admin-management.service");
const approve_seller_dto_1 = require("./dto/approve-seller.dto");
const block_user_dto_1 = require("./dto/block-user.dto");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const update_admin_dto_1 = require("./dto/update-admin.dto");
const reset_admin_password_dto_1 = require("./dto/reset-admin-password.dto");
const response_interceptor_1 = require("../utils/interceptor/response.interceptor");
const admin_guard_1 = require("../utils/guards/admin.guard");
let AdminManagementController = class AdminManagementController {
    adminManagementService;
    constructor(adminManagementService) {
        this.adminManagementService = adminManagementService;
    }
    async getAllUsers(page, limit) {
        try {
            const result = await this.adminManagementService.getAllUsers(page ? Number(page) : 1, limit ? Number(limit) : 10);
            return {
                msg: 'Users retrieved successfully',
                data: result,
            };
        }
        catch (err) {
            if (err instanceof common_1.HttpException)
                throw err;
            throw new common_1.InternalServerErrorException(err.message || 'Something went wrong');
        }
    }
    async getUserById(userId) {
        try {
            const result = await this.adminManagementService.getUserById(userId);
            return {
                msg: 'User retrieved successfully',
                data: result,
            };
        }
        catch (err) {
            if (err instanceof common_1.HttpException)
                throw err;
            throw new common_1.InternalServerErrorException(err.message || 'Something went wrong');
        }
    }
    async blockUser(blockUserDto, req) {
        try {
            const result = await this.adminManagementService.blockUser(blockUserDto.user_id, blockUserDto.is_blocked, req.user.id);
            return {
                msg: result.message,
                data: result.user,
            };
        }
        catch (err) {
            if (err instanceof common_1.HttpException)
                throw err;
            throw new common_1.InternalServerErrorException(err.message || 'Something went wrong');
        }
    }
    async getAllSellers(page, limit) {
        try {
            const result = await this.adminManagementService.getAllSellers(page ? Number(page) : 1, limit ? Number(limit) : 10);
            return {
                msg: 'Sellers retrieved successfully',
                data: result,
            };
        }
        catch (err) {
            if (err instanceof common_1.HttpException)
                throw err;
            throw new common_1.InternalServerErrorException(err.message || 'Something went wrong');
        }
    }
    async getPendingSellers(page, limit) {
        try {
            const result = await this.adminManagementService.getPendingSellers(page ? Number(page) : 1, limit ? Number(limit) : 10);
            return {
                msg: 'Pending sellers retrieved successfully',
                data: result,
            };
        }
        catch (err) {
            if (err instanceof common_1.HttpException)
                throw err;
            throw new common_1.InternalServerErrorException(err.message || 'Something went wrong');
        }
    }
    async getSellerById(sellerId) {
        try {
            const result = await this.adminManagementService.getSellerById(sellerId);
            return {
                msg: 'Seller retrieved successfully',
                data: result,
            };
        }
        catch (err) {
            if (err instanceof common_1.HttpException)
                throw err;
            throw new common_1.InternalServerErrorException(err.message || 'Something went wrong');
        }
    }
    async approveSeller(approveSellerDto, req) {
        try {
            const result = await this.adminManagementService.approveSeller(approveSellerDto.seller_id, req.user.id);
            return {
                msg: result.message,
                data: result.seller,
            };
        }
        catch (err) {
            if (err instanceof common_1.HttpException)
                throw err;
            throw new common_1.InternalServerErrorException(err.message || 'Something went wrong');
        }
    }
    async rejectSeller(approveSellerDto, req) {
        try {
            const result = await this.adminManagementService.rejectSeller(approveSellerDto.seller_id, req.user.id);
            return {
                msg: result.message,
                data: result.seller,
            };
        }
        catch (err) {
            if (err instanceof common_1.HttpException)
                throw err;
            throw new common_1.InternalServerErrorException(err.message || 'Something went wrong');
        }
    }
    async getAllAdmins(page, limit) {
        try {
            const result = await this.adminManagementService.getAllAdmins(page ? Number(page) : 1, limit ? Number(limit) : 10);
            return {
                msg: 'Admins retrieved successfully',
                data: result,
            };
        }
        catch (err) {
            if (err instanceof common_1.HttpException)
                throw err;
            throw new common_1.InternalServerErrorException(err.message || 'Something went wrong');
        }
    }
    async getAdminById(adminId) {
        try {
            const result = await this.adminManagementService.getAdminById(adminId);
            return {
                msg: 'Admin retrieved successfully',
                data: result,
            };
        }
        catch (err) {
            if (err instanceof common_1.HttpException)
                throw err;
            throw new common_1.InternalServerErrorException(err.message || 'Something went wrong');
        }
    }
    async createAdmin(createAdminDto, req) {
        try {
            const result = await this.adminManagementService.createAdmin(createAdminDto, req.user.id);
            if (createAdminDto.send_credentials_email !== false) {
                await this.adminManagementService.sendCredentialsEmail(result.credentials.email, result.credentials.password, createAdminDto.first_name, createAdminDto.last_name);
            }
            return {
                msg: 'Admin created successfully. Credentials email sent.',
                data: result.admin,
            };
        }
        catch (err) {
            if (err instanceof common_1.HttpException)
                throw err;
            throw new common_1.InternalServerErrorException(err.message || 'Something went wrong');
        }
    }
    async updateAdmin(adminId, updateAdminDto) {
        try {
            const result = await this.adminManagementService.updateAdmin(adminId, updateAdminDto);
            return {
                msg: 'Admin updated successfully',
                data: result.admin,
            };
        }
        catch (err) {
            if (err instanceof common_1.HttpException)
                throw err;
            throw new common_1.InternalServerErrorException(err.message || 'Something went wrong');
        }
    }
    async resetAdminPassword(resetPasswordDto) {
        try {
            const result = await this.adminManagementService.resetAdminPassword(resetPasswordDto.admin_id, resetPasswordDto.new_password);
            if (resetPasswordDto.send_email) {
            }
            return {
                msg: result.message,
            };
        }
        catch (err) {
            if (err instanceof common_1.HttpException)
                throw err;
            throw new common_1.InternalServerErrorException(err.message || 'Something went wrong');
        }
    }
};
exports.AdminManagementController = AdminManagementController;
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users (customers)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Users retrieved successfully' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminManagementController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminManagementController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Post)('users/block'),
    (0, swagger_1.ApiOperation)({ summary: 'Block or unblock a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User status updated successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [block_user_dto_1.BlockUserDto, Object]),
    __metadata("design:returntype", Promise)
], AdminManagementController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Get)('sellers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all sellers' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sellers retrieved successfully' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminManagementController.prototype, "getAllSellers", null);
__decorate([
    (0, common_1.Get)('sellers/pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending sellers (not approved)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending sellers retrieved successfully' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminManagementController.prototype, "getPendingSellers", null);
__decorate([
    (0, common_1.Get)('sellers/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get seller by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Seller ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Seller not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminManagementController.prototype, "getSellerById", null);
__decorate([
    (0, common_1.Post)('sellers/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a seller' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller approved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Seller not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [approve_seller_dto_1.ApproveSellerDto, Object]),
    __metadata("design:returntype", Promise)
], AdminManagementController.prototype, "approveSeller", null);
__decorate([
    (0, common_1.Post)('sellers/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a seller' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller rejected successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Seller not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [approve_seller_dto_1.ApproveSellerDto, Object]),
    __metadata("design:returntype", Promise)
], AdminManagementController.prototype, "rejectSeller", null);
__decorate([
    (0, common_1.Get)('admins'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all admins' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admins retrieved successfully' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AdminManagementController.prototype, "getAllAdmins", null);
__decorate([
    (0, common_1.Get)('admins/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Admin ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Admin not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminManagementController.prototype, "getAdminById", null);
__decorate([
    (0, common_1.Post)('admins/create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new admin (email and phone marked as verified, no OTP needed)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Admin created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email or phone already exists' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto, Object]),
    __metadata("design:returntype", Promise)
], AdminManagementController.prototype, "createAdmin", null);
__decorate([
    (0, common_1.Post)('admins/update/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update admin details' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Admin ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Admin not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_admin_dto_1.UpdateAdminDto]),
    __metadata("design:returntype", Promise)
], AdminManagementController.prototype, "updateAdmin", null);
__decorate([
    (0, common_1.Post)('admins/reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset admin password' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin password reset successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Admin not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_admin_password_dto_1.ResetAdminPasswordDto]),
    __metadata("design:returntype", Promise)
], AdminManagementController.prototype, "resetAdminPassword", null);
exports.AdminManagementController = AdminManagementController = __decorate([
    (0, swagger_1.ApiTags)('Admin Management'),
    (0, common_1.Controller)('admin/management'),
    (0, common_1.UseInterceptors)(response_interceptor_1.ResponseInterceptor),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [admin_management_service_1.AdminManagementService])
], AdminManagementController);
//# sourceMappingURL=admin-management.controller.js.map
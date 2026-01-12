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
exports.AdminAuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_auth_service_1 = require("./admin-auth.service");
const login_dto_1 = require("./dto/login.dto");
const refresh_token_dto_1 = require("../customer-auth/dto/refresh-token.dto");
const response_interceptor_1 = require("../utils/interceptor/response.interceptor");
const admin_guard_1 = require("../utils/guards/admin.guard");
let AdminAuthController = class AdminAuthController {
    adminAuthService;
    constructor(adminAuthService) {
        this.adminAuthService = adminAuthService;
    }
    async login(loginDto, req) {
        try {
            const deviceId = req.headers['x-device-id'];
            const ipAddress = req.ip || req.connection.remoteAddress;
            const userAgent = req.headers['user-agent'];
            const result = await this.adminAuthService.login(loginDto, deviceId, ipAddress, userAgent);
            return {
                msg: 'Login successful',
                data: result,
            };
        }
        catch (err) {
            if (err instanceof common_1.HttpException)
                throw err;
            throw new common_1.InternalServerErrorException(err.message || 'Something went wrong');
        }
    }
    async refreshToken(refreshTokenDto) {
        try {
            const result = await this.adminAuthService.refreshToken(refreshTokenDto.refresh_token);
            return {
                msg: 'Token refreshed successfully',
                data: result,
            };
        }
        catch (err) {
            if (err instanceof common_1.HttpException)
                throw err;
            throw new common_1.InternalServerErrorException(err.message || 'Something went wrong');
        }
    }
    async logout(refreshTokenDto) {
        try {
            const result = await this.adminAuthService.logout(refreshTokenDto.refresh_token);
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
    async getMe(req) {
        try {
            return {
                msg: 'Admin information retrieved successfully',
                data: req.user,
            };
        }
        catch (err) {
            if (err instanceof common_1.HttpException)
                throw err;
            throw new common_1.InternalServerErrorException(err.message || 'Something went wrong');
        }
    }
};
exports.AdminAuthController = AdminAuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login as admin' }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.AdminLoginDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.AdminLoginDto, Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' }),
    (0, swagger_1.ApiBody)({ type: refresh_token_dto_1.RefreshTokenDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token refreshed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid refresh token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Logout admin' }),
    (0, swagger_1.ApiBody)({ type: refresh_token_dto_1.RefreshTokenDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logged out successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current admin information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin information retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "getMe", null);
exports.AdminAuthController = AdminAuthController = __decorate([
    (0, swagger_1.ApiTags)('Admin Auth'),
    (0, common_1.Controller)('admin/auth'),
    (0, common_1.UseInterceptors)(response_interceptor_1.ResponseInterceptor),
    __metadata("design:paramtypes", [admin_auth_service_1.AdminAuthService])
], AdminAuthController);
//# sourceMappingURL=admin-auth.controller.js.map
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
exports.CustomerAuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customer_auth_service_1 = require("./customer-auth.service");
const send_otp_dto_1 = require("./dto/send-otp.dto");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const response_interceptor_1 = require("../utils/interceptor/response.interceptor");
const customer_guard_1 = require("../utils/guards/customer.guard");
const otp_entity_1 = require("../otp/otp.entity");
let CustomerAuthController = class CustomerAuthController {
    customerAuthService;
    constructor(customerAuthService) {
        this.customerAuthService = customerAuthService;
    }
    async sendOtp(sendOtpDto) {
        try {
            if (sendOtpDto.purpose === otp_entity_1.OtpPurpose.REGISTRATION) {
                const phone = sendOtpDto.phone_number || (sendOtpDto.identifier && sendOtpDto.type === otp_entity_1.OtpType.MOBILE ? sendOtpDto.identifier : null);
                if (!phone) {
                    throw new common_1.BadRequestException('Phone number is required for registration');
                }
                const result = await this.customerAuthService.sendRegistrationOtp(phone, sendOtpDto.purpose);
                return {
                    msg: result.message,
                };
            }
            const email = sendOtpDto.email || (sendOtpDto.identifier && sendOtpDto.type === otp_entity_1.OtpType.EMAIL ? sendOtpDto.identifier : null);
            const phone = sendOtpDto.phone_number || (sendOtpDto.identifier && sendOtpDto.type === otp_entity_1.OtpType.MOBILE ? sendOtpDto.identifier : null);
            const result = await this.customerAuthService.sendPasswordResetOtp(email, phone, sendOtpDto.purpose);
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
    async register(registerDto, req) {
        try {
            const deviceId = req.headers['x-device-id'];
            const ipAddress = req.ip || req.connection.remoteAddress;
            const userAgent = req.headers['user-agent'];
            const result = await this.customerAuthService.register(registerDto, deviceId, ipAddress, userAgent);
            return {
                msg: 'Customer registered successfully',
                data: result,
            };
        }
        catch (err) {
            if (err instanceof common_1.HttpException)
                throw err;
            throw new common_1.InternalServerErrorException(err.message || 'Something went wrong');
        }
    }
    async login(loginDto, req) {
        try {
            const deviceId = req.headers['x-device-id'];
            const ipAddress = req.ip || req.connection.remoteAddress;
            const userAgent = req.headers['user-agent'];
            const result = await this.customerAuthService.login(loginDto, deviceId, ipAddress, userAgent);
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
            const result = await this.customerAuthService.refreshToken(refreshTokenDto.refresh_token);
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
            const result = await this.customerAuthService.logout(refreshTokenDto.refresh_token);
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
    async forgotPassword(forgotPasswordDto) {
        try {
            const email = forgotPasswordDto.type === otp_entity_1.OtpType.EMAIL ? forgotPasswordDto.identifier : null;
            const phone = forgotPasswordDto.type === otp_entity_1.OtpType.MOBILE ? forgotPasswordDto.identifier : null;
            const result = await this.customerAuthService.sendPasswordResetOtp(email, phone, otp_entity_1.OtpPurpose.PASSWORD_RESET);
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
    async resetPassword(resetPasswordDto) {
        try {
            const email = resetPasswordDto.type === otp_entity_1.OtpType.EMAIL ? resetPasswordDto.identifier : null;
            const phone = resetPasswordDto.type === otp_entity_1.OtpType.MOBILE ? resetPasswordDto.identifier : null;
            const result = await this.customerAuthService.resetPassword(email, phone, resetPasswordDto.otp_code, resetPasswordDto.new_password);
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
                msg: 'Customer information retrieved successfully',
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
exports.CustomerAuthController = CustomerAuthController;
__decorate([
    (0, common_1.Post)('send-otp'),
    (0, swagger_1.ApiOperation)({ summary: 'Send OTP for registration (phone only) or password reset' }),
    (0, swagger_1.ApiBody)({ type: send_otp_dto_1.SendOtpDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OTP sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_otp_dto_1.SendOtpDto]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "sendOtp", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new customer with phone number and OTP verification (email will be added later)' }),
    (0, swagger_1.ApiBody)({ type: register_dto_1.CustomerRegisterDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Customer registered successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid OTP' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User already exists' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.CustomerRegisterDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login as customer' }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.CustomerLoginDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.CustomerLoginDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "login", null);
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
], CustomerAuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(customer_guard_1.CustomerGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Logout customer' }),
    (0, swagger_1.ApiBody)({ type: refresh_token_dto_1.RefreshTokenDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logged out successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Send OTP for password reset (same OTP sent to both email and phone if user has both)' }),
    (0, swagger_1.ApiBody)({ type: forgot_password_dto_1.ForgotPasswordDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OTP sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password with OTP (can use OTP from either email or phone)' }),
    (0, swagger_1.ApiBody)({ type: reset_password_dto_1.ResetPasswordDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password reset successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid OTP' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(customer_guard_1.CustomerGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current customer information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer information retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "getMe", null);
exports.CustomerAuthController = CustomerAuthController = __decorate([
    (0, swagger_1.ApiTags)('Customer Auth'),
    (0, common_1.Controller)('customer/auth'),
    (0, common_1.UseInterceptors)(response_interceptor_1.ResponseInterceptor),
    __metadata("design:paramtypes", [customer_auth_service_1.CustomerAuthService])
], CustomerAuthController);
//# sourceMappingURL=customer-auth.controller.js.map
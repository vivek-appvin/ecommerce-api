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
exports.SendOtpDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const otp_entity_1 = require("../../otp/otp.entity");
class SendOtpDto {
    email;
    phone_number;
    purpose;
    identifier;
    type;
}
exports.SendOtpDto = SendOtpDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email address (optional, at least one of email or phone is required)',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.ValidateIf)((o) => !o.phone_number),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendOtpDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Phone number (optional, at least one of email or phone is required)',
        example: '+1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.ValidateIf)((o) => !o.email),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendOtpDto.prototype, "phone_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Purpose of OTP',
        enum: otp_entity_1.OtpPurpose,
        example: otp_entity_1.OtpPurpose.REGISTRATION,
    }),
    (0, class_validator_1.IsEnum)(otp_entity_1.OtpPurpose),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendOtpDto.prototype, "purpose", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email address or phone number (legacy, use email/phone_number instead)',
        example: 'user@example.com or +1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendOtpDto.prototype, "identifier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of OTP (EMAIL or MOBILE) - legacy, used only with identifier',
        enum: otp_entity_1.OtpType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(otp_entity_1.OtpType),
    __metadata("design:type", String)
], SendOtpDto.prototype, "type", void 0);
//# sourceMappingURL=send-otp.dto.js.map
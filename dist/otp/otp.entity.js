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
exports.OtpEntity = exports.OtpPurpose = exports.OtpType = void 0;
const typeorm_1 = require("typeorm");
var OtpType;
(function (OtpType) {
    OtpType["EMAIL"] = "EMAIL";
    OtpType["MOBILE"] = "MOBILE";
})(OtpType || (exports.OtpType = OtpType = {}));
var OtpPurpose;
(function (OtpPurpose) {
    OtpPurpose["REGISTRATION"] = "REGISTRATION";
    OtpPurpose["LOGIN"] = "LOGIN";
    OtpPurpose["PASSWORD_RESET"] = "PASSWORD_RESET";
})(OtpPurpose || (exports.OtpPurpose = OtpPurpose = {}));
let OtpEntity = class OtpEntity {
    id;
    identifier;
    type;
    purpose;
    code;
    is_used;
    is_verified;
    expires_at;
    created_at;
};
exports.OtpEntity = OtpEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OtpEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], OtpEntity.prototype, "identifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: OtpType }),
    __metadata("design:type", String)
], OtpEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: OtpPurpose }),
    __metadata("design:type", String)
], OtpEntity.prototype, "purpose", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 6 }),
    __metadata("design:type", String)
], OtpEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], OtpEntity.prototype, "is_used", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], OtpEntity.prototype, "is_verified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], OtpEntity.prototype, "expires_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OtpEntity.prototype, "created_at", void 0);
exports.OtpEntity = OtpEntity = __decorate([
    (0, typeorm_1.Entity)('otps'),
    (0, typeorm_1.Index)(['identifier', 'type', 'purpose', 'is_used'], { unique: false })
], OtpEntity);
//# sourceMappingURL=otp.entity.js.map
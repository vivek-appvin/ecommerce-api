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
exports.SellerKycEntity = exports.SellerKycStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
var SellerKycStatus;
(function (SellerKycStatus) {
    SellerKycStatus["PENDING"] = "PENDING";
    SellerKycStatus["APPROVED"] = "APPROVED";
    SellerKycStatus["REJECTED"] = "REJECTED";
})(SellerKycStatus || (exports.SellerKycStatus = SellerKycStatus = {}));
let SellerKycEntity = class SellerKycEntity extends typeorm_1.BaseEntity {
    id;
    user_id;
    user;
    business_name;
    pan_number;
    gst_number;
    bank_account;
    ifsc_code;
    address;
    status;
    submitted_at;
    verified_at;
    updated_at;
};
exports.SellerKycEntity = SellerKycEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SellerKycEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SellerKycEntity.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], SellerKycEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SellerKycEntity.prototype, "business_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SellerKycEntity.prototype, "pan_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SellerKycEntity.prototype, "gst_number", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SellerKycEntity.prototype, "bank_account", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SellerKycEntity.prototype, "ifsc_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], SellerKycEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SellerKycStatus,
    }),
    __metadata("design:type", String)
], SellerKycEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], SellerKycEntity.prototype, "submitted_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], SellerKycEntity.prototype, "verified_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], SellerKycEntity.prototype, "updated_at", void 0);
exports.SellerKycEntity = SellerKycEntity = __decorate([
    (0, typeorm_1.Entity)('seller_kyc')
], SellerKycEntity);
//# sourceMappingURL=seller-kyc.entity.js.map
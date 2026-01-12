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
exports.KycEntity = exports.KycStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
var KycStatus;
(function (KycStatus) {
    KycStatus["PENDING"] = "PENDING";
    KycStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    KycStatus["APPROVED"] = "APPROVED";
    KycStatus["REJECTED"] = "REJECTED";
})(KycStatus || (exports.KycStatus = KycStatus = {}));
let KycEntity = class KycEntity {
    id;
    user_id;
    user;
    pan_number;
    pan_document;
    is_pan_verified;
    gst_number;
    gst_document;
    is_gst_verified;
    bank_account_number;
    bank_ifsc;
    bank_name;
    bank_account_holder_name;
    bank_document;
    is_bank_verified;
    business_name;
    business_type;
    business_address;
    status;
    rejection_reason;
    verified_by;
    verified_at;
    created_at;
    updated_at;
};
exports.KycEntity = KycEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], KycEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', unique: true, name: 'user_id' }),
    __metadata("design:type", String)
], KycEntity.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], KycEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], KycEntity.prototype, "pan_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], KycEntity.prototype, "pan_document", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], KycEntity.prototype, "is_pan_verified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], KycEntity.prototype, "gst_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], KycEntity.prototype, "gst_document", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], KycEntity.prototype, "is_gst_verified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], KycEntity.prototype, "bank_account_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], KycEntity.prototype, "bank_ifsc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], KycEntity.prototype, "bank_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], KycEntity.prototype, "bank_account_holder_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], KycEntity.prototype, "bank_document", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], KycEntity.prototype, "is_bank_verified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], KycEntity.prototype, "business_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], KycEntity.prototype, "business_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], KycEntity.prototype, "business_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: KycStatus, default: KycStatus.PENDING }),
    __metadata("design:type", String)
], KycEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], KycEntity.prototype, "rejection_reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'verified_by' }),
    __metadata("design:type", Object)
], KycEntity.prototype, "verified_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], KycEntity.prototype, "verified_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], KycEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], KycEntity.prototype, "updated_at", void 0);
exports.KycEntity = KycEntity = __decorate([
    (0, typeorm_1.Entity)('kyc_documents')
], KycEntity);
//# sourceMappingURL=kyc.entity.js.map
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
exports.AddressEntity = exports.AddressType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
var AddressType;
(function (AddressType) {
    AddressType["HOME"] = "HOME";
    AddressType["WORK"] = "WORK";
    AddressType["OTHER"] = "OTHER";
})(AddressType || (exports.AddressType = AddressType = {}));
let AddressEntity = class AddressEntity {
    id;
    user_id;
    user;
    full_name;
    phone_number;
    address_line1;
    address_line2;
    city;
    state;
    postal_code;
    country;
    address_type;
    is_default;
    is_active;
    created_at;
    updated_at;
};
exports.AddressEntity = AddressEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AddressEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], AddressEntity.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], AddressEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], AddressEntity.prototype, "full_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], AddressEntity.prototype, "phone_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], AddressEntity.prototype, "address_line1", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], AddressEntity.prototype, "address_line2", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], AddressEntity.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], AddressEntity.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], AddressEntity.prototype, "postal_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], AddressEntity.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AddressType, default: AddressType.HOME }),
    __metadata("design:type", String)
], AddressEntity.prototype, "address_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AddressEntity.prototype, "is_default", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], AddressEntity.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AddressEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AddressEntity.prototype, "updated_at", void 0);
exports.AddressEntity = AddressEntity = __decorate([
    (0, typeorm_1.Entity)('addresses')
], AddressEntity);
//# sourceMappingURL=address.entity.js.map
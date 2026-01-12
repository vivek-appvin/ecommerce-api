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
exports.RefreshTokenEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
let RefreshTokenEntity = class RefreshTokenEntity {
    id;
    user_id;
    user;
    token;
    device_id;
    ip_address;
    user_agent;
    is_active;
    expires_at;
    created_at;
};
exports.RefreshTokenEntity = RefreshTokenEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RefreshTokenEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], RefreshTokenEntity.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], RefreshTokenEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', unique: true }),
    __metadata("design:type", String)
], RefreshTokenEntity.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], RefreshTokenEntity.prototype, "device_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], RefreshTokenEntity.prototype, "ip_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], RefreshTokenEntity.prototype, "user_agent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], RefreshTokenEntity.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], RefreshTokenEntity.prototype, "expires_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RefreshTokenEntity.prototype, "created_at", void 0);
exports.RefreshTokenEntity = RefreshTokenEntity = __decorate([
    (0, typeorm_1.Entity)('refresh_tokens'),
    (0, typeorm_1.Index)(['token'], { unique: true }),
    (0, typeorm_1.Index)(['user_id'])
], RefreshTokenEntity);
//# sourceMappingURL=refresh-token.entity.js.map
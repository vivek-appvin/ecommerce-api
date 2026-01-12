"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminManagementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_management_controller_1 = require("./admin-management.controller");
const admin_management_service_1 = require("./admin-management.service");
const user_entity_1 = require("../users/user.entity");
const role_entity_1 = require("../roles/role.entity");
const kyc_entity_1 = require("../kyc/kyc.entity");
let AdminManagementModule = class AdminManagementModule {
};
exports.AdminManagementModule = AdminManagementModule;
exports.AdminManagementModule = AdminManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, role_entity_1.RoleEntity, kyc_entity_1.KycEntity])],
        controllers: [admin_management_controller_1.AdminManagementController],
        providers: [admin_management_service_1.AdminManagementService],
        exports: [admin_management_service_1.AdminManagementService],
    })
], AdminManagementModule);
//# sourceMappingURL=admin-management.module.js.map
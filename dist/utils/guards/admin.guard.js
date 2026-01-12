"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const rxjs_1 = require("rxjs");
const rxjs_2 = require("rxjs");
const role_entity_1 = require("../../roles/role.entity");
let AdminGuard = class AdminGuard extends (0, passport_1.AuthGuard)('jwt') {
    async canActivate(context) {
        const result = super.canActivate(context);
        let isAuthenticated;
        if (result instanceof rxjs_1.Observable) {
            isAuthenticated = await (0, rxjs_2.firstValueFrom)(result);
        }
        else if (result instanceof Promise) {
            isAuthenticated = await result;
        }
        else {
            isAuthenticated = result;
        }
        if (!isAuthenticated)
            return false;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return user && user.role === role_entity_1.RoleName.ADMIN;
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)()
], AdminGuard);
//# sourceMappingURL=admin.guard.js.map
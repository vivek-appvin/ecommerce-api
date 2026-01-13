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
exports.SellerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const seller_service_1 = require("./seller.service");
const create_seller_dto_1 = require("./dto/create-seller.dto");
const update_seller_dto_1 = require("./dto/update-seller.dto");
let SellerController = class SellerController {
    sellerService;
    constructor(sellerService) {
        this.sellerService = sellerService;
    }
    create(createSellerDto) {
        return this.sellerService.create(createSellerDto);
    }
    findAll() {
        return this.sellerService.findAll();
    }
    findOne(id) {
        return this.sellerService.findOne(+id);
    }
    update(id, updateSellerDto) {
        return this.sellerService.update(+id, updateSellerDto);
    }
    remove(id) {
        return this.sellerService.remove(+id);
    }
};
exports.SellerController = SellerController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new seller' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Seller created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_seller_dto_1.CreateSellerDto]),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all sellers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all sellers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a seller by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Seller not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a seller' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Seller not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_seller_dto_1.UpdateSellerDto]),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a seller' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller soft deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Seller not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SellerController.prototype, "remove", null);
exports.SellerController = SellerController = __decorate([
    (0, swagger_1.ApiTags)('Sellers'),
    (0, common_1.Controller)('seller'),
    __metadata("design:paramtypes", [seller_service_1.SellerService])
], SellerController);
//# sourceMappingURL=seller.controller.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
let ProductsService = class ProductsService {
    products = [
        {
            id: 1,
            name: 'Laptop',
            description: 'High-performance laptop for work and gaming',
            price: 999.99,
            stock: 10,
            category: 'Electronics',
        },
        {
            id: 2,
            name: 'Smartphone',
            description: 'Latest model smartphone with advanced features',
            price: 699.99,
            stock: 25,
            category: 'Electronics',
        },
        {
            id: 3,
            name: 'Headphones',
            description: 'Wireless noise-cancelling headphones',
            price: 199.99,
            stock: 50,
            category: 'Audio',
        },
    ];
    findAll() {
        return this.products;
    }
    findOne(id) {
        return this.products.find((product) => product.id === id);
    }
    create(product) {
        const newProduct = {
            id: this.products.length + 1,
            ...product,
        };
        this.products.push(newProduct);
        return newProduct;
    }
    update(id, updateData) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            return undefined;
        }
        this.products[productIndex] = {
            ...this.products[productIndex],
            ...updateData,
        };
        return this.products[productIndex];
    }
    remove(id) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            return false;
        }
        this.products.splice(productIndex, 1);
        return true;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)()
], ProductsService);
//# sourceMappingURL=products.service.js.map
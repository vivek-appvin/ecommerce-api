import { ProductsService } from './products.service';
import type { Product } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): Product[];
    findOne(id: number): Product | undefined;
    create(createProductDto: Omit<Product, 'id'>): Product;
    update(id: number, updateProductDto: Partial<Product>): Product | undefined;
    remove(id: number): {
        success: boolean;
    };
}

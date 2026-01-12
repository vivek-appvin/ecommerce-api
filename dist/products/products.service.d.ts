export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
}
export declare class ProductsService {
    private products;
    findAll(): Product[];
    findOne(id: number): Product | undefined;
    create(product: Omit<Product, 'id'>): Product;
    update(id: number, updateData: Partial<Product>): Product | undefined;
    remove(id: number): boolean;
}

import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
export declare class SellerService {
    create(createSellerDto: CreateSellerDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateSellerDto: UpdateSellerDto): string;
    remove(id: number): string;
}

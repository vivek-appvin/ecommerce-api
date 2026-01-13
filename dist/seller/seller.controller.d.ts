import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
export declare class SellerController {
    private readonly sellerService;
    constructor(sellerService: SellerService);
    create(createSellerDto: CreateSellerDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateSellerDto: UpdateSellerDto): string;
    remove(id: string): string;
}

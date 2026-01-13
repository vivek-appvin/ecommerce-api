import { BaseEntity } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
export declare enum SellerKycStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare class SellerKycEntity extends BaseEntity {
    id: string;
    user_id: string;
    user: UserEntity;
    business_name: string;
    pan_number: string;
    gst_number: string;
    bank_account: string;
    ifsc_code: string;
    address: string;
    status: SellerKycStatus;
    submitted_at: Date;
    verified_at: Date;
    is_deleted: boolean;
    updated_at: Date;
}

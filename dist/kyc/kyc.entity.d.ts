import { UserEntity } from '../users/user.entity';
export declare enum KycStatus {
    PENDING = "PENDING",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare class KycEntity {
    id: string;
    user_id: string;
    user: UserEntity;
    pan_number: string | null;
    pan_document: string | null;
    is_pan_verified: boolean;
    gst_number: string | null;
    gst_document: string | null;
    is_gst_verified: boolean;
    bank_account_number: string | null;
    bank_ifsc: string | null;
    bank_name: string | null;
    bank_account_holder_name: string | null;
    bank_document: string | null;
    is_bank_verified: boolean;
    business_name: string | null;
    business_type: string | null;
    business_address: string | null;
    status: KycStatus;
    rejection_reason: string | null;
    verified_by: string | null;
    verified_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

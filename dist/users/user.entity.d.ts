import { RoleEntity } from '../roles/role.entity';
export declare class UserEntity {
    id: string;
    email: string | null;
    phone_number: string;
    password: string;
    role_id: string;
    role: RoleEntity;
    is_active: boolean;
    is_phone_verified: boolean;
    is_email_verified: boolean;
    is_seller_approved: boolean;
    seller_approved_at: Date | null;
    approved_by: string | null;
    is_kyc_verified: boolean;
    first_name: string | null;
    last_name: string | null;
    profile_picture: string | null;
    created_at: Date;
    updated_at: Date;
}

import { UserEntity } from '../users/user.entity';
export declare enum AddressType {
    HOME = "HOME",
    WORK = "WORK",
    OTHER = "OTHER"
}
export declare class AddressEntity {
    id: string;
    user_id: string;
    user: UserEntity;
    full_name: string;
    phone_number: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    address_type: AddressType;
    is_default: boolean;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

import { BaseEntity } from 'typeorm';
import { RoleEntity } from '../../roles/role.entity';
export declare enum UserStatus {
    ACTIVE = "ACTIVE",
    PENDING = "PENDING",
    BLOCKED = "BLOCKED"
}
export declare class UserEntity extends BaseEntity {
    id: string;
    full_name: string;
    email: string;
    phone_number: string;
    password: string;
    role_id: string;
    role: RoleEntity;
    status: UserStatus;
    is_phone_verified: boolean;
    is_email_verified: boolean;
    last_login_at: Date;
    is_deleted: boolean;
    created_at: Date;
    updated_at: Date;
}

import { BaseEntity } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
export declare class RefreshTokenEntity extends BaseEntity {
    id: string;
    user_id: string;
    user: UserEntity;
    token_hash: string;
    expires_at: Date;
    is_deleted: boolean;
    created_at: Date;
    updated_at: Date;
}

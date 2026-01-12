import { UserEntity } from '../users/user.entity';
export declare class RefreshTokenEntity {
    id: string;
    user_id: string;
    user: UserEntity;
    token: string;
    device_id: string | null;
    ip_address: string | null;
    user_agent: string | null;
    is_active: boolean;
    expires_at: Date;
    created_at: Date;
}

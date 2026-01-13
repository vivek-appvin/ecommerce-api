import { BaseEntity } from 'typeorm';
export declare class RoleEntity extends BaseEntity {
    id: string;
    name: string;
    is_deleted: boolean;
    created_at: Date;
}

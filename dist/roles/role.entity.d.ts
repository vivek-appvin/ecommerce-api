export declare enum RoleName {
    USER = "USER",
    SELLER = "SELLER",
    ADMIN = "ADMIN"
}
export declare class RoleEntity {
    id: string;
    name: RoleName;
    created_at: Date;
    updated_at: Date;
}

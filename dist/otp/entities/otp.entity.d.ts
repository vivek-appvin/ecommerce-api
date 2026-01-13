import { BaseEntity } from 'typeorm';
export declare enum OtpPurpose {
    LOGIN = "LOGIN",
    REGISTER = "REGISTER",
    VERIFY = "VERIFY"
}
export declare class OtpEntity extends BaseEntity {
    id: string;
    identifier: string;
    otp: string;
    purpose: OtpPurpose;
    expires_at: Date;
    is_used: boolean;
    created_at: Date;
    updated_at: Date;
}

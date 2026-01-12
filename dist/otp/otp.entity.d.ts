export declare enum OtpType {
    EMAIL = "EMAIL",
    MOBILE = "MOBILE"
}
export declare enum OtpPurpose {
    REGISTRATION = "REGISTRATION",
    LOGIN = "LOGIN",
    PASSWORD_RESET = "PASSWORD_RESET"
}
export declare class OtpEntity {
    id: string;
    identifier: string;
    type: OtpType;
    purpose: OtpPurpose;
    code: string;
    is_used: boolean;
    is_verified: boolean;
    expires_at: Date;
    created_at: Date;
}

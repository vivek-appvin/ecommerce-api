import { OtpType, OtpPurpose } from '../../otp/otp.entity';
export declare class VerifyOtpDto {
    identifier: string;
    code: string;
    type: OtpType;
    purpose: OtpPurpose;
}

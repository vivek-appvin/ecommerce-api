import { OtpType, OtpPurpose } from '../../otp/otp.entity';
export declare class SendOtpDto {
    email?: string;
    phone_number?: string;
    purpose: OtpPurpose;
    identifier?: string;
    type?: OtpType;
}

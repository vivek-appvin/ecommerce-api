import { OtpType } from '../../otp/otp.entity';
export declare class ResetPasswordDto {
    identifier: string;
    type: OtpType;
    otp_code: string;
    new_password: string;
}

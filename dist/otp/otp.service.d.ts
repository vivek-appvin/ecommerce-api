import { Repository } from 'typeorm';
import { OtpEntity, OtpType, OtpPurpose } from './otp.entity';
export declare class OtpService {
    private otpRepository;
    private readonly OTP_EXPIRY_MINUTES;
    private readonly OTP_LENGTH;
    private readonly MAX_OTP_ATTEMPTS;
    constructor(otpRepository: Repository<OtpEntity>);
    private generateOtpCode;
    private checkOtpRateLimit;
    private invalidatePreviousOtps;
    generateOtp(identifier: string, type: OtpType, purpose: OtpPurpose): Promise<string>;
    generateOtpForMultiple(email: string | null, phone: string | null, purpose: OtpPurpose): Promise<string>;
    verifyOtp(identifier: string, code: string, type: OtpType, purpose: OtpPurpose): Promise<boolean>;
    verifyOtpFromEither(email: string | null, phone: string | null, code: string, purpose: OtpPurpose): Promise<boolean>;
    resendOtp(identifier: string, type: OtpType, purpose: OtpPurpose): Promise<string>;
    cleanupExpiredOtps(): Promise<void>;
}

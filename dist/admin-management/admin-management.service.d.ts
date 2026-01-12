import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { RoleEntity } from '../roles/role.entity';
import { KycEntity, KycStatus } from '../kyc/kyc.entity';
export declare class AdminManagementService {
    private userRepository;
    private roleRepository;
    private kycRepository;
    constructor(userRepository: Repository<UserEntity>, roleRepository: Repository<RoleEntity>, kycRepository: Repository<KycEntity>);
    getAllUsers(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            phone_number: string;
            email: string | null;
            first_name: string | null;
            last_name: string | null;
            is_active: boolean;
            is_phone_verified: boolean;
            is_email_verified: boolean;
            created_at: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUserById(userId: string): Promise<{
        id: string;
        phone_number: string;
        email: string | null;
        first_name: string | null;
        last_name: string | null;
        is_active: boolean;
        is_phone_verified: boolean;
        is_email_verified: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    blockUser(userId: string, isBlocked: boolean, adminId: string): Promise<{
        message: string;
        user: {
            id: string;
            phone_number: string;
            email: string | null;
            is_active: boolean;
        };
    }>;
    getAllSellers(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            phone_number: string;
            email: string | null;
            first_name: string | null;
            last_name: string | null;
            is_active: boolean;
            is_seller_approved: boolean;
            seller_approved_at: Date | null;
            is_kyc_verified: boolean;
            created_at: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getSellerById(sellerId: string): Promise<{
        id: string;
        phone_number: string;
        email: string | null;
        first_name: string | null;
        last_name: string | null;
        is_active: boolean;
        is_seller_approved: boolean;
        seller_approved_at: Date | null;
        is_kyc_verified: boolean;
        kyc: {
            status: KycStatus;
            is_pan_verified: boolean;
            is_gst_verified: boolean;
            is_bank_verified: boolean;
        } | null;
        created_at: Date;
        updated_at: Date;
    }>;
    approveSeller(sellerId: string, adminId: string): Promise<{
        message: string;
        seller: {
            id: string;
            email: string | null;
            is_seller_approved: boolean;
            seller_approved_at: Date;
        };
    }>;
    rejectSeller(sellerId: string, adminId: string, reason?: string): Promise<{
        message: string;
        seller: {
            id: string;
            email: string | null;
            is_seller_approved: boolean;
        };
    }>;
    getPendingSellers(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            phone_number: string;
            email: string | null;
            first_name: string | null;
            last_name: string | null;
            created_at: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAllAdmins(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            phone_number: string;
            email: string | null;
            first_name: string | null;
            last_name: string | null;
            is_active: boolean;
            is_phone_verified: boolean;
            is_email_verified: boolean;
            created_at: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAdminById(adminId: string): Promise<{
        id: string;
        phone_number: string;
        email: string | null;
        first_name: string | null;
        last_name: string | null;
        is_active: boolean;
        is_phone_verified: boolean;
        is_email_verified: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    createAdmin(createAdminDto: any, createdByAdminId: string): Promise<{
        admin: any;
        credentials: {
            email: string;
            password: string;
        };
    }>;
    updateAdmin(adminId: string, updateAdminDto: any): Promise<{
        admin: any;
    }>;
    resetAdminPassword(adminId: string, newPassword: string): Promise<{
        message: string;
    }>;
    sendCredentialsEmail(email: string, password: string, firstName: string, lastName: string): Promise<void>;
}

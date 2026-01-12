import { AdminManagementService } from './admin-management.service';
import { ApproveSellerDto } from './dto/approve-seller.dto';
import { BlockUserDto } from './dto/block-user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ResetAdminPasswordDto } from './dto/reset-admin-password.dto';
export declare class AdminManagementController {
    private readonly adminManagementService;
    constructor(adminManagementService: AdminManagementService);
    getAllUsers(page?: number, limit?: number): Promise<{
        msg: string;
        data: {
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
        };
    }>;
    getUserById(userId: string): Promise<{
        msg: string;
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
            updated_at: Date;
        };
    }>;
    blockUser(blockUserDto: BlockUserDto, req: any): Promise<{
        msg: string;
        data: {
            id: string;
            phone_number: string;
            email: string | null;
            is_active: boolean;
        };
    }>;
    getAllSellers(page?: number, limit?: number): Promise<{
        msg: string;
        data: {
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
        };
    }>;
    getPendingSellers(page?: number, limit?: number): Promise<{
        msg: string;
        data: {
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
        };
    }>;
    getSellerById(sellerId: string): Promise<{
        msg: string;
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
            kyc: {
                status: import("../kyc/kyc.entity").KycStatus;
                is_pan_verified: boolean;
                is_gst_verified: boolean;
                is_bank_verified: boolean;
            } | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    approveSeller(approveSellerDto: ApproveSellerDto, req: any): Promise<{
        msg: string;
        data: {
            id: string;
            email: string | null;
            is_seller_approved: boolean;
            seller_approved_at: Date;
        };
    }>;
    rejectSeller(approveSellerDto: ApproveSellerDto, req: any): Promise<{
        msg: string;
        data: {
            id: string;
            email: string | null;
            is_seller_approved: boolean;
        };
    }>;
    getAllAdmins(page?: number, limit?: number): Promise<{
        msg: string;
        data: {
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
        };
    }>;
    getAdminById(adminId: string): Promise<{
        msg: string;
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
            updated_at: Date;
        };
    }>;
    createAdmin(createAdminDto: CreateAdminDto, req: any): Promise<{
        msg: string;
        data: any;
    }>;
    updateAdmin(adminId: string, updateAdminDto: UpdateAdminDto): Promise<{
        msg: string;
        data: any;
    }>;
    resetAdminPassword(resetPasswordDto: ResetAdminPasswordDto): Promise<{
        msg: string;
    }>;
}

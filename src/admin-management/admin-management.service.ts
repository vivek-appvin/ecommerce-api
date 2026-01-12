import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/user.entity';
import { RoleEntity, RoleName } from '../roles/role.entity';
import { KycEntity, KycStatus } from '../kyc/kyc.entity';

@Injectable()
export class AdminManagementService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(KycEntity)
    private kycRepository: Repository<KycEntity>,
  ) {}

  /**
   * Get all users (customers)
   */
  async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await this.userRepository.findAndCount({
      where: {
        role: { name: RoleName.USER },
      },
      relations: ['role'],
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data: users.map((user) => ({
        id: user.id,
        phone_number: user.phone_number,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        is_active: user.is_active,
        is_phone_verified: user.is_phone_verified,
        is_email_verified: user.is_email_verified,
        created_at: user.created_at,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      phone_number: user.phone_number,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_active: user.is_active,
      is_phone_verified: user.is_phone_verified,
      is_email_verified: user.is_email_verified,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  /**
   * Block/Unblock user
   */
  async blockUser(userId: string, isBlocked: boolean, adminId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.is_active = !isBlocked;
    await this.userRepository.save(user);

    return {
      message: isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
      user: {
        id: user.id,
        phone_number: user.phone_number,
        email: user.email,
        is_active: user.is_active,
      },
    };
  }

  /**
   * Get all sellers
   */
  async getAllSellers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [sellers, total] = await this.userRepository.findAndCount({
      where: {
        role: { name: RoleName.SELLER },
      },
      relations: ['role'],
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data: sellers.map((seller) => ({
        id: seller.id,
        phone_number: seller.phone_number,
        email: seller.email,
        first_name: seller.first_name,
        last_name: seller.last_name,
        is_active: seller.is_active,
        is_seller_approved: seller.is_seller_approved,
        seller_approved_at: seller.seller_approved_at,
        is_kyc_verified: seller.is_kyc_verified,
        created_at: seller.created_at,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get seller by ID
   */
  async getSellerById(sellerId: string) {
    const seller = await this.userRepository.findOne({
      where: { id: sellerId },
      relations: ['role'],
    });

    if (!seller || seller.role.name !== RoleName.SELLER) {
      throw new NotFoundException('Seller not found');
    }

    const kyc = await this.kycRepository.findOne({
      where: { user_id: sellerId },
    });

    return {
      id: seller.id,
      phone_number: seller.phone_number,
      email: seller.email,
      first_name: seller.first_name,
      last_name: seller.last_name,
      is_active: seller.is_active,
      is_seller_approved: seller.is_seller_approved,
      seller_approved_at: seller.seller_approved_at,
      is_kyc_verified: seller.is_kyc_verified,
      kyc: kyc ? {
        status: kyc.status,
        is_pan_verified: kyc.is_pan_verified,
        is_gst_verified: kyc.is_gst_verified,
        is_bank_verified: kyc.is_bank_verified,
      } : null,
      created_at: seller.created_at,
      updated_at: seller.updated_at,
    };
  }

  /**
   * Approve seller
   */
  async approveSeller(sellerId: string, adminId: string) {
    const seller = await this.userRepository.findOne({
      where: { id: sellerId },
      relations: ['role'],
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    if (seller.role.name !== RoleName.SELLER) {
      throw new BadRequestException('User is not a seller');
    }

    if (seller.is_seller_approved) {
      throw new BadRequestException('Seller is already approved');
    }

    seller.is_seller_approved = true;
    seller.seller_approved_at = new Date();
    seller.approved_by = adminId;
    await this.userRepository.save(seller);

    return {
      message: 'Seller approved successfully',
      seller: {
        id: seller.id,
        email: seller.email,
        is_seller_approved: seller.is_seller_approved,
        seller_approved_at: seller.seller_approved_at,
      },
    };
  }

  /**
   * Reject seller
   */
  async rejectSeller(sellerId: string, adminId: string, reason?: string) {
    const seller = await this.userRepository.findOne({
      where: { id: sellerId },
      relations: ['role'],
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    if (seller.role.name !== RoleName.SELLER) {
      throw new BadRequestException('User is not a seller');
    }

    seller.is_seller_approved = false;
    seller.approved_by = adminId;
    await this.userRepository.save(seller);

    return {
      message: 'Seller rejected successfully',
      seller: {
        id: seller.id,
        email: seller.email,
        is_seller_approved: seller.is_seller_approved,
      },
    };
  }

  /**
   * Get pending sellers (not approved)
   */
  async getPendingSellers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [sellers, total] = await this.userRepository.findAndCount({
      where: {
        role: { name: RoleName.SELLER },
        is_seller_approved: false,
      },
      relations: ['role'],
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data: sellers.map((seller) => ({
        id: seller.id,
        phone_number: seller.phone_number,
        email: seller.email,
        first_name: seller.first_name,
        last_name: seller.last_name,
        created_at: seller.created_at,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get all admins
   */
  async getAllAdmins(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [admins, total] = await this.userRepository.findAndCount({
      where: {
        role: { name: RoleName.ADMIN },
      },
      relations: ['role'],
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data: admins.map((admin) => ({
        id: admin.id,
        phone_number: admin.phone_number,
        email: admin.email,
        first_name: admin.first_name,
        last_name: admin.last_name,
        is_active: admin.is_active,
        is_phone_verified: admin.is_phone_verified,
        is_email_verified: admin.is_email_verified,
        created_at: admin.created_at,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get admin by ID
   */
  async getAdminById(adminId: string) {
    const admin = await this.userRepository.findOne({
      where: { id: adminId },
      relations: ['role'],
    });

    if (!admin || admin.role.name !== RoleName.ADMIN) {
      throw new NotFoundException('Admin not found');
    }

    return {
      id: admin.id,
      phone_number: admin.phone_number,
      email: admin.email,
      first_name: admin.first_name,
      last_name: admin.last_name,
      is_active: admin.is_active,
      is_phone_verified: admin.is_phone_verified,
      is_email_verified: admin.is_email_verified,
      created_at: admin.created_at,
      updated_at: admin.updated_at,
    };
  }

  /**
   * Create new admin (by another admin)
   */
  async createAdmin(
    createAdminDto: any,
    createdByAdminId: string,
  ): Promise<{ admin: any; credentials: { email: string; password: string } }> {
    // Check if email already exists
    const existingEmail = await this.userRepository.findOne({
      where: { email: createAdminDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    // Check if phone already exists
    const existingPhone = await this.userRepository.findOne({
      where: { phone_number: createAdminDto.phone_number },
    });

    if (existingPhone) {
      throw new ConflictException('Phone number already registered');
    }

    // Get ADMIN role
    const adminRole = await this.roleRepository.findOne({
      where: { name: RoleName.ADMIN },
    });

    if (!adminRole) {
      throw new Error('ADMIN role not found. Please seed the database.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    // Create admin - mark both email and phone as verified (no OTP needed)
    const admin = this.userRepository.create({
      phone_number: createAdminDto.phone_number,
      email: createAdminDto.email,
      password: hashedPassword,
      role_id: adminRole.id,
      first_name: createAdminDto.first_name,
      last_name: createAdminDto.last_name,
      is_active: true,
      is_phone_verified: true, // Verified by admin, no OTP needed
      is_email_verified: true, // Verified by admin, no OTP needed
    });

    await this.userRepository.save(admin);

    // Return credentials for email sending
    const credentials = {
      email: createAdminDto.email,
      password: createAdminDto.password, // Return plain password for email (only once)
    };

    return {
      admin: {
        id: admin.id,
        email: admin.email,
        phone_number: admin.phone_number,
        first_name: admin.first_name,
        last_name: admin.last_name,
        is_active: admin.is_active,
        is_phone_verified: admin.is_phone_verified,
        is_email_verified: admin.is_email_verified,
      },
      credentials,
    };
  }

  /**
   * Update admin
   */
  async updateAdmin(
    adminId: string,
    updateAdminDto: any,
  ): Promise<{ admin: any }> {
    const admin = await this.userRepository.findOne({
      where: { id: adminId },
      relations: ['role'],
    });

    if (!admin || admin.role.name !== RoleName.ADMIN) {
      throw new NotFoundException('Admin not found');
    }

    // Check email uniqueness if being updated
    if (updateAdminDto.email && updateAdminDto.email !== admin.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: updateAdminDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Email already registered');
      }
    }

    // Check phone uniqueness if being updated
    if (updateAdminDto.phone_number && updateAdminDto.phone_number !== admin.phone_number) {
      const existingPhone = await this.userRepository.findOne({
        where: { phone_number: updateAdminDto.phone_number },
      });

      if (existingPhone) {
        throw new ConflictException('Phone number already registered');
      }
    }

    // Update fields
    if (updateAdminDto.email) admin.email = updateAdminDto.email;
    if (updateAdminDto.phone_number) admin.phone_number = updateAdminDto.phone_number;
    if (updateAdminDto.first_name) admin.first_name = updateAdminDto.first_name;
    if (updateAdminDto.last_name) admin.last_name = updateAdminDto.last_name;
    if (typeof updateAdminDto.is_active === 'boolean') admin.is_active = updateAdminDto.is_active;

    await this.userRepository.save(admin);

    return {
      admin: {
        id: admin.id,
        email: admin.email,
        phone_number: admin.phone_number,
        first_name: admin.first_name,
        last_name: admin.last_name,
        is_active: admin.is_active,
        is_phone_verified: admin.is_phone_verified,
        is_email_verified: admin.is_email_verified,
      },
    };
  }

  /**
   * Reset admin password
   */
  async resetAdminPassword(
    adminId: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const admin = await this.userRepository.findOne({
      where: { id: adminId },
      relations: ['role'],
    });

    if (!admin || admin.role.name !== RoleName.ADMIN) {
      throw new NotFoundException('Admin not found');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await this.userRepository.save(admin);

    return {
      message: 'Admin password reset successfully',
    };
  }

  /**
   * Send credentials email to admin (placeholder - integrate with email service)
   */
  async sendCredentialsEmail(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<void> {
    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    // For now, just log the credentials
    console.log(`
========================================
Admin Credentials Email
========================================
To: ${email}
Subject: Your Admin Account Credentials

Dear ${firstName} ${lastName},

Your admin account has been created. Here are your login credentials:

Email: ${email}
Password: ${password}

Please login and change your password for security.

Login URL: [Your Admin Dashboard URL]

Note: This is a temporary password. Please change it after first login.

Best regards,
Admin Team
========================================
    `);
  }
}

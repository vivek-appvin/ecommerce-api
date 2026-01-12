import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { AdminManagementService } from './admin-management.service';
import { ApproveSellerDto } from './dto/approve-seller.dto';
import { BlockUserDto } from './dto/block-user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ResetAdminPasswordDto } from './dto/reset-admin-password.dto';
import { ResponseInterceptor } from '../utils/interceptor/response.interceptor';
import { AdminGuard } from '../utils/guards/admin.guard';

@ApiTags('Admin Management')
@Controller('admin/management')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AdminGuard)
@ApiBearerAuth('access-token')
export class AdminManagementController {
  constructor(
    private readonly adminManagementService: AdminManagementService,
  ) {}

  // User Management
  @Get('users')
  @ApiOperation({ summary: 'Get all users (customers)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getAllUsers(@Query('page') page?: number, @Query('limit') limit?: number) {
    try {
      const result = await this.adminManagementService.getAllUsers(
        page ? Number(page) : 1,
        limit ? Number(limit) : 10,
      );
      return {
        msg: 'Users retrieved successfully',
        data: result,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') userId: string) {
    try {
      const result = await this.adminManagementService.getUserById(userId);
      return {
        msg: 'User retrieved successfully',
        data: result,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  @Post('users/block')
  @ApiOperation({ summary: 'Block or unblock a user' })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  async blockUser(@Body() blockUserDto: BlockUserDto, @Request() req) {
    try {
      const result = await this.adminManagementService.blockUser(
        blockUserDto.user_id,
        blockUserDto.is_blocked,
        req.user.id,
      );
      return {
        msg: result.message,
        data: result.user,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  // Seller Management
  @Get('sellers')
  @ApiOperation({ summary: 'Get all sellers' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Sellers retrieved successfully' })
  async getAllSellers(@Query('page') page?: number, @Query('limit') limit?: number) {
    try {
      const result = await this.adminManagementService.getAllSellers(
        page ? Number(page) : 1,
        limit ? Number(limit) : 10,
      );
      return {
        msg: 'Sellers retrieved successfully',
        data: result,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  @Get('sellers/pending')
  @ApiOperation({ summary: 'Get pending sellers (not approved)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Pending sellers retrieved successfully' })
  async getPendingSellers(@Query('page') page?: number, @Query('limit') limit?: number) {
    try {
      const result = await this.adminManagementService.getPendingSellers(
        page ? Number(page) : 1,
        limit ? Number(limit) : 10,
      );
      return {
        msg: 'Pending sellers retrieved successfully',
        data: result,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  @Get('sellers/:id')
  @ApiOperation({ summary: 'Get seller by ID' })
  @ApiParam({ name: 'id', description: 'Seller ID' })
  @ApiResponse({ status: 200, description: 'Seller retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Seller not found' })
  async getSellerById(@Param('id') sellerId: string) {
    try {
      const result = await this.adminManagementService.getSellerById(sellerId);
      return {
        msg: 'Seller retrieved successfully',
        data: result,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  @Post('sellers/approve')
  @ApiOperation({ summary: 'Approve a seller' })
  @ApiResponse({ status: 200, description: 'Seller approved successfully' })
  @ApiResponse({ status: 404, description: 'Seller not found' })
  async approveSeller(@Body() approveSellerDto: ApproveSellerDto, @Request() req) {
    try {
      const result = await this.adminManagementService.approveSeller(
        approveSellerDto.seller_id,
        req.user.id,
      );
      return {
        msg: result.message,
        data: result.seller,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  @Post('sellers/reject')
  @ApiOperation({ summary: 'Reject a seller' })
  @ApiResponse({ status: 200, description: 'Seller rejected successfully' })
  @ApiResponse({ status: 404, description: 'Seller not found' })
  async rejectSeller(@Body() approveSellerDto: ApproveSellerDto, @Request() req) {
    try {
      const result = await this.adminManagementService.rejectSeller(
        approveSellerDto.seller_id,
        req.user.id,
      );
      return {
        msg: result.message,
        data: result.seller,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  // Admin Management
  @Get('admins')
  @ApiOperation({ summary: 'Get all admins' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Admins retrieved successfully' })
  async getAllAdmins(@Query('page') page?: number, @Query('limit') limit?: number) {
    try {
      const result = await this.adminManagementService.getAllAdmins(
        page ? Number(page) : 1,
        limit ? Number(limit) : 10,
      );
      return {
        msg: 'Admins retrieved successfully',
        data: result,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  @Get('admins/:id')
  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiResponse({ status: 200, description: 'Admin retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async getAdminById(@Param('id') adminId: string) {
    try {
      const result = await this.adminManagementService.getAdminById(adminId);
      return {
        msg: 'Admin retrieved successfully',
        data: result,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  @Post('admins/create')
  @ApiOperation({ summary: 'Create new admin (email and phone marked as verified, no OTP needed)' })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 409, description: 'Email or phone already exists' })
  async createAdmin(@Body() createAdminDto: CreateAdminDto, @Request() req) {
    try {
      const result = await this.adminManagementService.createAdmin(
        createAdminDto,
        req.user.id,
      );

      // Send credentials email if requested
      if (createAdminDto.send_credentials_email !== false) {
        await this.adminManagementService.sendCredentialsEmail(
          result.credentials.email,
          result.credentials.password,
          createAdminDto.first_name,
          createAdminDto.last_name,
        );
      }

      return {
        msg: 'Admin created successfully. Credentials email sent.',
        data: result.admin,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  @Post('admins/update/:id')
  @ApiOperation({ summary: 'Update admin details' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async updateAdmin(@Param('id') adminId: string, @Body() updateAdminDto: UpdateAdminDto) {
    try {
      const result = await this.adminManagementService.updateAdmin(
        adminId,
        updateAdminDto,
      );
      return {
        msg: 'Admin updated successfully',
        data: result.admin,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  @Post('admins/reset-password')
  @ApiOperation({ summary: 'Reset admin password' })
  @ApiResponse({ status: 200, description: 'Admin password reset successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async resetAdminPassword(@Body() resetPasswordDto: ResetAdminPasswordDto) {
    try {
      const result = await this.adminManagementService.resetAdminPassword(
        resetPasswordDto.admin_id,
        resetPasswordDto.new_password,
      );

      // TODO: Send password reset email if requested
      if (resetPasswordDto.send_email) {
        // await this.adminManagementService.sendPasswordResetEmail(...)
      }

      return {
        msg: result.message,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }
}

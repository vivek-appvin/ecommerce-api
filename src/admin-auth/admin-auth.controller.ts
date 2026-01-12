import {
  Controller,
  Post,
  Body,
  Get,
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
  ApiBody,
} from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/login.dto';
import { RefreshTokenDto } from '../customer-auth/dto/refresh-token.dto';
import { ResponseInterceptor } from '../utils/interceptor/response.interceptor';
import { AdminGuard } from '../utils/guards/admin.guard';

@ApiTags('Admin Auth')
@Controller('admin/auth')
@UseInterceptors(ResponseInterceptor)
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login as admin' })
  @ApiBody({ type: AdminLoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: AdminLoginDto, @Request() req) {
    try {
      const deviceId = req.headers['x-device-id'];
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await this.adminAuthService.login(
        loginDto,
        deviceId,
        ipAddress,
        userAgent,
      );
      return {
        msg: 'Login successful',
        data: result,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const result = await this.adminAuthService.refreshToken(
        refreshTokenDto.refresh_token,
      );
      return {
        msg: 'Token refreshed successfully',
        data: result,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  @Post('logout')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Logout admin' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const result = await this.adminAuthService.logout(
        refreshTokenDto.refresh_token,
      );
      return {
        msg: result.message,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  @Get('me')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current admin information' })
  @ApiResponse({ status: 200, description: 'Admin information retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@Request() req) {
    try {
      return {
        msg: 'Admin information retrieved successfully',
        data: req.user,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }
}

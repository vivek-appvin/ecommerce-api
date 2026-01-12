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
import { SellerAuthService } from './seller-auth.service';
import { SellerRegisterDto } from './dto/register.dto';
import { SellerLoginDto } from './dto/login.dto';
import { RefreshTokenDto } from '../customer-auth/dto/refresh-token.dto';
import { ResponseInterceptor } from '../utils/interceptor/response.interceptor';
import { SellerGuard } from '../utils/guards/seller.guard';

@ApiTags('Seller Auth')
@Controller('seller/auth')
@UseInterceptors(ResponseInterceptor)
export class SellerAuthController {
  constructor(private readonly sellerAuthService: SellerAuthService) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP for seller registration (same OTP sent to both email and phone)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'seller@example.com' },
        phone_number: { type: 'string', example: '+1234567890' },
      },
      required: ['email', 'phone_number'],
    },
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 409, description: 'Email or phone already registered' })
  async sendOtp(@Body() body: { email: string; phone_number: string }) {
    try {
      const result = await this.sellerAuthService.sendRegistrationOtp(
        body.email,
        body.phone_number,
      );
      return {
        msg: result.message,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new seller (pending admin approval)' })
  @ApiBody({ type: SellerRegisterDto })
  @ApiResponse({ status: 201, description: 'Seller registered successfully' })
  @ApiResponse({ status: 409, description: 'Seller already exists' })
  async register(@Body() registerDto: SellerRegisterDto, @Request() req) {
    try {
      const deviceId = req.headers['x-device-id'];
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await this.sellerAuthService.register(
        registerDto,
        deviceId,
        ipAddress,
        userAgent,
      );
      return {
        msg: result.message,
        data: {
          access_token: result.access_token,
          refresh_token: result.refresh_token,
          user: result.user,
        },
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login as seller' })
  @ApiBody({ type: SellerLoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: SellerLoginDto, @Request() req) {
    try {
      const deviceId = req.headers['x-device-id'];
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await this.sellerAuthService.login(
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
      const result = await this.sellerAuthService.refreshToken(
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
  @UseGuards(SellerGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Logout seller' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const result = await this.sellerAuthService.logout(
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
  @UseGuards(SellerGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current seller information' })
  @ApiResponse({ status: 200, description: 'Seller information retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@Request() req) {
    try {
      return {
        msg: 'Seller information retrieved successfully',
        data: req.user,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }
}

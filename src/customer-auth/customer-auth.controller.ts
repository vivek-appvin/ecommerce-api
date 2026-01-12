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
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { CustomerAuthService } from './customer-auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CustomerRegisterDto } from './dto/register.dto';
import { CustomerLoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResponseInterceptor } from '../utils/interceptor/response.interceptor';
import { CustomerGuard } from '../utils/guards/customer.guard';
import { OtpType, OtpPurpose } from '../otp/otp.entity';

@ApiTags('Customer Auth')
@Controller('customer/auth')
@UseInterceptors(ResponseInterceptor)
export class CustomerAuthController {
  constructor(private readonly customerAuthService: CustomerAuthService) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP for registration (phone only) or password reset' })
  @ApiBody({ type: SendOtpDto })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    try {
      // For registration, only phone number is required
      if (sendOtpDto.purpose === OtpPurpose.REGISTRATION) {
        const phone = sendOtpDto.phone_number || (sendOtpDto.identifier && sendOtpDto.type === OtpType.MOBILE ? sendOtpDto.identifier : null);
        if (!phone) {
          throw new BadRequestException('Phone number is required for registration');
        }
        const result = await this.customerAuthService.sendRegistrationOtp(phone, sendOtpDto.purpose);
        return {
          msg: result.message,
        };
      }
      
      // For password reset, use the existing flow (email or phone)
      const email = sendOtpDto.email || (sendOtpDto.identifier && sendOtpDto.type === OtpType.EMAIL ? sendOtpDto.identifier : null);
      const phone = sendOtpDto.phone_number || (sendOtpDto.identifier && sendOtpDto.type === OtpType.MOBILE ? sendOtpDto.identifier : null);
      
      const result = await this.customerAuthService.sendPasswordResetOtp(
        email,
        phone,
        sendOtpDto.purpose,
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
  @ApiOperation({ summary: 'Register a new customer with phone number and OTP verification (email will be added later)' })
  @ApiBody({ type: CustomerRegisterDto })
  @ApiResponse({ status: 201, description: 'Customer registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: CustomerRegisterDto, @Request() req) {
    try {
      const deviceId = req.headers['x-device-id'];
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await this.customerAuthService.register(
        registerDto,
        deviceId,
        ipAddress,
        userAgent,
      );
      return {
        msg: 'Customer registered successfully',
        data: result,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login as customer' })
  @ApiBody({ type: CustomerLoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: CustomerLoginDto, @Request() req) {
    try {
      const deviceId = req.headers['x-device-id'];
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await this.customerAuthService.login(
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
      const result = await this.customerAuthService.refreshToken(
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
  @UseGuards(CustomerGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Logout customer' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const result = await this.customerAuthService.logout(
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

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send OTP for password reset (same OTP sent to both email and phone if user has both)' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      // Find user to get both email and phone
      const email = forgotPasswordDto.type === OtpType.EMAIL ? forgotPasswordDto.identifier : null;
      const phone = forgotPasswordDto.type === OtpType.MOBILE ? forgotPasswordDto.identifier : null;
      
      const result = await this.customerAuthService.sendPasswordResetOtp(
        email,
        phone,
        OtpPurpose.PASSWORD_RESET,
      );
      return {
        msg: result.message,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with OTP (can use OTP from either email or phone)' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      const email = resetPasswordDto.type === OtpType.EMAIL ? resetPasswordDto.identifier : null;
      const phone = resetPasswordDto.type === OtpType.MOBILE ? resetPasswordDto.identifier : null;
      
      const result = await this.customerAuthService.resetPassword(
        email,
        phone,
        resetPasswordDto.otp_code,
        resetPasswordDto.new_password,
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
  @UseGuards(CustomerGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current customer information' })
  @ApiResponse({ status: 200, description: 'Customer information retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@Request() req) {
    try {
      return {
        msg: 'Customer information retrieved successfully',
        data: req.user,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(err.message || 'Something went wrong');
    }
  }
}

import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestPhoneOtpDto } from './dto/request-phone-otp.dto';
import { VerifyPhoneOtpDto } from './dto/verify-phone-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { OauthLoginDto } from './dto/oauth-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('oauth')
  async oauthLogin(@Body() oauthLoginDto: OauthLoginDto) {
    return this.authService.oauthLogin(oauthLoginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('phone-otp/request')
  async requestPhoneOtp(@Body() requestOtpDto: RequestPhoneOtpDto) {
    return this.authService.requestPhoneOtp(requestOtpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('phone-otp/verify')
  async verifyPhoneOtp(@Body() verifyOtpDto: VerifyPhoneOtpDto) {
    return this.authService.verifyPhoneOtp(verifyOtpDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER', 'DRIVER', 'ADMIN')
  @Get('profile')
  getProfile(@Request() req) {
    // This route is protected by JWT
    return req.user;
  }

  // Microservice RPC endpoints for API Gateway communication
  @MessagePattern({ cmd: 'verify_token' })
  async verifyToken(@Payload() data: { token: string }) {
    return this.authService.verifyToken(data.token);
  }
}

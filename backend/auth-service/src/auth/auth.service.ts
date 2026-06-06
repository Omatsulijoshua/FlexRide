import { ConflictException, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { AuthRepository, AuthUserRecord } from './auth.repository';
import { RequestPhoneOtpDto } from './dto/request-phone-otp.dto';
import { VerifyPhoneOtpDto } from './dto/verify-phone-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { OauthLoginDto } from './dto/oauth-login.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Jos@56567', salt);
    await this.authRepository.upsertAdmin({
      firstName: 'Joshua',
      lastName: 'Omatsuli',
      email: 'joshuaomatsuli01@gmail.com',
      phoneNumber: '0000000000',
      passwordHash: hashedPassword,
    });
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.authRepository.findByEmailOrPhone(
      registerDto.email,
      registerDto.phoneNumber,
    );
    if (existingUser) {
      throw new ConflictException('Email or phone number already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    const newUser = await this.authRepository.createUser({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      phoneNumber: registerDto.phoneNumber,
      passwordHash: hashedPassword,
      role: registerDto.role || 'CUSTOMER',
    });

    const tokens = await this.issueTokens(newUser);
    return { user: this.toPublicUser(newUser), ...tokens };
  }

  async login(loginDto: LoginDto) {
    const user = await this.authRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      user: this.toPublicUser(user),
      ...(await this.issueTokens(user, payload)),
    };
  }

  async requestPhoneOtp(requestOtpDto: RequestPhoneOtpDto) {
    const otp = this.generateOtp();
    const codeHash = await bcrypt.hash(otp, await bcrypt.genSalt(10));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.authRepository.createPhoneOtp(requestOtpDto.phoneNumber, codeHash, expiresAt);

    return {
      success: true,
      message: 'OTP sent to phone number',
      expiresAt,
      devOtp: process.env.NODE_ENV === 'production' ? undefined : otp,
    };
  }

  async verifyPhoneOtp(verifyOtpDto: VerifyPhoneOtpDto) {
    const otpRecord = await this.authRepository.findActivePhoneOtp(verifyOtpDto.phoneNumber);
    if (!otpRecord || otpRecord.attempts >= 5) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const isValid = await bcrypt.compare(verifyOtpDto.otp, otpRecord.code_hash);
    if (!isValid) {
      await this.authRepository.incrementOtpAttempts(otpRecord.id);
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    await this.authRepository.consumeOtp(otpRecord.id);

    const user =
      (await this.authRepository.findByPhone(verifyOtpDto.phoneNumber)) ||
      (await this.authRepository.createPhoneUser(verifyOtpDto.phoneNumber));

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active');
    }

    return {
      user: this.toPublicUser(user),
      ...(await this.issueTokens(user, { phone: user.phone, sub: user.id, role: user.role })),
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'super_secret_flex_ride_refresh_key_for_development',
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const activeTokens = await this.authRepository.findActiveRefreshTokens(payload.sub);
    for (const token of activeTokens) {
      const matches = await bcrypt.compare(refreshTokenDto.refreshToken, token.token_hash);
      if (matches) {
        await this.authRepository.revokeRefreshToken(token.id);
        const user = payload.email
          ? await this.authRepository.findByEmail(payload.email)
          : await this.authRepository.findByPhone(payload.phone);

        if (!user || user.status !== 'ACTIVE') {
          throw new UnauthorizedException('Account is not active');
        }

        return {
          user: this.toPublicUser(user),
          ...(await this.issueTokens(user)),
        };
      }
    }

    throw new UnauthorizedException('Invalid refresh token');
  }

  async oauthLogin(oauthLoginDto: OauthLoginDto) {
    const email = oauthLoginDto.email || `${oauthLoginDto.provider.toLowerCase()}-${Date.now()}@oauth.flexride.local`;
    let user = await this.authRepository.findByEmail(email);

    if (!user) {
      user = await this.authRepository.createUser({
        firstName: oauthLoginDto.provider,
        lastName: 'User',
        email,
        phoneNumber: `+1000${Date.now().toString().slice(-10)}`,
        passwordHash: await bcrypt.hash(oauthLoginDto.oauthToken, await bcrypt.genSalt(10)),
        role: 'CUSTOMER',
      });
    }

    return {
      provider: oauthLoginDto.provider,
      user: this.toPublicUser(user),
      ...(await this.issueTokens(user)),
    };
  }

  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return { isValid: true, user: decoded };
    } catch (e) {
      return { isValid: false, error: 'Invalid or expired token' };
    }
  }

  private toPublicUser(user: AuthUserRecord) {
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneNumber: user.phone,
      role: user.role,
      status: user.status,
    };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async issueTokens(user: AuthUserRecord, payload?: Record<string, any>) {
    const accessPayload = payload || {
      email: user.email,
      phone: user.phone,
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(accessPayload);
    const refreshToken = this.jwtService.sign(accessPayload, {
      secret: process.env.JWT_REFRESH_SECRET || 'super_secret_flex_ride_refresh_key_for_development',
      expiresIn: '30d',
    });

    const tokenHash = await bcrypt.hash(refreshToken, await bcrypt.genSalt(10));
    await this.authRepository.storeRefreshToken({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}

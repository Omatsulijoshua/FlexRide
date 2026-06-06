import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthRepository } from './auth.repository';
import { DatabaseService } from '../database/database.service';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super_secret_flex_ride_key_for_development',
      signOptions: { expiresIn: '1d' }, // 1 day token
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, DatabaseService, JwtStrategy, RolesGuard],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}

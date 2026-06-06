import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super_secret_flex_ride_key_for_development',
    });
  }

  async validate(payload: any) {
    // This payload is the decoded JWT token.
    // We can add further validation here (e.g. check if user is banned in DB)
    if (!payload.sub) {
      throw new UnauthorizedException();
    }
    
    // Returns req.user populated with these fields
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}

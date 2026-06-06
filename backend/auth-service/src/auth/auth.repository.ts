import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface AuthUserRecord {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password_hash: string;
  role: string;
  status: string;
}

@Injectable()
export class AuthRepository {
  constructor(private readonly db: DatabaseService) {}

  async findByEmailOrPhone(email: string, phone: string): Promise<AuthUserRecord | null> {
    const result = await this.db.query<AuthUserRecord>(
      `SELECT id, first_name, last_name, email, phone, password_hash, role, status
       FROM users
       WHERE email = $1 OR phone = $2
       LIMIT 1`,
      [email, phone],
    );
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<AuthUserRecord | null> {
    const result = await this.db.query<AuthUserRecord>(
      `SELECT id, first_name, last_name, email, phone, password_hash, role, status
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email],
    );
    return result.rows[0] || null;
  }

  async findByPhone(phone: string): Promise<AuthUserRecord | null> {
    const result = await this.db.query<AuthUserRecord>(
      `SELECT id, first_name, last_name, email, phone, password_hash, role, status
       FROM users
       WHERE phone = $1
       LIMIT 1`,
      [phone],
    );
    return result.rows[0] || null;
  }

  async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    passwordHash: string;
    role: string;
  }): Promise<AuthUserRecord> {
    const result = await this.db.query<AuthUserRecord>(
      `INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, first_name, last_name, email, phone, password_hash, role, status`,
      [data.firstName, data.lastName, data.email, data.phoneNumber, data.passwordHash, data.role],
    );
    return result.rows[0];
  }

  async createPhoneUser(phoneNumber: string): Promise<AuthUserRecord> {
    const result = await this.db.query<AuthUserRecord>(
      `INSERT INTO users (phone, role)
       VALUES ($1, 'CUSTOMER')
       ON CONFLICT (phone) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
       RETURNING id, first_name, last_name, email, phone, password_hash, role, status`,
      [phoneNumber],
    );
    return result.rows[0];
  }

  async createPhoneOtp(phoneNumber: string, codeHash: string, expiresAt: Date): Promise<void> {
    await this.db.query(
      `INSERT INTO phone_otps (phone, code_hash, purpose, expires_at)
       VALUES ($1, $2, 'LOGIN', $3)`,
      [phoneNumber, codeHash, expiresAt],
    );
  }

  async findActivePhoneOtp(phoneNumber: string): Promise<{ id: string; code_hash: string; attempts: number } | null> {
    const result = await this.db.query<{ id: string; code_hash: string; attempts: number }>(
      `SELECT id, code_hash, attempts
       FROM phone_otps
       WHERE phone = $1
         AND purpose = 'LOGIN'
         AND consumed_at IS NULL
         AND expires_at > CURRENT_TIMESTAMP
       ORDER BY created_at DESC
       LIMIT 1`,
      [phoneNumber],
    );
    return result.rows[0] || null;
  }

  async incrementOtpAttempts(otpId: string): Promise<void> {
    await this.db.query('UPDATE phone_otps SET attempts = attempts + 1 WHERE id = $1', [otpId]);
  }

  async consumeOtp(otpId: string): Promise<void> {
    await this.db.query('UPDATE phone_otps SET consumed_at = CURRENT_TIMESTAMP WHERE id = $1', [otpId]);
  }

  async storeRefreshToken(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<void> {
    await this.db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, user_agent, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [data.userId, data.tokenHash, data.expiresAt, data.userAgent || null, data.ipAddress || null],
    );
  }

  async findActiveRefreshTokens(userId: string): Promise<{ id: string; token_hash: string }[]> {
    const result = await this.db.query<{ id: string; token_hash: string }>(
      `SELECT id, token_hash
       FROM refresh_tokens
       WHERE user_id = $1
         AND revoked_at IS NULL
         AND expires_at > CURRENT_TIMESTAMP
       ORDER BY created_at DESC`,
      [userId],
    );
    return result.rows;
  }

  async revokeRefreshToken(tokenId: string): Promise<void> {
    await this.db.query(
      `UPDATE refresh_tokens
       SET revoked_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [tokenId],
    );
  }

  async upsertAdmin(data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    passwordHash: string;
  }): Promise<void> {
    const result = await this.db.query<{ id: string }>(
      `INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, 'ADMIN')
       ON CONFLICT (email) DO UPDATE
       SET first_name = EXCLUDED.first_name,
           last_name = EXCLUDED.last_name,
           phone = EXCLUDED.phone,
           password_hash = EXCLUDED.password_hash,
           role = 'ADMIN',
           updated_at = CURRENT_TIMESTAMP
       RETURNING id`,
      [data.firstName, data.lastName, data.email, data.phoneNumber, data.passwordHash],
    );

    await this.db.query(
      `INSERT INTO admin_users (user_id, permissions)
       VALUES ($1, '["*"]'::jsonb)
       ON CONFLICT (user_id) DO NOTHING`,
      [result.rows[0].id],
    );
  }
}

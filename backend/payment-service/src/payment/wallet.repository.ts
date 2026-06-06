import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class WalletRepository {
  constructor(private readonly db: DatabaseService) {}

  async getOrCreateWallet(userId: string) {
    const result = await this.db.query(
      `INSERT INTO wallets (user_id, balance)
       VALUES ($1, 0)
       ON CONFLICT (user_id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
       RETURNING id, user_id AS "userId", balance, currency, status`,
      [userId],
    );
    return result.rows[0];
  }

  async creditWallet(userId: string, amount: number, type: string, description: string, reference?: string) {
    return this.db.transaction(async client => {
      const wallet = await this.getOrCreateWalletForUpdate(client, userId);
      const updatedWallet = await client.query(
        `UPDATE wallets
         SET balance = balance + $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING id, user_id AS "userId", balance, currency, status`,
        [wallet.id, amount],
      );
      await this.recordTransaction(client, wallet.id, amount, type, 'COMPLETED', description, reference);
      return updatedWallet.rows[0];
    });
  }

  async debitWallet(userId: string, amount: number, type: string, description: string, reference?: string) {
    return this.db.transaction(async client => {
      const wallet = await this.getOrCreateWalletForUpdate(client, userId);
      if (Number(wallet.balance) < amount) {
        return null;
      }

      const updatedWallet = await client.query(
        `UPDATE wallets
         SET balance = balance - $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING id, user_id AS "userId", balance, currency, status`,
        [wallet.id, amount],
      );
      await this.recordTransaction(client, wallet.id, -amount, type, 'COMPLETED', description, reference);
      return updatedWallet.rows[0];
    });
  }

  async processRidePayment(data: {
    rideId: string;
    customerId: string;
    driverId: string;
    amount: number;
    commission: number;
    driverEarnings: number;
  }) {
    return this.db.transaction(async client => {
      const customerWallet = await this.getOrCreateWalletForUpdate(client, data.customerId);
      if (Number(customerWallet.balance) < data.amount) {
        return null;
      }

      await client.query('UPDATE wallets SET balance = balance - $2 WHERE id = $1', [customerWallet.id, data.amount]);
      await this.recordTransaction(client, customerWallet.id, -data.amount, 'RIDE_PAYMENT', 'COMPLETED', `Payment for ride ${data.rideId}`);

      const driverWallet = await this.getOrCreateWalletForUpdate(client, data.driverId);
      await client.query('UPDATE wallets SET balance = balance + $2 WHERE id = $1', [driverWallet.id, data.driverEarnings]);
      await this.recordTransaction(client, driverWallet.id, data.driverEarnings, 'RIDE_EARNING', 'COMPLETED', `Earnings for ride ${data.rideId}`);

      await client.query(
        `INSERT INTO payments (user_id, ride_id, gateway, method, amount, status, metadata)
         VALUES ($1, $2, 'WALLET', 'WALLET', $3, 'COMPLETED', $4::jsonb)`,
        [
          data.customerId,
          data.rideId,
          data.amount,
          JSON.stringify({ commission: data.commission, driverEarnings: data.driverEarnings }),
        ],
      );

      return true;
    });
  }

  async createPayment(data: {
    userId: string;
    gateway: string;
    method: string;
    amount: number;
    status: string;
    providerReference?: string;
    metadata?: Record<string, any>;
  }) {
    const result = await this.db.query(
      `INSERT INTO payments (user_id, gateway, method, amount, status, provider_reference, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
       RETURNING *`,
      [
        data.userId,
        data.gateway,
        data.method,
        data.amount,
        data.status,
        data.providerReference || null,
        JSON.stringify(data.metadata || {}),
      ],
    );
    return result.rows[0];
  }

  async markPaymentRefunded(paymentId: string, amount: number, reason?: string) {
    const result = await this.db.query(
      `UPDATE payments
       SET status = 'REFUNDED',
           metadata = metadata || $3::jsonb
       WHERE id = $1
       RETURNING *`,
      [paymentId, amount, JSON.stringify({ refundAmount: amount, refundReason: reason || null })],
    );
    return result.rows[0] || null;
  }

  async getTransactions(userId: string) {
    const result = await this.db.query(
      `SELECT wt.*
       FROM wallet_transactions wt
       INNER JOIN wallets w ON w.id = wt.wallet_id
       WHERE w.user_id = $1
       ORDER BY wt.created_at DESC`,
      [userId],
    );
    return result.rows;
  }

  private async getOrCreateWalletForUpdate(client: PoolClient, userId: string) {
    const insert = await client.query(
      `INSERT INTO wallets (user_id, balance)
       VALUES ($1, 0)
       ON CONFLICT (user_id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId],
    );

    const result = await client.query('SELECT * FROM wallets WHERE id = $1 FOR UPDATE', [insert.rows[0].id]);
    return result.rows[0];
  }

  private async recordTransaction(
    client: PoolClient,
    walletId: string,
    amount: number,
    type: string,
    status: string,
    description: string,
    reference?: string,
  ) {
    await client.query(
      `INSERT INTO wallet_transactions (wallet_id, amount, type, status, reference, description)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [walletId, amount, type, status, reference || null, description],
    );
  }
}

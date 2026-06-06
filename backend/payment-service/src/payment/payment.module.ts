import { Module } from '@nestjs/common';
import { WalletService } from './services/wallet.service';
import { GatewayService } from './services/gateway.service';
import { WalletController } from './controllers/wallet.controller';
import { PaymentController } from './controllers/payment.controller';
import { DatabaseService } from '../database/database.service';
import { WalletRepository } from './wallet.repository';

@Module({
  controllers: [WalletController, PaymentController],
  providers: [WalletService, GatewayService, WalletRepository, DatabaseService],
})
export class PaymentModule {}

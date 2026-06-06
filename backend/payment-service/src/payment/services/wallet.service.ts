import { Injectable, BadRequestException } from '@nestjs/common';
import { FundWalletDto } from '../dto/fund-wallet.dto';
import { ProcessPaymentDto } from '../dto/process-payment.dto';
import { WithdrawWalletDto } from '../dto/withdraw-wallet.dto';
import { RefundPaymentDto } from '../dto/refund-payment.dto';
import { WalletRepository } from '../wallet.repository';

@Injectable()
export class WalletService {
  private readonly COMMISSION_RATE = 0.20; // Flex Ride takes 20%

  constructor(private readonly walletRepository: WalletRepository) {}

  getWallet(userId: string) {
    return this.walletRepository.getOrCreateWallet(userId);
  }

  fundWallet(userId: string, fundDto: FundWalletDto) {
    return this.walletRepository.creditWallet(
      userId,
      fundDto.amount,
      'DEPOSIT',
      'Wallet funding via payment gateway',
    );
  }

  async processRidePayment(processDto: ProcessPaymentDto) {
    const { rideId, customerId, driverId, amount } = processDto;

    const commission = amount * this.COMMISSION_RATE;
    const driverEarnings = amount - commission;
    const processed = await this.walletRepository.processRidePayment({
      rideId,
      customerId,
      driverId,
      amount,
      commission,
      driverEarnings,
    });

    if (!processed) {
      throw new BadRequestException('Insufficient wallet balance. Please add a card.');
    }

    return { 
      success: true, 
      deducted: amount, 
      commission, 
      driverEarnings 
    };
  }

  async withdraw(userId: string, withdrawDto: WithdrawWalletDto) {
    const wallet = await this.walletRepository.debitWallet(
      userId,
      withdrawDto.amount,
      'WITHDRAWAL',
      `Driver withdrawal to ${withdrawDto.bankCode}/${withdrawDto.accountNumber}`,
    );

    if (!wallet) {
      throw new BadRequestException('Insufficient wallet balance for withdrawal');
    }

    await this.walletRepository.createPayment({
      userId,
      gateway: 'BANK_TRANSFER',
      method: 'BANK_TRANSFER',
      amount: withdrawDto.amount,
      status: 'PENDING',
      metadata: {
        bankCode: withdrawDto.bankCode,
        accountNumber: withdrawDto.accountNumber,
        type: 'DRIVER_WITHDRAWAL',
      },
    });

    return { success: true, status: 'PENDING', wallet };
  }

  async refund(refundDto: RefundPaymentDto) {
    const payment = await this.walletRepository.markPaymentRefunded(
      refundDto.paymentId,
      refundDto.amount,
      refundDto.reason,
    );

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    return { success: true, payment };
  }

  getTransactions(userId: string) {
    return this.walletRepository.getTransactions(userId);
  }
}

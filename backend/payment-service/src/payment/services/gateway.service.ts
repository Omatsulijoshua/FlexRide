import { Injectable } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { InitializePaymentDto } from '../dto/initialize-payment.dto';
import { WalletRepository } from '../wallet.repository';

@Injectable()
export class GatewayService {
  constructor(
    private walletService: WalletService,
    private readonly walletRepository: WalletRepository,
  ) {}

  async initializePayment(dto: InitializePaymentDto) {
    const reference = `${dto.gateway.toLowerCase()}_${Date.now()}`;
    const method = this.resolvePaymentMethod(dto.gateway);

    const payment = await this.walletRepository.createPayment({
      userId: dto.userId,
      gateway: dto.gateway,
      method,
      amount: dto.amount,
      status: dto.gateway === 'CASH' ? 'PENDING_CASH_COLLECTION' : 'PENDING',
      providerReference: reference,
      metadata: {
        email: dto.email,
        supportedGateways: ['Paystack', 'Flutterwave', 'Monnify', 'OPay'],
        supportedMethods: ['card', 'bank transfer', 'USSD', 'Apple Pay', 'Google Pay', 'cash'],
      },
    });

    return {
      paymentId: payment.id,
      gateway: dto.gateway,
      method,
      reference,
      authorizationUrl: dto.gateway === 'CASH' ? null : `https://payments.flexride.local/${reference}`,
    };
  }

  handlePaystackWebhook(payload: any) {
    // Example: Paystack sends a charge.success event
    if (payload.event === 'charge.success') {
      const amountInNaira = payload.data.amount / 100; // Paystack amount is in kobo
      const userId = payload.data.metadata.userId; // Passed during initialization
      
      // Auto-fund the wallet
      this.walletService.fundWallet(userId, { amount: amountInNaira });
      return { status: 'success' };
    }
    
    return { status: 'ignored' };
  }

  handleFlutterwaveWebhook(payload: any) {
    if (payload.event === 'charge.completed' || payload.status === 'successful') {
      const amount = Number(payload.data?.amount || payload.amount || 0);
      const userId = payload.data?.meta?.userId || payload.meta?.userId;
      if (userId && amount > 0) {
        this.walletService.fundWallet(userId, { amount });
        return { status: 'success', gateway: 'Flutterwave' };
      }
    }

    return { status: 'ignored', gateway: 'Flutterwave' };
  }

  handleMonnifyWebhook(payload: any) {
    if (payload.eventType === 'SUCCESSFUL_TRANSACTION' || payload.paymentStatus === 'PAID') {
      const amount = Number(payload.eventData?.amountPaid || payload.amountPaid || 0);
      const userId = payload.eventData?.metaData?.userId || payload.metaData?.userId;
      if (userId && amount > 0) {
        this.walletService.fundWallet(userId, { amount });
        return { status: 'success', gateway: 'Monnify' };
      }
    }

    return { status: 'ignored', gateway: 'Monnify' };
  }

  handleOPayWebhook(payload: any) {
    if (payload.status === 'SUCCESS' || payload.event === 'payment.success') {
      const amount = Number(payload.amount || payload.data?.amount || 0);
      const userId = payload.reference?.split(':')[0] || payload.data?.metadata?.userId;
      if (userId && amount > 0) {
        this.walletService.fundWallet(userId, { amount });
        return { status: 'success', gateway: 'OPay' };
      }
    }

    return { status: 'ignored', gateway: 'OPay' };
  }

  private resolvePaymentMethod(gateway: string) {
    if (['PAYSTACK', 'FLUTTERWAVE'].includes(gateway)) return 'CARD';
    if (gateway === 'MONNIFY') return 'BANK_TRANSFER';
    if (gateway === 'OPAY') return 'USSD';
    return gateway;
  }
}

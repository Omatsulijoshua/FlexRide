import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { WalletService } from '../services/wallet.service';
import { GatewayService } from '../services/gateway.service';
import { ProcessPaymentDto } from '../dto/process-payment.dto';
import { InitializePaymentDto } from '../dto/initialize-payment.dto';
import { RefundPaymentDto } from '../dto/refund-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly walletService: WalletService,
    private readonly gatewayService: GatewayService
  ) {}

  @Post('ride')
  processRidePayment(@Body() processDto: ProcessPaymentDto) {
    // This is called by the Ride Service when a ride completes
    return this.walletService.processRidePayment(processDto);
  }

  @Post('initialize')
  initializePayment(@Body() initializePaymentDto: InitializePaymentDto) {
    return this.gatewayService.initializePayment(initializePaymentDto);
  }

  @Post('refund')
  refund(@Body() refundDto: RefundPaymentDto) {
    return this.walletService.refund(refundDto);
  }

  @Post('webhook/paystack')
  @HttpCode(HttpStatus.OK)
  handlePaystackWebhook(@Body() payload: any) {
    // In production, we must verify the HMAC signature here
    return this.gatewayService.handlePaystackWebhook(payload);
  }

  @Post('webhook/flutterwave')
  @HttpCode(HttpStatus.OK)
  handleFlutterwaveWebhook(@Body() payload: any) {
    return this.gatewayService.handleFlutterwaveWebhook(payload);
  }

  @Post('webhook/monnify')
  @HttpCode(HttpStatus.OK)
  handleMonnifyWebhook(@Body() payload: any) {
    return this.gatewayService.handleMonnifyWebhook(payload);
  }

  @Post('webhook/opay')
  @HttpCode(HttpStatus.OK)
  handleOPayWebhook(@Body() payload: any) {
    return this.gatewayService.handleOPayWebhook(payload);
  }
}

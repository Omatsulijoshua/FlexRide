import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { WalletService } from '../services/wallet.service';
import { FundWalletDto } from '../dto/fund-wallet.dto';
import { WithdrawWalletDto } from '../dto/withdraw-wallet.dto';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':userId')
  getWalletBalance(@Param('userId') userId: string) {
    return this.walletService.getWallet(userId);
  }

  @Post(':userId/fund')
  fundWallet(@Param('userId') userId: string, @Body() fundDto: FundWalletDto) {
    return this.walletService.fundWallet(userId, fundDto);
  }

  @Post(':userId/withdraw')
  withdraw(@Param('userId') userId: string, @Body() withdrawDto: WithdrawWalletDto) {
    return this.walletService.withdraw(userId, withdrawDto);
  }

  @Get(':userId/transactions')
  getTransactions(@Param('userId') userId: string) {
    return this.walletService.getTransactions(userId);
  }
}

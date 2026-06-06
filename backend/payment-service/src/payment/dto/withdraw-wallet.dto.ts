import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class WithdrawWalletDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1000, { message: 'Minimum withdrawal amount is 1000 NGN' })
  amount: number;

  @IsString()
  @IsNotEmpty()
  bankCode: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;
}

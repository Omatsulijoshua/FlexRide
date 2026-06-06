import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class FundWalletDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(100, { message: 'Minimum funding amount is 100 NGN' })
  amount: number;
}

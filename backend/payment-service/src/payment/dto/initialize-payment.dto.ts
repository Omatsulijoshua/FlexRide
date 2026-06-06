import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class InitializePaymentDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  amount: number;

  @IsString()
  @IsIn(['PAYSTACK', 'FLUTTERWAVE', 'MONNIFY', 'OPAY', 'BANK_TRANSFER', 'CARD', 'USSD', 'APPLE_PAY', 'GOOGLE_PAY', 'CASH'])
  gateway: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

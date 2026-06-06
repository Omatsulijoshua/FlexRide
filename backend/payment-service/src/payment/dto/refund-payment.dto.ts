import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class RefundPaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  reason?: string;
}

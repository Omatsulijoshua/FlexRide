import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ProcessPaymentDto {
  @IsString()
  @IsNotEmpty()
  rideId: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  driverId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  amount: number;
}

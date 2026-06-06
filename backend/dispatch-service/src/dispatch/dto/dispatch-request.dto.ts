import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DispatchRequestDto {
  @IsString()
  @IsNotEmpty()
  rideId: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsNumber()
  @IsNotEmpty()
  pickupLat: number;

  @IsNumber()
  @IsNotEmpty()
  pickupLng: number;
}

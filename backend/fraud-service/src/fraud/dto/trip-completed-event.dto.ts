import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TripCompletedEventDto {
  @IsString()
  @IsNotEmpty()
  rideId: string;

  @IsString()
  @IsNotEmpty()
  driverId: string;

  @IsNumber()
  @IsNotEmpty()
  estimatedDistanceKm: number;

  @IsNumber()
  @IsNotEmpty()
  actualDistanceKm: number;
}

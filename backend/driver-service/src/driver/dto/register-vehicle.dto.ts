import { IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class RegisterVehicleDto {
  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsInt()
  @Min(1990)
  year: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @IsString()
  @IsIn(['ECONOMY', 'BIKE', 'KEKE', 'SEDAN', 'SUV', 'LUXURY', 'DELIVERY_VAN', 'TRUCK'])
  category: string;
}

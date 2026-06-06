import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class BookSeatDto {
  @IsString()
  @IsNotEmpty()
  tripId: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsNumber()
  @Min(1)
  seatCount: number;

  @IsNumber()
  @Min(0)
  luggageCount: number;
}

import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateRideStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['REQUESTED', 'ACCEPTED', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status: string;
}

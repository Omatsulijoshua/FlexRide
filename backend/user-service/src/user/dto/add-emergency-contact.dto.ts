import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class AddEmergencyContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  relation: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Valid international phone number required' })
  phoneNumber: string;
}

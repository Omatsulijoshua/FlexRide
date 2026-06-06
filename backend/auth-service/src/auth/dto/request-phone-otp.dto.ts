import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class RequestPhoneOtpDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Please provide a valid phone number with country code' })
  phoneNumber: string;
}

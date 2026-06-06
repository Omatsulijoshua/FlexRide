import { IsIn, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['LICENSE', 'IDENTITY', 'VEHICLE_REG', 'FACIAL_SCAN'])
  documentType: string;

  @IsUrl()
  @IsNotEmpty()
  documentUrl: string;
}

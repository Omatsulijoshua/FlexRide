import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { VerifyKycDto } from '../dto/verify-kyc.dto';
import { RegisterVehicleDto } from '../dto/register-vehicle.dto';
import { UploadDocumentDto } from '../dto/upload-document.dto';

@Injectable()
export class DriverService {
  // Mock DB for Phase 6
  private drivers = new Map<string, any>();
  private documents = new Map<string, any[]>();
  private vehicles = new Map<string, any[]>();

  verifyIdentity(driverId: string, kycDto: VerifyKycDto) {
    // In production, this would call NIMC or NIBSS APIs
    if (kycDto.nin.length !== 11 || kycDto.bvn.length !== 11) {
      throw new BadRequestException('Invalid NIN or BVN format');
    }

    const driver = this.drivers.get(driverId) || { id: driverId, status: 'PENDING' };
    driver.nin = kycDto.nin;
    driver.bvn = kycDto.bvn;
    
    this.drivers.set(driverId, driver);
    return { success: true, message: 'Identity verified successfully', driver };
  }

  uploadDocument(driverId: string, docDto: UploadDocumentDto) {
    const docs = this.documents.get(driverId) || [];
    const newDoc = { id: Math.random().toString(), ...docDto, status: 'PENDING_REVIEW' };
    this.documents.set(driverId, [...docs, newDoc]);
    return newDoc;
  }

  registerVehicle(driverId: string, vehicleDto: RegisterVehicleDto) {
    const driverVehicles = this.vehicles.get(driverId) || [];
    const newVehicle = { id: Math.random().toString(), driverId, ...vehicleDto, isApproved: false };
    this.vehicles.set(driverId, [...driverVehicles, newVehicle]);
    return newVehicle;
  }

  getVehicles(driverId: string) {
    return this.vehicles.get(driverId) || [];
  }

  getDriverStatus(driverId: string) {
    const driver = this.drivers.get(driverId);
    if (!driver) throw new NotFoundException('Driver not found');
    return { status: driver.status };
  }
}

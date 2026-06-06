import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { AddEmergencyContactDto } from './dto/add-emergency-contact.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfile(userId: string) {
    const profile = await this.userRepository.findProfile(userId);
    if (!profile) throw new NotFoundException('User profile not found');
    return profile;
  }

  async updateProfile(userId: string, updateDto: UpdateProfileDto) {
    const updated = await this.userRepository.updateProfile(userId, updateDto);
    if (!updated) throw new NotFoundException('User profile not found');
    return updated;
  }

  addAddress(userId: string, addressDto: CreateAddressDto) {
    return this.userRepository.addAddress(userId, addressDto);
  }

  getAddresses(userId: string) {
    return this.userRepository.getAddresses(userId);
  }

  addEmergencyContact(userId: string, contactDto: AddEmergencyContactDto) {
    return this.userRepository.addEmergencyContact(userId, contactDto);
  }
}

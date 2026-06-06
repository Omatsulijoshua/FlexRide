import { Controller, Get, Patch, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { AddEmergencyContactDto } from './dto/add-emergency-contact.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id/profile')
  getProfile(@Param('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Patch(':id/profile')
  updateProfile(@Param('id') userId: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.updateProfile(userId, updateProfileDto);
  }

  @Post(':id/addresses')
  addAddress(@Param('id') userId: string, @Body() createAddressDto: CreateAddressDto) {
    return this.userService.addAddress(userId, createAddressDto);
  }

  @Get(':id/addresses')
  getAddresses(@Param('id') userId: string) {
    return this.userService.getAddresses(userId);
  }

  @Post(':id/emergency-contacts')
  addEmergencyContact(@Param('id') userId: string, @Body() addContactDto: AddEmergencyContactDto) {
    return this.userService.addEmergencyContact(userId, addContactDto);
  }
}

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AddEmergencyContactDto } from './dto/add-emergency-contact.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly db: DatabaseService) {}

  async findProfile(userId: string) {
    const result = await this.db.query(
      `SELECT u.id,
              u.email,
              u.phone,
              u.first_name AS "firstName",
              u.last_name AS "lastName",
              u.profile_photo_url AS "profilePictureUrl",
              rp.preferred_vehicle_type AS "preferredVehicleType",
              rp.avoid_tolls AS "avoidTolls",
              rp.quiet_ride AS "quietRide",
              rp.accessibility_notes AS "ridePreferences"
       FROM users u
       LEFT JOIN ride_preferences rp ON rp.user_id = u.id
       WHERE u.id = $1`,
      [userId],
    );
    return result.rows[0] || null;
  }

  async updateProfile(userId: string, updateDto: UpdateProfileDto) {
    const result = await this.db.query(
      `UPDATE users
       SET first_name = COALESCE($2, first_name),
           last_name = COALESCE($3, last_name),
           profile_photo_url = COALESCE($4, profile_photo_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id`,
      [userId, updateDto.firstName, updateDto.lastName, updateDto.profilePictureUrl],
    );

    if (result.rowCount === 0) {
      return null;
    }

    if (updateDto.ridePreferences) {
      await this.db.query(
        `INSERT INTO ride_preferences (user_id, accessibility_notes)
         VALUES ($1, $2)
         ON CONFLICT (user_id) DO UPDATE
         SET accessibility_notes = EXCLUDED.accessibility_notes,
             updated_at = CURRENT_TIMESTAMP`,
        [userId, updateDto.ridePreferences],
      );
    }

    return this.findProfile(userId);
  }

  async addAddress(userId: string, addressDto: CreateAddressDto) {
    const result = await this.db.query(
      `INSERT INTO user_addresses (user_id, label, address, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, label, address AS "addressLine", latitude, longitude, is_default AS "isDefault"`,
      [userId, addressDto.label, addressDto.addressLine, addressDto.latitude, addressDto.longitude],
    );
    return result.rows[0];
  }

  async getAddresses(userId: string) {
    const result = await this.db.query(
      `SELECT id, label, address AS "addressLine", latitude, longitude, is_default AS "isDefault"
       FROM user_addresses
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );
    return result.rows;
  }

  async addEmergencyContact(userId: string, contactDto: AddEmergencyContactDto) {
    const result = await this.db.query(
      `INSERT INTO emergency_contacts (user_id, name, phone, relationship)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, phone AS "phoneNumber", relationship AS relation`,
      [userId, contactDto.name, contactDto.phoneNumber, contactDto.relation],
    );
    return result.rows[0];
  }
}

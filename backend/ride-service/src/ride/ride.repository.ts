import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../database/database.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideStatusDto } from './dto/update-ride-status.dto';

@Injectable()
export class RideRepository {
  private readonly memoryMode = process.env.RIDE_REPOSITORY_MODE === 'memory';
  private readonly memoryRides = new Map<string, any>();
  private readonly memoryStops = new Map<string, any[]>();

  constructor(private readonly db: DatabaseService) {}

  async createRide(createDto: CreateRideDto, estimatedFare: number) {
    if (this.memoryMode) {
      const ride = {
        id: randomUUID(),
        customer_id: createDto.customerId,
        ride_type: this.resolveRideType(createDto),
        vehicle_category: createDto.category,
        pickup_address: createDto.pickupAddress,
        pickup_lat: createDto.pickupLat,
        pickup_lng: createDto.pickupLng,
        dropoff_address: createDto.dropoffAddress,
        dropoff_lat: createDto.dropoffLat,
        dropoff_lng: createDto.dropoffLng,
        status: 'REQUESTED',
        estimated_fare: estimatedFare,
        scheduled_time: createDto.scheduledTime || null,
        metadata: {
          bookingMode: createDto.bookingMode || 'ONE_WAY',
          rentalHours: createDto.rentalHours || null,
          promoCode: createDto.promoCode || null,
        },
        created_at: new Date(),
      };

      this.memoryRides.set(ride.id, ride);
      this.memoryStops.set(
        ride.id,
        createDto.stops?.map((stop, index) => ({
          id: randomUUID(),
          sequence_no: index + 1,
          address: stop.address,
          latitude: stop.lat,
          longitude: stop.lng,
        })) || [],
      );

      return ride;
    }

    return this.db.transaction(async client => {
      const rideResult = await client.query(
        `INSERT INTO rides (
           customer_id,
           ride_type,
           vehicle_category,
           pickup_address,
           pickup_lat,
           pickup_lng,
           dropoff_address,
           dropoff_lat,
           dropoff_lng,
          estimated_fare,
          scheduled_time,
          metadata
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb)
         RETURNING *`,
        [
          createDto.customerId,
          this.resolveRideType(createDto),
          createDto.category,
          createDto.pickupAddress,
          createDto.pickupLat,
          createDto.pickupLng,
          createDto.dropoffAddress,
          createDto.dropoffLat,
          createDto.dropoffLng,
          estimatedFare,
          createDto.scheduledTime || null,
          JSON.stringify({
            bookingMode: createDto.bookingMode || 'ONE_WAY',
            rentalHours: createDto.rentalHours || null,
            promoCode: createDto.promoCode || null,
          }),
        ],
      );

      const ride = rideResult.rows[0];

      if (createDto.stops?.length) {
        for (const [index, stop] of createDto.stops.entries()) {
          await client.query(
            `INSERT INTO ride_stops (ride_id, sequence_no, address, latitude, longitude)
             VALUES ($1, $2, $3, $4, $5)`,
            [ride.id, index + 1, stop.address, stop.lat, stop.lng],
          );
        }
      }

      return ride;
    });
  }

  async createScheduledRide(rideId: string, createDto: CreateRideDto) {
    const result = await this.db.query(
      `INSERT INTO scheduled_rides (ride_id, customer_id, scheduled_time)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [rideId, createDto.customerId, createDto.scheduledTime],
    );
    return result.rows[0];
  }

  async findRide(rideId: string) {
    if (this.memoryMode) {
      const ride = this.memoryRides.get(rideId);
      if (!ride) return null;
      return { ...ride, stops: this.memoryStops.get(rideId) || [] };
    }

    const rideResult = await this.db.query('SELECT * FROM rides WHERE id = $1', [rideId]);
    const ride = rideResult.rows[0];
    if (!ride) return null;

    const stopsResult = await this.db.query(
      `SELECT id, sequence_no, address, latitude, longitude
       FROM ride_stops
       WHERE ride_id = $1
       ORDER BY sequence_no ASC`,
      [rideId],
    );

    return { ...ride, stops: stopsResult.rows };
  }

  async updateStatus(rideId: string, updateDto: UpdateRideStatusDto) {
    if (this.memoryMode) {
      const ride = this.memoryRides.get(rideId);
      if (!ride) return null;
      const updated = {
        ...ride,
        status: updateDto.status,
        completed_at: updateDto.status === 'COMPLETED' ? new Date() : ride.completed_at,
        cancelled_at: updateDto.status === 'CANCELLED' ? new Date() : ride.cancelled_at,
      };
      this.memoryRides.set(rideId, updated);
      return updated;
    }

    const completedAt = updateDto.status === 'COMPLETED' ? new Date() : null;
    const cancelledAt = updateDto.status === 'CANCELLED' ? new Date() : null;

    const result = await this.db.query(
      `UPDATE rides
       SET status = $2,
           completed_at = COALESCE($3, completed_at),
           cancelled_at = COALESCE($4, cancelled_at)
       WHERE id = $1
       RETURNING *`,
      [rideId, updateDto.status, completedAt, cancelledAt],
    );

    return result.rows[0] || null;
  }

  async getScheduledRides(customerId: string) {
    if (this.memoryMode) {
      return Array.from(this.memoryRides.values())
        .filter(ride => ride.customer_id === customerId && ride.scheduled_time)
        .sort((a, b) => String(a.scheduled_time).localeCompare(String(b.scheduled_time)));
    }

    const result = await this.db.query(
      `SELECT sr.*, r.pickup_address, r.dropoff_address, r.vehicle_category, r.estimated_fare
       FROM scheduled_rides sr
       LEFT JOIN rides r ON r.id = sr.ride_id
       WHERE sr.customer_id = $1
       ORDER BY sr.scheduled_time ASC`,
      [customerId],
    );
    return result.rows;
  }

  private resolveRideType(createDto: CreateRideDto) {
    return createDto.bookingMode === 'POOL'
      ? 'POOL'
      : createDto.bookingMode === 'ROUND_TRIP'
        ? 'ROUND_TRIP'
        : createDto.bookingMode === 'HOURLY_RENTAL'
          ? 'HOURLY_RENTAL'
          : createDto.scheduledTime
            ? 'SCHEDULED'
            : 'RIDE_NOW';
  }
}

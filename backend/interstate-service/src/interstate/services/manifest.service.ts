import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateTripDto } from '../dto/create-trip.dto';
import { BookSeatDto } from '../dto/book-seat.dto';

@Injectable()
export class ManifestService {
  private trips = new Map<string, any>();
  private tickets = new Map<string, any>();

  createTrip(dto: CreateTripDto) {
    const tripId = `TRIP_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const newTrip = {
      id: tripId,
      ...dto,
      bookedSeats: 0,
      manifest: [], // List of passenger IDs
      status: 'SCHEDULED' // SCHEDULED, BOARDING, IN_TRANSIT, COMPLETED
    };

    this.trips.set(tripId, newTrip);
    return newTrip;
  }

  getAvailableTrips(routeId: string) {
    const available = [];
    for (const trip of this.trips.values()) {
      if (trip.routeId === routeId && trip.status === 'SCHEDULED' && trip.bookedSeats < trip.totalSeats) {
        available.push(trip);
      }
    }
    return available;
  }

  bookSeat(dto: BookSeatDto) {
    const trip = this.trips.get(dto.tripId);
    
    if (!trip) {
      throw new BadRequestException('Trip not found');
    }

    // Race condition prevention mock (in production, use SELECT FOR UPDATE in Postgres)
    if (trip.bookedSeats + dto.seatCount > trip.totalSeats) {
      throw new ConflictException(`Only ${trip.totalSeats - trip.bookedSeats} seats remaining.`);
    }

    trip.bookedSeats += dto.seatCount;
    
    for (let i = 0; i < dto.seatCount; i++) {
      trip.manifest.push(dto.customerId);
    }

    this.trips.set(trip.id, trip);

    const ticketId = `TKT_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const ticket = {
      id: ticketId,
      tripId: trip.id,
      customerId: dto.customerId,
      seats: dto.seatCount,
      bookingTime: new Date(),
    };
    
    this.tickets.set(ticketId, ticket);

    // Normally this would trigger Payment Service to deduct funds
    return {
      success: true,
      message: 'Seats booked successfully',
      ticketId,
      remainingSeats: trip.totalSeats - trip.bookedSeats
    };
  }
}

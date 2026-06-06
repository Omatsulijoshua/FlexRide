import { Controller, Post, Body } from '@nestjs/common';
import { ManifestService } from '../services/manifest.service';
import { BookSeatDto } from '../dto/book-seat.dto';

@Controller('interstate/bookings')
export class BookingController {
  constructor(private readonly manifestService: ManifestService) {}

  @Post()
  bookSeat(@Body() bookingDto: BookSeatDto) {
    return this.manifestService.bookSeat(bookingDto);
  }
}

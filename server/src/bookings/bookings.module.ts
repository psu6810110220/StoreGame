import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from '../entities/booking.entity';
import { BookingItem } from '../entities/booking-item.entity';
import { Game } from '../entities/game.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Booking, BookingItem, Game])],
    controllers: [BookingsController],
    providers: [BookingsService],
})
export class BookingsModule { }

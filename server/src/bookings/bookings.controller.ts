import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.createBooking(req.user, createBookingDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('my')
    getMyBookings(@Request() req) {
        return this.bookingsService.getUserBookings(req.user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    findAll() {
        return this.bookingsService.getAllBookings();
    }
}

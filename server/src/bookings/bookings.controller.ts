import { Controller, Post, Body, UseGuards, Request, Get, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    // สร้างการจองใหม่
    // POST /bookings
    @UseGuards(JwtAuthGuard) // ต้อง Login ก่อน
    @Post()
    create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
        // req.user คือข้อมูล User คนที่กดจอง (ได้มาจาก Token)
        return this.bookingsService.createBooking(req.user, createBookingDto);
    }

    // ดูประวัติการจองของตัวเอง
    // GET /bookings/my
    @UseGuards(JwtAuthGuard)
    @Get('my')
    getMyBookings(@Request() req) {
        return this.bookingsService.getUserBookings(req.user);
    }

    // ดูรายการจองทั้งหมด (เฉพาะ Admin)
    // GET /bookings
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    findAll() {
        return this.bookingsService.getAllBookings();
    }

    // อัปเดตสถานะการจอง (เช่น จาก PENDING -> CONFIRMED)
    // PATCH /bookings/:id/status
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id/status')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBookingStatusDto: UpdateBookingStatusDto,
    ) {
        return this.bookingsService.updateBookingStatus(id, updateBookingStatusDto.status);
    }

    // อัปเดตสถานะการจ่ายเงิน (Endpoint ใหม่)
    // PATCH /bookings/:id/payment-status
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id/payment-status')
    updatePaymentStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: string,
    ) {
        return this.bookingsService.updatePaymentStatus(id, status);
    }
}

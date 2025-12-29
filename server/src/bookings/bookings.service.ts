import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { BookingItem } from '../entities/booking-item.entity';
import { Game } from '../entities/game.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User } from '../users/user.entity';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        private dataSource: DataSource,
    ) { }

    async createBooking(user: User, createBookingDto: CreateBookingDto): Promise<Booking> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { pickupDate, items } = createBookingDto;
            const bookingItems: BookingItem[] = [];
            let totalAmount = 0; // Optional: Calculate total amount if needed

            for (const itemDto of items) {
                // Find game with stock check inside the transaction
                const game = await queryRunner.manager.findOne(Game, {
                    where: { id: itemDto.gameId },
                    lock: { mode: 'pessimistic_write' } // Lock the row to prevent race conditions
                });

                if (!game) {
                    throw new NotFoundException(`Game with ID ${itemDto.gameId} not found`);
                }

                if (game.stockQuantity < itemDto.quantity) {
                    throw new BadRequestException(`Insufficient stock for game: ${game.title}`);
                }

                // Deduct stock
                game.stockQuantity -= itemDto.quantity;
                await queryRunner.manager.save(game);

                // Create BookingItem
                const bookingItem = new BookingItem();
                bookingItem.game = game;
                bookingItem.quantity = itemDto.quantity;
                bookingItems.push(bookingItem);
            }

            // Create Booking
            const booking = new Booking();
            booking.user = user;
            booking.bookingDate = new Date();
            booking.pickupDate = new Date(pickupDate);
            booking.status = BookingStatus.PENDING;
            booking.bookingItems = bookingItems;

            // Save Booking (Cascades to BookingItems)
            const savedBooking = await queryRunner.manager.save(Booking, booking);

            await queryRunner.commitTransaction();
            return savedBooking;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async getUserBookings(user: User): Promise<Booking[]> {
        return this.bookingsRepository.find({
            where: { user: { id: user.id } },
            relations: ['bookingItems', 'bookingItems.game'],
            order: { createdAt: 'DESC' }
        });
    }

    async getAllBookings(): Promise<Booking[]> { // Admin
        return this.bookingsRepository.find({
            relations: ['user', 'bookingItems', 'bookingItems.game'],
            order: { createdAt: 'DESC' }
        });
    }

    async updateBookingStatus(id: number, status: BookingStatus): Promise<Booking> {
        const booking = await this.bookingsRepository.findOne({ where: { id } });
        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }
        booking.status = status;
        return this.bookingsRepository.save(booking);
    }
}

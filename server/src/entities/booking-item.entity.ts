import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from './booking.entity';
import { Game } from './game.entity';

@Entity('booking_items')
export class BookingItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Booking, (booking: Booking) => booking.bookingItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;

    @ManyToOne(() => Game, (game: Game) => game.bookingItems)
    @JoinColumn({ name: 'game_id' })
    game: Game;
}

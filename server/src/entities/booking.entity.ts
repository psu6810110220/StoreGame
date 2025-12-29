import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { BookingItem } from './booking-item.entity';

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'booking_date', type: 'timestamp' })
    bookingDate: Date;

    @Column({ name: 'pickup_date', type: 'timestamp' })
    pickupDate: Date;

    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING,
    })
    status: BookingStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // 👇 แก้เหลือแค่ความสัมพันธ์ทางเดียว
    @ManyToOne(() => User) 
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => BookingItem, (bookingItem: BookingItem) => bookingItem.booking, { cascade: true })
    bookingItems: BookingItem[];
}
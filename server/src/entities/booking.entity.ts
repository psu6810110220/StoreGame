import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { BookingItem } from './booking-item.entity';

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    REJECTED = 'REJECTED',
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

    @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalAmount: number;

    @Column({ name: 'deposit_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
    depositAmount: number;

    @Column({ name: 'slip_url', type: 'varchar', nullable: true })
    slipUrl: string;

    @Column({
        name: 'payment_status',
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    paymentStatus: PaymentStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => BookingItem, (bookingItem: BookingItem) => bookingItem.booking, { cascade: true })
    bookingItems: BookingItem[];
}
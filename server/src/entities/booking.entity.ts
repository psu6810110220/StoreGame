import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { BookingItem } from './booking-item.entity';

// Enum สถานะการจอง
export enum BookingStatus {
    PENDING = 'PENDING',       // รอตรวจสอบ
    CONFIRMED = 'CONFIRMED',   // ยืนยันแล้ว
    COMPLETED = 'COMPLETED',   // รับของคืนของเสร็จสิ้น
    CANCELLED = 'CANCELLED',   // ยกเลิก
}

// Enum สถานะการจ่ายเงิน
export enum PaymentStatus {
    PENDING = 'PENDING',   // รอจ่าย
    PAID = 'PAID',         // จ่ายแล้ว
    REJECTED = 'REJECTED', // การเงินปฏิเสธ
}

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    // วันที่กดจอง
    @Column({ name: 'booking_date', type: 'timestamp' })
    bookingDate: Date;

    // วันที่มารับของ
    @Column({ name: 'pickup_date', type: 'timestamp' })
    pickupDate: Date;

    // สถานะการจอง (Default เป็น Pending)
    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING,
    })
    status: BookingStatus;

    // ราคารวมทั้งหมด
    @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalAmount: number;

    // ค่ามัดจำ (10%)
    @Column({ name: 'deposit_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
    depositAmount: number;

    // URL ของสลิปโอนเงิน (ถ้ามี)
    @Column({ name: 'slip_url', type: 'varchar', nullable: true })
    slipUrl: string;

    // สถานะการจ่ายเงิน
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

    // ความสัมพันธ์: การจอง 1 รายการ เป็นของ User 1 คน (ManyToOne)
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    // ความสัมพันธ์: การจอง 1 รายการ มีได้หลายเกม (BookingItems) (OneToMany)
    // cascade: true = ถ้าเซฟ Booking ให้เซฟ BookingItems ลงไปด้วยอัตโนมัติ
    @OneToMany(() => BookingItem, (bookingItem: BookingItem) => bookingItem.booking, { cascade: true })
    bookingItems: BookingItem[];
}
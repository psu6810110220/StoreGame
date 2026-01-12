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
        private dataSource: DataSource, // DataSource ใช้สำหรับควบคุม connection และ transaction โดยตรง
    ) { }

    /**
     * 🟢 ฟังก์ชันสร้างการจอง (Create Booking)
     * ==========================================
     * ฟังก์ชันนี้ทำงานซับซ้อนที่สุดในระบบจอง เพราะมีการ "ตัดสต็อก"
     * เราต้องใช้ "Transaction" เพื่อรับประกันความถูกต้องของข้อมูล (Data Consistency)
     * 
     * 🔄 คอนเซปต์ Transaction:
     * - คือการมัดรวมหลายคำสั่ง (ลดสต็อก, สร้างใบจอง, สร้างรายการย่อย) ไว้เป็นก้อนเดียว
     * - ถ้า "สำเร็จ" ก็บันทึกทั้งหมด (Commit)
     * - ถ้า "พังกลางทาง" (เช่น สต็อกหมดพอดี, เน็ตหลุด) ก็ยกเลิกทั้งหมด (Rollback) 
     *   เสมือนว่าไม่มีอะไรเกิดขึ้น (เงินไม่หาย ของไม่หาย)
     */
    async createBooking(user: User, createBookingDto: CreateBookingDto): Promise<Booking> {
        // 1. เริ่มต้น QueryRunner เพื่อควบคุม Transaction เอง
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction(); // ⏳ เริ่มจับตาดูการเปลี่ยนแปลง

        try {
            const { pickupDate, items, slipUrl } = createBookingDto as any;
            const bookingItems: BookingItem[] = [];
            let totalAmount = 0;

            // ลูปเช็คสินค้าทีละชิ้นตามที่ User กดสั่งมา
            for (const itemDto of items) {
                // 2. ค้นหาเกม และ "ล็อค" แถวนั้นไว้ (Pessimistic Write Lock)
                // 🔒 Lock Mode: 'pessimistic_write'
                // หมายความว่า: "ห้ามใครมาแก้ข้อมูลเกม ID นี้ จนกว่าฉันจะทำงานเสร็จ"
                // เพื่อกันกรณีคน 2 คนกดจองชิ้นสุดท้ายพร้อมกัน (Race Condition)
                const game = await queryRunner.manager.findOne(Game, {
                    where: { id: itemDto.gameId },
                    lock: { mode: 'pessimistic_write' }
                });

                if (!game) {
                    throw new NotFoundException(`ไม่พบเกมรหัส ${itemDto.gameId}`);
                }

                // 3. เช็คสต็อก: ของพอให้ตัดไหม?
                if (game.stockQuantity < itemDto.quantity) {
                    throw new BadRequestException(`สินค้า '${game.title}' หมดพอกับจำนวนที่ขอ (เหลือ: ${game.stockQuantity})`);
                }

                // 4. ตัดสต็อกจริง (ลดจำนวนลง)
                game.stockQuantity -= itemDto.quantity;
                await queryRunner.manager.save(game); // บันทึกลง DB ชั่วคราว (ยังไม่ Commit)

                // 5. สร้าง object รายการย่อย (BookingItem)
                const bookingItem = new BookingItem();
                bookingItem.game = game;
                bookingItem.quantity = itemDto.quantity;
                bookingItems.push(bookingItem);

                // บวกราคาเพิ่ม
                totalAmount += (game.price * itemDto.quantity);
            }

            // 6. สร้างใบจองหลัก (Booking)
            const booking = new Booking();
            booking.user = user;
            booking.bookingDate = new Date();
            booking.pickupDate = new Date(pickupDate);
            booking.status = BookingStatus.PENDING; // สถานะเริ่มต้น = รอตรวจสอบ
            booking.bookingItems = bookingItems; // ยัดรายการย่อยลงไป

            // คำนวณเงิน
            booking.totalAmount = totalAmount;
            booking.depositAmount = totalAmount * 0.10; // มัดจำ 10% ตาม Business Rule
            booking.slipUrl = slipUrl || null;

            // 7. บันทึก Booking ลงฐานข้อมูล
            // (เนื่องจากตั้ง Cascade ไว้ใน Entity, มันจะบันทึก BookingItems ให้อัตโนมัติด้วย)
            const savedBooking = await queryRunner.manager.save(Booking, booking);

            // ✅ 8. ถ้าทุกอย่างราบรื่น -> ยืนยันข้อมูล (Commit)
            await queryRunner.commitTransaction();

            return savedBooking;

        } catch (err) {
            // ❌ 9. ถ้ามี Error อะไรก็ตาม -> ยกเลิกทุกอย่าง (Rollback)
            // สต็อกที่ตัดไปแล้วจะเด้งกลับมาเท่าเดิม
            await queryRunner.rollbackTransaction();
            throw err; // ส่ง Error ต่อให้ Controller
        } finally {
            // 10. ปิดการเชื่อมต่อ คืน Resource ให้ระบบ
            await queryRunner.release();
        }
    }

    // ดูประวัติการจองของ User คนนั้น
    async getUserBookings(user: User): Promise<Booking[]> {
        return this.bookingsRepository.find({
            where: { user: { id: user.id } }, // Filter เฉพาะ User ID นี้
            relations: ['bookingItems', 'bookingItems.game'], // Join ตาราง เอาข้อมูลสินค้ามาด้วย
            order: { createdAt: 'DESC' } // เรียงใหม่ -> เก่า
        });
    }

    // ดูรายการจองทั้งหมด (สำหรับ Admin)
    async getAllBookings(): Promise<Booking[]> {
        return this.bookingsRepository.find({
            relations: ['user', 'bookingItems', 'bookingItems.game'], // เอาข้อมูล User คนจองมาด้วย
            order: { createdAt: 'DESC' }
        });
    }

    // เปลี่ยนสถานะการจอง (เช่น กด Confirm)
    async updateBookingStatus(id: number, status: BookingStatus): Promise<Booking> {
        const booking = await this.bookingsRepository.findOne({ where: { id } });
        if (!booking) {
            throw new NotFoundException(`ไม่พบการจองรหัส ${id}`);
        }
        booking.status = status;
        return this.bookingsRepository.save(booking);
    }

    // เปลี่ยนสถานะการชำระเงิน
    async updatePaymentStatus(id: number, status: any): Promise<Booking> {
        const booking = await this.bookingsRepository.findOne({ where: { id } });
        if (!booking) {
            throw new NotFoundException(`ไม่พบการจองรหัส ${id}`);
        }
        booking.paymentStatus = status;

        // Business Logic: ถ้าจ่ายตังค์ครบ (PAID) -> ให้ถือว่ายืนยันการจอง (CONFIRMED) ทันที
        if (status === 'PAID') {
            booking.status = BookingStatus.CONFIRMED;
        }
        return this.bookingsRepository.save(booking);
    }
}

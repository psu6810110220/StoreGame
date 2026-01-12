import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { BookingItem } from './booking-item.entity';

// ตาราง games เก็บข้อมูลบอร์ดเกมทั้งหมด
@Entity('games')
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    // เก็บรายละเอียดเกม (ใช้ type: text สำหรับข้อความยาวๆ)
    @Column('text')
    description: string;

    // ราคา (ทศนิยม 2 ตำแหน่ง)
    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    // จำนวนของในสต็อก
    @Column({ name: 'stock_quantity' })
    stockQuantity: number;

    // ลิงก์รูปภาพปกเกม
    @Column({ name: 'image_url' })
    imageUrl: string;

    // หมวดหมู่เกม (เก็บเป็น Array strings ง่ายๆ เช่น ["Strategy", "Family"])
    @Column('simple-array', { nullable: true })
    categories: string[];

    // วันที่วางจำหน่าย (Nullable ได้ถ้าไม่รู้)
    @Column({ name: 'release_date', nullable: true })
    releaseDate: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // ความสัมพันธ์: เกมหนึ่งเกม ถูกจองได้หลายครั้ง (ในหลาย BookingItems)
    // (ปิดไว้ชั่วคราวตาม Code เดิม ถ้าต้องการใช้ค่อยเปิด)
    // @OneToMany(() => BookingItem, (bookingItem: BookingItem) => bookingItem.game)
    // bookingItems: BookingItem[];
}

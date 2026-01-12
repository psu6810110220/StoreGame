import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// 1. Enum สำหรับ Role (ตัวเลือกประเภทผู้ใช้)
// เพื่อบังคับว่าค่าต้องเป็น 'user' หรือ 'admin' เท่านั้น พิมพ์ผิดไม่ได้
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

// @Entity() บอก TypeORM ว่านี่คือตาราง 'user' ในฐานข้อมูล
@Entity()
export class User {
  // Primary Key (Running Number 1, 2, 3...)
  @PrimaryGeneratedColumn()
  id: number;

  // ชื่อผู้ใช้ (ห้ามซ้ำ)
  @Column({ unique: true })
  username: string;

  // อีเมล (เก็บเป็นข้อมูลเสริม, เป็น Null ได้เผื่อระบบยังไม่บังคับ)
  @Column({ unique: true, nullable: true })
  email: string;

  // รหัสผ่าน (ที่ถูก Hash แล้ว)
  @Column()
  password: string;

  // ชื่อจริง (Nullable ได้)
  @Column({ nullable: true })
  firstName: string;

  // นามสกุล (Nullable ได้)
  @Column({ nullable: true })
  lastName: string;

  // เบอร์โทร (ตั้งชื่อคอลัมน์ใน DB ว่า 'phone_number')
  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  // สิทธิ์ผู้ใช้งาน (Default เป็น USER)
  // เก็บเป็น Enum ใน Database ช่วยให้จัดการง่าย
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // วันที่สมัครสมาชิก (สร้างให้อัตโนมัติ)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // วันที่แก้ไขข้อมูลล่าสุด (อัปเดตให้อัตโนมัติ)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// 1. Enum สำหรับ Role (คงไว้เพื่อให้ Auth และ Guard ทำงานได้)
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // ✅ เพิ่มฟิลด์ username เพื่อให้ตรงกับหน้า Register
  @Column({ unique: true })
  username: string;

  // ✅ ปรับ email ให้เป็น nullable (เผื่อกรณีหน้าสมัครส่งแค่ username มาก่อน)
  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  password: string;

  // ✅ ปรับ firstName และ lastName ให้เป็น nullable เพื่อป้องกัน Error หากหน้าสมัครไม่ได้ส่งมา
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // 👇 ปิดไว้ก่อนเพื่อแก้ปัญหา metadata not found ตามเดิม
  // @OneToMany(() => Booking, (booking) => booking.user)
  // bookings: Booking[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
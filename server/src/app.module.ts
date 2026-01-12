import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <--- 1. โหลด ConfigModule เพื่อใช้อ่านไฟล์ .env
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- 2. โหลด TypeOrmModule เพื่อคุยกับ Database
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    // 3. ตั้งค่า ConfigModule ให้ทำงานแบบ Global (เรียกใช้ได้ทุกที่)
    // envFilePath: ระบุตำแหน่งไฟล์ .env ที่จะอ่านค่ามาใช้
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env', '.env'], // อ่านจากโฟลเดอร์แม่ หรือโฟลเดอร์ปัจจุบัน
    }),

    // 4. ตั้งค่าการเชื่อมต่อฐานข้อมูล (PostgreSQL)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT ?? '5432'),
      // ใช้ค่าจาก .env ถ้าไม่มีก็จะไม่ทำงาน (เพื่อความปลอดภัย)
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,

      // autoLoadEntities: true = โหลด Entity ทั้งหมดที่อยู่ใน Module ย่อยๆ อัตโนมัติ
      autoLoadEntities: true,
      // synchronize: true = แก้ไข Table ใน Database ให้ตรงกับ Code อัตโนมัติ (ห้ามใช้ใน Production!)
      synchronize: true,
    }),

    // 5. นำเข้า Module ย่อยๆ ของเราเข้ามาใน App หลัก
    UsersModule,    // ระบบผู้ใช้งาน
    AuthModule,     // ระบบล็อกอิน
    GamesModule,    // ระบบจัดการเกม
    BookingsModule, // ระบบจอง
  ],
  controllers: [AppController], // Controller ของ App หลัก (มักไม่ค่อยได้ใช้ถ้าโปรเจกต์ใหญ่)
  providers: [],       // Service ของ App หลัก
})
export class AppModule { }
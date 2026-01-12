import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // 1. สร้าง App (ตัวร้าน) ขึ้นมา
  // <NestExpressApplication> คือการบอก Generic ว่า "ร้านนี้ใช้ระบบ Express นะ"
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 2. เปิดโฟลเดอร์ให้คนเข้าถึงรูปภาพได้ (Serve Static Assets)
  // __dirname = ที่อยู่ไฟล์ปัจจุบัน
  // prefix: '/uploads/' = ถ้าพิมพ์ URL /uploads/ ให้มาหาไฟล์ที่โฟลเดอร์นี้
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 3. ปลดล็อค CORS (Cross-Origin Resource Sharing)
  // เพื่ออนุญาตให้ Frontend (เช่น Port 5173, 4000) ยิง Request เข้ามาหา Backend ได้
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5432', 'http://localhost:4000'],
    credentials: true, // อนุญาตให้พกบัตร (Token/Cookies) เข้ามาได้
  });

  // 4. ติดตั้งเครื่องตรวจจับ (Validation Pipe)
  // whitelist: true = ตัดข้อมูลขยะที่ไม่ได้อยู่ใน DTO ทิ้ง
  // transform: true = แปลงชนิดข้อมูลให้อัตโนมัติ (เช่น ส่ง '1' มา แปลงเป็น 1 ให้)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // 5. เปิดร้าน! รอรับลูกค้าที่ประตู 3000
  await app.listen(3000);
}
bootstrap();
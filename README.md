# Game Booking Store

## สมาชิกในกลุ่ม (Group Members)
1. รหัสนักศึกษา ชื่อ-นามสกุล
2. รหัสนักศึกษา ชื่อ-นามสกุล

## คำอธิบายโปรเจกต์ (Project Description)
ระบบจองเกมออนไลน์ (Game Booking Store) เป็นเว็บแอปพลิเคชันที่ช่วยให้ผู้ใช้งานสามารถเลือกดูและจองเกมที่ต้องการได้ โดยมีฟีเจอร์หลักดังนี้:
- **ระบบสมาชิก**: สมัครสมาชิก (Register), เข้าสู่ระบบ (Login)
- **การจัดการเกม**: แอดมินสามารถเพิ่ม ลบ และแก้ไขข้อมูลเกมได้
- **การจอง**: ผู้ใช้สามารถดูรายการเกมและทำการจองได้
- **หมวดหมู่เกม**: ค้นหาเกมตามหมวดหมู่
- **แดชบอร์ด**: แสดงรายการเกมและสถานะต่างๆ สำหรับทั้งผู้ใช้ทั่วไปและแอดมิน

## จุดเด่นทางเทคนิค (Technical Highlights) ✨
- **Modern UI/UX**: ดีไซน์แบบ **Glassmorphism** (กระจกฝ้า) ที่ทันสมัย พร้อมธีมสี Gradient ม่วง-ชมพู
- **Clean CSS Architecture**: ใช้ **Tailwind CSS v4** ร่วมกับการแยก Custom Classes (เช่น `.btn-gradient`, `.text-gradient`) ไว้ในไฟล์กลาง เพื่อลดความซ้ำซ้อนของโค้ด
- **Performance Optimized**: เอฟเฟกต์หิมะตก (Snow Effect) ใช้เทคนิค **CSS Box-Shadow** แทนการสร้าง Div จำนวนมาก เพื่อความลื่นไหล
- **Role-Based Access Control (RBAC)**: ระบบจัดการสิทธิ์ User/Admin ที่ปลอดภัยทั้งฝั่ง Frontend และ Backend

## โครงสร้างโปรเจกต์ (Project Structure)
- `/server`: Source code ของฝั่ง Server (NestJS) เชื่อมต่อกับฐานข้อมูล PostgreSQL
- `/client`: Source code ของฝั่ง Client (React + Vite)

## วิธีการรันโปรเจกต์ (How to Run)
1. **Database**: รัน PostgreSQL ด้วย Docker
   ```bash
   docker-compose up -d
   ```
2. **Backend**: เข้าไปที่โฟลเดอร์ server และรัน
   ```bash
   cd server
   npm install
   npm run start:dev
   ```
3. **Frontend**: เข้าไปที่โฟลเดอร์ client และรัน
   ```bash
   cd client
   npm install
   npm run dev
   ```

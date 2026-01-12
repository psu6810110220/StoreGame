# 🗺️ คัมภีร์อธิบายโค้ดฉบับสมบูรณ์ (The Ultimate Code Walkthrough)

เอกสารนี้รวบรวมรายชื่อไฟล์ **"ทุกไฟล์"** ในโปรเจกต์ เรียงลำดับตาม **Flow การทำงานจริง** เพื่อให้คุณอธิบายได้ครบถ้วนโดยไม่ตกหล่นแม้แต่ไฟล์เดียว

---

## 🏗️ PART 1: รากฐานและโครงสร้าง (Project Config & Core)
*เริ่มที่นี่เพื่อให้เห็นภาพรวมของการตั้งค่าโปรเจกต์*

### 1.1 ไฟล์ตั้งค่าระดับโปรเจกต์ (Root Configs)
*   📄 **`package.json`** (Front & Back): ใบรายการสินค้า บอกว่าโปรเจกต์นี้ใช้อะไรบ้าง (React, NestJS, Tailwind, TypeORM)
*   📄 **`tsconfig.json`**: กฎเหล็กของ TypeScript
*   📄 **`server/.env`**: ห้องความลับ (เก็บรหัส Database, JWT Secret)

### 1.2 จุดกำเนิด Backend (Server Core)
*   📄 **`server/src/main.ts`**: **[START]** เปิดประตูร้าน (Port 3000), ตั้งค่า CORS, และ Serve Static Files (รูปภาพ)
*   📄 **`server/src/app.module.ts`**: แผงวงจรหลัก รวมทุก Module เข้าด้วยกัน และเชื่อมต่อ Database

### 1.3 จุดกำเนิด Frontend (Client Core)
*   📄 **`client/index.html`**: ไฟล์ HTML หน้าแรกและหน้าเดียวของเว็บ (SPA)
*   📄 **`client/src/main.tsx`**: จุดเริ่ม React, แปะ `AuthProvider` เพื่อคุม Log in ทั้งเว็บ
*   📄 **`client/src/App.tsx`**: แผนที่นำทาง (Router) บอกว่า URL ไหนไปหน้าไหน
*   📄 **`client/src/index.css`**: ไฟล์แต่งตัวหลัก (Tailwind Imports & Custom Animations)

---

## 🔐 PART 2: ระบบยืนยันตัวตน (Authentication Module)
*หัวใจสำคัญของความปลอดภัย ไล่จากหลังบ้านมาหน้าบ้าน*

### 2.1 Backend: Auth Module
*   📄 **`server/src/auth/auth.controller.ts`**: หน้าด่านรับ Request (`POST /login`, `/register`)
*   📄 **`server/src/auth/auth.service.ts`**: **[CORE]** ตรวจสอบรหัสผ่าน (Compare Hash) และออกบัตร JWT
*   📄 **`server/src/auth/auth.module.ts`**: มัดรวม Controller + Service และตั้งค่า JWT
*   📄 **`server/src/auth/dto/login-user.dto.ts`**: กฎการส่งข้อมูล Login (ต้องมี username, password)
*   📄 **`server/src/auth/jwt.strategy.ts`**: เครื่องตรวจบัตร ยืนยันว่า Token ที่ส่งมาเป็นของจริง
*   📄 **`server/src/auth/jwt-auth.guard.ts`**: ยามเฝ้าประตู (ใช้แปะหน้า Controller ที่ต้องการล็อกอิน)
*   📄 **`server/src/auth/roles.guard.ts`**: ยามเฝ้าห้อง VIP (เช็คว่าเป็น Admin หรือไม่)
*   📄 **`server/src/auth/roles.decorator.ts`**: ป้ายแปะ VIP (`@Roles('admin')`)

### 2.2 Backend: Users Module (ผู้ช่วยของ Auth)
*   📄 **`server/src/users/users.service.ts`**: ค้นหา User ใน Database (FindOne)
*   📄 **`server/src/users/entities/user.entity.ts`**: ตาราง Users (เก็บ Username, Password, Role)
*   📄 **`server/src/users/dto/create-user.dto.ts`**: กฎการสมัครสมาชิก

### 2.3 Frontend: Auth Integration
*   📄 **`client/src/context/AuthContext.tsx`**: ระบบจำ User (Login/Logout/Auto-Rehydrate)
*   📄 **`client/src/pages/Login.tsx`**: หน้าจอ Login (Glassmorphism UI)
*   📄 **`client/src/pages/Register.tsx`**: หน้าจอสมัครสมาชิก

---

## 🎮 PART 3: ระบบจัดการเกม (Games Module)
*ฟีเจอร์หลักสำหรับ Admin*

### 3.1 Backend: Games Module
*   📄 **`server/src/games/games.controller.ts`**: รับคำสั่ง CRUD เกม (เพิ่ม/ลบ/แก้ไข)
*   📄 **`server/src/games/games.service.ts`**: ลงมือทำงานกับ Database
*   📄 **`server/src/games/entities/game.entity.ts`**: ตาราง Games (Title, Price, ImageUrl)
*   📄 **`server/src/games/dto/create-game.dto.ts`**: แบบฟอร์มสร้างเกม
*   📄 **`server/src/games/dto/update-game.dto.ts`**: แบบฟอร์มแก้ไขเกม (Optional Fields)
*   📄 **`server/src/games/games.module.ts`**: กล่องรวมอุปกรณ์ Games
*   📄 **`server/src/seed-games.ts`**: สคริปต์เสกเกมเริ่มต้น (Run ครั้งแรก)

### 3.2 Frontend: Game Management
*   📄 **`client/src/pages/GameManagement.tsx`**: **[FEATURE]** หน้า Admin จัดการเกม (มี Table, Modal, Upload)
*   📄 **`client/src/services/games.service.ts`**: ตัวยิง API ไปหา Backend (`fetch('/games')`)
*   📄 **`client/src/components/GameList.tsx`**: การ์ดแสดงรายการเกม (ใช้ใน Dashboard)

---

## 🛒 PART 4: ระบบการจอง (Bookings Module)
*ฟีเจอร์หลักสำหรับลูกค้า (User)*

### 4.1 Backend: Bookings Module
*   📄 **`server/src/bookings/bookings.controller.ts`**: รับจอง (`POST /bookings`)
*   📄 **`server/src/bookings/bookings.service.ts`**: คำนวณราคา, บันทึกลง DB
*   📄 **`server/src/bookings/entities/booking.entity.ts`**: ใบสั่งซื้อ (Header)
*   📄 **`server/src/bookings/entities/booking-item.entity.ts`**: รายการสินค้าในใบสั่งซื้อ (Detail)
*   📄 **`server/src/bookings/dto/create-booking.dto.ts`**: ข้อมูลหน้าบิลที่ส่งมา

### 4.2 Frontend: Shopping Experience
*   📄 **`client/src/pages/Dashboard.tsx`**: หน้าร้าน (แสดง GameList)
*   📄 **`client/src/context/CartContext.tsx`**: **[NEW]** ตะกร้าสินค้า (Add to Cart logic)
*   📄 **`client/src/pages/BookingSummary.tsx`**: หน้าสรุปก่อนจ่ายเงิน (Cart Review)
*   📄 **`client/src/pages/MyBookings.tsx`**: หน้าดูประวัติการซื้อของฉัน
*   📄 **`client/src/services/bookings.service.ts`**: ตัวยิง API จองเกม

---

## 👮 PART 5: แอดมินและผู้ใช้งาน (Admin & User Mgmt)
*   📄 **`server/src/users/users.controller.ts`**: API จัดการคน (เช่น ลบ User)
*   📄 **`client/src/pages/UserManagement.tsx`**: หน้าแอดมินดูรายชื่อสมาชิก
*   📄 **`client/src/pages/BookingManagement.tsx`**: หน้าแอดมินดูยอดขายทั้งหมด
*   📄 **`client/src/services/users.service.ts`**: ตัวยิง API จัดการ User

---

## 🎨 PART 6: ส่วนเสริมและความงาม (Utilities & UI)
*   📄 **`client/src/components/SnowBackground.tsx`**: เอฟเฟกต์หิมะ (Animation)
*   📄 **`client/src/types.ts`**: พจนานุกรมกลาง (Interface User, Game, Booking)
*   📄 **`server/src/index.ts`**: (ถ้ามี) ไฟล์ Export รวมของ Entities

---
**✅ คำแนะนำ:** อธิบายตามลำดับนี้จะครบถ้วนที่สุดครับ โดยเริ่มจาก **Flow ของข้อมูล** เช่น:
1.  User กรอกหน้า **Login.tsx**
2.  วิ่งไป **AuthContext**
3.  ยิงไป **AuthController**
4.  เช็ค **AuthService**
5.  ถาม **UserEntity**
6.  ตอบกลับมาที่ **Dashboard**

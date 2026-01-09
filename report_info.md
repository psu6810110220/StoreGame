# ข้อมูลสำหรับรายงานโครงงาน (Project Report Materials)

## 1. คำอธิบายเกี่ยวกับโปรเจกต์โดยสังเขป (Project Description)
ระบบจองเกมออนไลน์ (Game Booking Store) เป็นเว็บแอปพลิเคชันที่พัฒนาขึ้นเพื่ออำนวยความสะดวกในการค้นหาและจองเกมที่ผู้ใช้สนใจ โดยระบบรองรับการทำงานทั้งฝั่งผู้ดูแลระบบ (Admin) และผู้ใช้งานทั่วไป (User)
โครงสร้างโปรเจกต์ประกอบด้วย:
- **Backend (Server)**: พัฒนาด้วย **NestJS** เป็นเฟรมเวิร์ก Node.js ที่เน้นโครงสร้างแบบ Modular เชื่อมต่อฐานข้อมูล **PostgreSQL** ผ่าน **TypeORM**
- **Frontend (Client)**: พัฒนาด้วย **React** (Vite) ใช้ **Tailwind CSS** ในการตกแต่งหน้าตาเว็บไซต์ให้ทันสมัย

## 2. การเชื่อมโยงคำสั่ง AI กับโค้ดที่ได้ (AI Prompts & Generated Code)

### Prompt 1: "Implement Remember Me" (ระบบจำฉันไว้)
**ความสำคัญ**: เพิ่มความสะดวกสบายให้ผู้ใช้ไม่ต้องล็อกอินใหม่
*   **สิ่งที่ AI ทำ**:
    *   แก้ไข `Login.tsx` เพิ่ม Checkbox เพื่อรับค่า `rememberMe`
    *   แก้ไข `AuthContext.tsx` ให้มี Logic ตัดสินใจว่าถ้าเลือก Remember Me จะบันทึก Token ลง `localStorage` (อยู่ถาวรจนกว่าจะลบ), แต่ถ้าไม่เลือกจะเก็บใน `sessionStorage` (หายเมื่อปิดเบราว์เซอร์)

### Prompt 2: "Game Categories Feature" (ระบบหมวดหมู่เกม)
**ความสำคัญ**: ช่วยให้จัดการและค้นหาเกมได้ง่ายขึ้น
*   **สิ่งที่ AI ทำ**:
    *   **Backend**: เพิ่ม Entity Field `category` ใน `Game` entity และอัปเดต DTO (`CreateGameDto`, `UpdateGameDto`) เพื่อรองรับข้อมูลชุดใหม่
    *   **Frontend**: แก้ไขตารางใน `GameManagement.tsx` ให้แสดง Badge หมวดหมู่ และเพิ่ม Logic การกรอง (Filter) ใน `GameList.tsx`

### Prompt 3: "Refine UI And Handle Git Push" (ปรับแต่ง UI ให้สวยงามระดับพรีเมียม)
**ความสำคัญ**: คำสั่งนี้คือจุดเปลี่ยนที่ทำให้หน้าเว็บมีหน้าตา Modern (Glassmorphism), มีธีมเทศกาล (Snow Effect), และการใช้ Gradient สี
*   **สิ่งที่ AI ทำ**:
    *   สร้าง Component `SnowBackground.tsx` เพื่อทำ Effect หิมะตก
    *   ปรับแก้ CSS Class ใน `Dashboard.tsx` และ `GameManagement.tsx` ให้ใช้ `backdrop-blur-md`, `bg-slate-800/50` (Glass Effect) และ `bg-gradient-to-r` เพื่อความสวยงาม

### Prompt 4: "Admin Role & Access Control" (ระบบสิทธิ์ผู้ใช้งาน)
**ความสำคัญ**: ความปลอดภัยและการแบ่งแยกหน้าที่
*   **สิ่งที่ AI ทำ**:
    *   **Backend**: ใน `users.service.ts` มีการสร้าง Seed Admin (Auto-create admin user) เมื่อรันระบบครั้งแรก
    *   **Frontend**: ใน `Dashboard.tsx` ใช้เงื่อนไข `{user.role === 'admin' && ...}` เพื่อซ่อน/แสดงปุ่มเมนูจัดการร้านค้า

## 3. เจาะลึกการทำงานของไฟล์สำคัญ (Detailed Code Explanation)

### 📂 ฝั่ง Server (Backend)

#### 1. `server/src/auth/auth.service.ts` (บริการยืนยันตัวตน)
ทำหน้าที่เหมือนยามเฝ้าประตู:
*   `validateUser(username, pass)`: ฟังก์ชันนี้จะรับชื่อผู้ใช้และรหัสผ่านดิบๆ มา แล้วใช้ `bcrypt.compare()` เพื่อเช็คกับรหัสผ่านที่เข้ารหัส (Hash) ในฐานข้อมูล ถ้าตรงกันถึงจะปล่อยผ่าน
*   `login(user)`: เมื่อยืนยันตัวตนผ่าน ฟังก์ชันนี้จะสร้าง **JWT Token** (เหมือนบัตรผ่านทาง) โดยในบัตรจะระบุ `id`, `username`, และ `role` เพื่อให้ผู้ใช้นำไปยื่นเวลาจะขอข้อมูลอื่นๆ

#### 2. `server/src/users/users.service.ts` (บริการจัดการผู้ใช้)
ทำหน้าที่ดูแลข้อมูลพนักงานและลูกค้า:
*   `seedAdmin()`: (ทำงานอัตโนมัติเมื่อเริ่ม Server) เช็คว่ามี Admin ชื่อ 'superadmin' หรือยัง ถ้าไม่มีจะสร้างให้ทันที เพื่อป้องกันปัญหาระบบไม่มีคนดูแล
*   `create(createUserDto)`: สมัครสมาชิกใหม่ โดยสิ่งสำคัญคือบรรทัด `role: UserRole.USER` ที่กำหนดให้ทุกคนที่สมัครเองเป็น User ธรรมดาเสมอเพื่อความปลอดภัย

#### 3. `server/src/games/games.service.ts` (บริการคลังสินค้า)
ทำหน้าที่จัดการสต็อกเกม:
*   `findAll()`: ดึงข้อมูลเกมทั้งหมดจากตารางใน DB
*   `update(id, data)`: รับข้อมูลใหม่มาแก้ไข โดยใช้ `Object.assign` เพื่อเคลือบข้อมูลเก่า แล้วสั่ง Save ลง DB

### 📂 ฝั่ง Client (Frontend)

#### 1. `client/src/context/AuthContext.tsx` (ศูนย์กลางข้อมูลผู้ใช้)
ทำหน้าที่เหมือนกระเป๋าสตางค์ที่เก็บ "บัตรผ่าน" (Token):
*   **Persistence (การคงสภาพ)**: ใช้ `useEffect` ทำงานทันทีที่เปิดเว็บ เพื่อเช็ค `localStorage` ว่ามี Token ค้างอยู่ไหม ถ้ามีให้เอามาใส่ใน State (`setUser`) ทันที ทำให้กด Refresh แล้วไม่หลุด
*   **Login Function**: รับ Token มาเก็บ และเลือกว่าจะเก็บลง LocalStorage หรือ SessionStorage ตาม Checkbox 'Remember Me'

#### 2. `client/src/pages/Dashboard.tsx` (หน้าควบคุมหลัก)
ทำหน้าที่เป็นหน้าจอหลักที่รวมทุกอย่าง:
*   **Role-Based Rendering**: บรรทัด `{user?.role === 'admin' && (...)}` คือ Logic สำคัญที่บอกว่า "ถ้าเป็น Admin ถึงจะเห็นส่วนควบคุมนี้" ทำให้เราใช้หน้า Dashboard เดียวกันได้ทั้ง Admin และ User
*   **Layout Structure**: แบ่งเป็น Navbar (บน), Status Section (แสดงชื่อ/Role), Admin Panel (ซ่อน/แสดง), และ Game List (รายการสินค้า)

#### 3. `client/src/pages/GameManagement.tsx` (หน้าจัดสต็อกเฉพาะ Admin)
*   **State Management**: ใช้ `useState` เก็บข้อมูลฟอร์ม (`formData`) สำหรับเพิ่ม/แก้ไขเกม
*   **Preview Image**: มีการทำ Real-time Preview รูปภาพปกเกมทันทีที่ Admin กรอก URL
*   **Category Filter**: มีปุ่มกดเลือก Filter หมวดหมู่แบบ `toggle` (เลือกได้หลายอัน) เพื่อกรองดูรายการเกมในตาราง

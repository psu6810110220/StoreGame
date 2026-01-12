# 📖 คัมภีร์อธิบายโค้ดฉบับจับมือทำ (Beginner Guide to StoreGame Code)

เอกสารนี้จะพาคุณทัวร์โค้ดทุกส่วนของโปรเจกต์ **StoreGame** อธิบายแบบภาษาคนเข้าใจง่าย เปรียบเทียบกับสิ่งรอบตัว พร้อมช่องทางลัดให้กดเข้าไปดูโค้ดจริงได้เลย!

---

## 🏗️ ภาพรวม: ร้านอาหารตามสั่ง (The Big Picture)

ให้มองว่าเว็บไซต์ของเราคือ **"ร้านอาหารตามสั่ง"** ครับ
1.  **Backend (Server)** = **"ในครัว"** (พ่อครัว, ตู้เย็น, คนคิดเงิน)
2.  **Frontend (Client)** = **"หน้าร้าน & โต๊ะอาหาร"** (เมนู, พนักงานเสิร์ฟ, จานชาม)
3.  **Database** = **"ตู้เย็นยักษ์"** (ที่เก็บวัตถุดิบและข้อมูลทั้งหมด)

---

## 🍳 ส่วนที่ 1: ในครัว (Backend - NestJS)

ไฟล์ทั้งหมดจะอยู่ที่โฟลเดอร์ `server` ครับ นี่คือสมองของร้าน

### 1. จุดเริ่มต้น (ประตูครัว)
*   **[main.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/main.ts)**
    *   **คืออะไร**: กุญแจดอกแรกที่ใช้เปิดร้าน
    *   **ทำอะไร**: สั่งให้ Server เริ่มทำงานที่ Port 3000 (เหมือนเปิดประตูร้าน), ตั้งค่า CORS (อนุญาตให้ลูกค้ากลุ่มไหนเข้าได้บ้าง), เปิดระบบตรวจสอบความถูกต้อง (ValidationPipe)

### 2. สมองหลัก (ผู้จัดการร้าน)
*   **[app.module.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/app.module.ts)**
    *   **คืออะไร**: แผนผังองค์กร
    *   **ทำอะไร**: บอกว่าร้านนี้มีแผนกอะไรบ้าง (Auth, Games, Users, Bookings) และเชื่อมต่อกับตู้เย็น (Database) ยังไง

### 3. แผนกต่างๆ (Modules)

#### 🛡️ แผนก รปภ. (Auth Module) - ดูแลเรื่องเข้า/ออก
*   **[auth.service.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/auth/auth.service.ts)**
    *   **คืออะไร**: หัวหน้า รปภ.
    *   **ทำอะไร**: เช็คว่า "สมุดพก" (Token) ที่ยื่นมาเป็นของจริงไหม, ตรวจรหัสผ่าน login ว่าตรงกับในฐานข้อมูลไหม
*   **[jwt.strategy.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/auth/jwt.strategy.ts)**
    *   **คืออะไร**: เครื่องสแกนบัตร
    *   **ทำอะไร**: คอยดักจับทุกคำขอ และอ่านข้อมูลจาก Token (ที่แนบมาใน Header)
*   **[auth.controller.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/auth/auth.controller.ts)**
    *   **คืออะไร**: เคาน์เตอร์ติดต่อ รปภ.
    *   **ทำอะไร**: รับเรื่อง `POST /auth/login` หรือ `POST /auth/register`

#### 🎮 แผนกคลังสินค้า (Games Module) - ดูแลสินค้าเกม
*   **[game.entity.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/entities/game.entity.ts)**
    *   **คืออะไร**: แบบฟอร์มสินค้า
    *   **ทำอะไร**: กำหนดว่า "เกม 1 เกม" ต้องมีข้อมูลอะไรบ้าง (ชื่อ, ราคา, รูปภาพ, สต็อก)
*   **[games.controller.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/games/games.controller.ts)**
    *   **คืออะไร**: พนักงานรับออเดอร์
    *   **ทำอะไร**: รับคำสั่งเช่น "ขอดูเกมทั้งหมดหน่อย" (`GET /games`) หรือ "เพิ่มเกมใหม่หน่อย" (`POST /games`)
*   **[games.service.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/games/games.service.ts)**
    *   **คืออะไร**: พนักงานคลังสินค้า
    *   **ทำอะไร**: เดินไปหยิบของในตู้เย็น (Database), ตัดสต็อก, หรือเอาของใหม่วางบนชั้น

#### 🛒 แผนกบัญชีและการขาย (Bookings Module) - ดูแลการจอง
*   **[booking.entity.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/entities/booking.entity.ts)**
    *   **คืออะไร**: ใบเสร็จรับเงิน
    *   **ทำอะไร**: เก็บข้อมูลว่า ใครซื้อ? ซื้อเมื่อไหร่? จ่ายเงินหรือยัง?
*   **[bookings.service.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/bookings/bookings.service.ts)**
    *   **คืออะไร**: พนักงานบัญชี
    *   **ทำอะไร**:
        *   คำนวณราคารวม
        *   **สำคัญมาก**: ล็อคของ (Transaction) เพื่อไม่ให้คนซื้อชนกัน (ตัดสต็อกอย่างแม่นยำ)

---

## 🍽️ ส่วนที่ 2: หน้าร้าน (Frontend - React)

ไฟล์ทั้งหมดอยู่ที่ `client` ครับ นี่คือสิ่งที่ลูกค้า (User) เห็นและกดเล่น

### 1. ประตูหน้าร้าน
*   **[main.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/main.tsx)**
    *   **คืออะไร**: จุดแรกที่ลูกค้าเดินเข้า
    *   **ทำอะไร**: เอา React ไปแปะลงในหน้าเว็บ (`root`)
*   **[App.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/App.tsx)**
    *   **คืออะไร**: ป้ายบอกทาง
    *   **ทำอะไร**: บอกว่าถ้าพิมพ์ URL นี้ ให้ไปโผล่หน้าจอไหน (Routing) เช่น `/login` ไปหน้า Login

### 2. สมองส่วนกลาง (Context)
*   **[AuthContext.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/context/AuthContext.tsx)**
    *   **คืออะไร**: บัตรสมาชิกที่พกติดตัวตลอด
    *   **ทำอะไร**: จำว่า "ตอนนี้ใคร Login อยู่?", "มีสิทธิ์เป็น Admin ไหม?". ถ้ากด F5 (Refresh) ก็จะมาเช็คที่นี่แหละว่ายัง Login อยู่หรือเปล่า (ใช้ `useEffect` เช็ค LocalStorage)
*   **[CartContext.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/context/CartContext.tsx)**
    *   **คืออะไร**: ตะกร้าช้อปปิ้งส่วนตัว
    *   **ทำอะไร**: จำว่าเราหยิบเกมอะไรใส่มือไว้บ้าง ก่อนที่จะกดจ่ายเงิน

### 3. พนักงานวิ่งส่งของ (Services)
*   **[games.service.ts](file:///c:/Users/Windows%2011/StoreGame/client/src/services/games.service.ts)**
*   **[bookings.service.ts](file:///c:/Users/Windows%2011/StoreGame/client/src/services/bookings.service.ts)**
    *   **คืออะไร**: คนวิ่งเอกสาร
    *   **ทำอะไร**: รับคำสั่งจากหน้าจอ (Page) แล้ววิ่งไปคุยกับหลังร้าน (API/Backend) ผ่าน `fetch` หรือ `axios` แล้ววิ่งกลับมารายงานผล

### 4. หน้าจอต่างๆ (Pages)

#### 🏠 หน้าแรก (Dashboard)
*   **[Dashboard.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/pages/Dashboard.tsx)**
    *   **คืออะไร**: แผงควบคุมหลัก
    *   **ทำอะไร**:
        *   แสดงเมนูบาร์ (Navbar)
        *   ถ้าเป็น Admin จะโชว์ปุ่มพิเศษ (Manage Games, Manage Users)
        *   เรียก Component `GameList` มาโชว์รายการเกม

#### 📝 หน้าจัดการของผู้ดูแล (Admins)
*   **[GameManagement.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/pages/GameManagement.tsx)**
    *   **ทำอะไร**: ตารางรายชื่อเกม มีปุ่ม แก้ไข/ลบ และฟอร์มเพิ่มเกมใหม่
*   **[BookingManagement.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/pages/BookingManagement.tsx)**
    *   **ทำอะไร**: ตารางดูว่าใครจองอะไรมาบ้าง กดเปลี่ยนสถานะได้ (Pending -> Paid)

#### 👤 หน้าลูกค้า (Users)
*   **[MyBookings.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/pages/MyBookings.tsx)**
    *   **ทำอะไร**: ดึงประวัติการจองของ "ตัวเอง" มาดู (ใช้ `getMyBookings` จาก service)

### 5. ของตกแต่ง (Components)
*   **[SnowBackground.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/components/SnowBackground.tsx)**
    *   **คืออะไร**: วอลเปเปอร์หิมะ
    *   **ทำอะไร**: ใช้ CSS วาดจุดสีขาวๆ แล้วสั่ง `animation` ให้มันไหลลงมาเรื่อยๆ (ไม่ได้ใช้ Javascript คำนวณเยอะ เพื่อความลื่น)

---

## 🛠️ วิธีการอ่านโค้ดให้เข้าใจ
1.  **เริ่มจาก "หน้าจอ" (Page)**: ดูว่าหน้านั้นมัน import service อะไรมาบ้าง
2.  **ตามไปดู "Service"**: ดูว่ามันยิงไปที่ URL ไหนของ Server
3.  **กระโดดไป "Controller" (Backend)**: ดูว่า URL นั้นใครเป็นคนรับเรื่อง
4.  **ดู "Service" (Backend)**: ดูว่าเขาไปหยิบข้อมูลจาก Database ยังไง

ขอให้สนุกกับการเรียนรู้นะครับ! ถ้าสงสัยจุดไหน จิ้มลิ้งก์เข้าไปดูไส้ในได้เลย! 🚀👨‍💻

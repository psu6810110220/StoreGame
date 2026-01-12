# รายละเอียดโครงสร้างโปรเจกต์และหน้าที่ของไฟล์แบบเจาะลึก (Deep Dive Project Structure)

เอกสารนี้อธิบายหน้าที่ของแต่ละไฟล์ในระดับ **โค้ดและการทำงาน (Logic)** อย่างละเอียด พร้อม **ตัวอย่างโค้ด (Code Reference)** ประกอบ

---

## 🟢 ส่วนที่ 1: Server (`/server`) - NestJS Backend
ทำหน้าที่เป็นสมองของระบบ จัดการข้อมูลและ Logic ทั้งหมด

### **📁 /src/auth (ระบบความปลอดภัยและการเข้าสู่ระบบ)**

###### **1. [auth.service.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/auth/auth.service.ts)**
*   **หน้าที่หลัก**: Logic การยืนยันตัวตน (Authentication)
*   **การทำงาน (Code Reference)**: 
    *   **[ตรวจสอบรหัสผ่าน (validateUser)](file:///c:/Users/Windows%2011/StoreGame/server/src/auth/auth.service.ts#L33)**: ใช้ `bcrypt` เทียบรหัสผ่านที่กรอกมา กับรหัสที่เข้ารหัสไว้ในฐานข้อมูล
    *   **[สร้าง Token (login)](file:///c:/Users/Windows%2011/StoreGame/server/src/auth/auth.service.ts#L51)**: บรรจุข้อมูล User ID และ Role ลงใน JWT Token
#### **2. [jwt.strategy.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/auth/jwt.strategy.ts)**
*   **หน้าที่หลัก**: ดักจับและแกะ Token (Strategy)
*   **การทำงาน (Code Reference)**:
    *   **[ดึง Token จาก Header](file:///c:/Users/Windows%2011/StoreGame/server/src/auth/jwt.strategy.ts#L15)**:

#### **3. [roles.guard.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/auth/roles.guard.ts)**
*   **หน้าที่หลัก**: ตรวจสอบสิทธิ์การใช้งาน (Authorization)
*   **การทำงาน (Code Reference)**:
    *   **[เช็ค Role (roles.guard.ts)](file:///c:/Users/Windows%2011/StoreGame/server/src/auth/roles.guard.ts#L10)**: เปรียบเทียบ Role ของ User กับ Role ที่ API ต้องการ

### **📁 /src/users (ระบบผู้ใช้งาน)**

#### **1. [users.service.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/users/users.service.ts)**
*   **หน้าที่หลัก**: จัดการข้อมูล User ใน Database
*   **การทำงาน (Code Reference)**:
    *   **[สร้าง Admin อัตโนมัติ (seedAdmin)](file:///c:/Users/Windows%2011/StoreGame/server/src/users/users.service.ts#L20)**: ทำงานตอนเริ่ม Server (`onModuleInit`)

### **📁 /src/games (ระบบเกม)**

#### **1. [games.controller.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/games/games.controller.ts)**
*   **หน้าที่หลัก**: API Endpoints สำหรับเกม
*   **การทำงาน (Code Reference)**:
    *   **[จำกัดสิทธิ์ Admin (@Roles)](file:///c:/Users/Windows%2011/StoreGame/server/src/games/games.controller.ts#L18)**: ใช้ Decorator `@Roles` เพื่อล็อก API

#### **2. [game.entity.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/entities/game.entity.ts)**
*   **หน้าที่หลัก**: โครงสร้างตาราง Game ใน Database
*   **การทำงาน (Code Reference)**:
    *   **[กำหนด Column (game.entity.ts)](file:///c:/Users/Windows%2011/StoreGame/server/src/entities/game.entity.ts#L9)**:
    
### **📁 /src/payments (ระบบการชำระเงิน) [NEW]**

#### **1. [payments.module.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/payments/payments.module.ts)**
*   **หน้าที่หลัก**: รวม Components ของระบบจ่ายเงิน
*   **การทำงาน**: ลงทะเบียน `PaymentsController` และ `PaymentsService` รวมถึงเชื่อมต่อกับ TypeORM

#### **2. [payments.controller.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/payments/payments.controller.ts)**
*   **หน้าที่หลัก**: API Endpoints สำหรับการแจ้งชำระเงิน
*   **การทำงาน**:
    *   `POST /payments/upload-slip`: รับไฟล์สลิปโอนเงิน
    *   `POST /payments`: บันทึกข้อมูลการโอนเงิน (ผูกกับ Booking ID)

#### **3. [payments.service.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/payments/payments.service.ts)**
*   **หน้าที่หลัก**: Business Logic ของการจ่ายเงิน
*   **การทำงาน**:
    *   ตรวจสอบความถูกต้องของ Booking (ยอดเงินตรงไหม, สถานะปัจจุบัน)
    *   บันทึกข้อมูลและอัปเดตสถานะ Booking เป็น `PAID` หรือ `PENDING_REVIEW`

#### **4. [payment.entity.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/entities/payment.entity.ts)**
*   **หน้าที่หลัก**: ตารางเก็บข้อมูล Payment
*   **Structure**:
    *   `amount`: จำนวนเงินที่โอน
    *   `slipUrl`: ลิงก์รูปภาพสลิป
    *   `booking`: ความสัมพันธ์ One-to-One กับตาราง Booking

### **📁 /src/dashboard (ระบบสรุปผลข้อมูล) [NEW]**

#### **1. [dashboard.module.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/dashboard/dashboard.module.ts)**
*   **หน้าที่หลัก**: รวบรวม Dependencies จาก Module อื่นๆ (Users, Bookings, Games)
*   **การทำงาน**: Import Services ที่จำเป็นเข้ามาเพื่อประมวลผลข้อมูล

#### **2. [dashboard.controller.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/dashboard/dashboard.controller.ts)**
*   **หน้าที่หลัก**: API Endpoints สำหรับข้อมูลกราฟและสถิติ
*   **การทำงาน**:
    *   `GET /dashboard/stats`: ดึงข้อมูลสรุป (ยอดขายรวม, จำนวน User, จำนวน Booking)
    *   `GET /dashboard/revenue-chart`: ดึงข้อมูลกราฟรายได้รายเดือน/รายวัน

#### **3. [dashboard.service.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/dashboard/dashboard.service.ts)**
*   **หน้าที่หลัก**: คำนวณและประมวลผลสถิติ
*   **การทำงาน**:
    *   `getSummary()`: Query นับจำนวน Users, Bookings และ Sum ยอดเงินจาก Payment
    *   `getDailyRevenue()`: Query ยอดขายแยกตามวันเพื่อนำไปพล็อตกราฟ

---

## 🔵 ส่วนที่ 2: Client (`/client`) - React Frontend
ทำหน้าที่แสดงผลและโต้ตอบกับผู้ใช้ พัฒนาด้วย **React (Vite 5)** + **Tailwind CSS**

### **📁 / (Configuration & Style)**

#### **1. [tailwind.config.js](file:///c:/Users/Windows%2011/StoreGame/client/tailwind.config.js)**
*   **หน้าที่หลัก**: กำหนด Theme สีและ Font ของทั้งเว็บ (Design System)
*   **การทำงาน (Code Reference)**:
    *   **[Custom Colors](file:///c:/Users/Windows%2011/StoreGame/client/tailwind.config.js#L1)**: กำหนดสีหลัก (Primary) และสีรอง (Secondary) เพื่อให้เรียกใช้ง่ายๆ เช่น `bg-primary`, `text-secondary`

#### **2. [index.css](file:///c:/Users/Windows%2011/StoreGame/client/src/index.css)**
*   **หน้าที่หลัก**: ไฟล์ CSS หลักที่เรียกใช้ Tailwind
*   **การทำงาน**:
    ```css
    @import "tailwindcss";

    @layer utilities {
      /* Custom Gradients & Utilities (Clean Architecture) */
      .text-gradient-store {
        background: linear-gradient(to right, #818cf8, #c084fc);
        -webkit-background-clip: text;
        color: transparent;
      }
      .btn-gradient-primary {
        background: linear-gradient(to right, #4f46e5, #9333ea);
      }
      .z-modal-overlay {
        z-index: 60;
      }
    }
    ```

### **📁 /src (Entry & Routing)**

#### **1. [App.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/App.tsx)**
*   **หน้าที่หลัก**: จัดการเส้นทาง (Route) และการป้องกันหน้าเว็บ
*   **การทำงาน (Code Reference)**:
    *   **[Protected Route](file:///c:/Users/Windows%2011/StoreGame/client/src/App.tsx#L13)**: เช็คว่ามี Token ไหม ถ้าไม่มีให้ดีดกลับไป Login

### **📁 /src/services (การเชื่อมต่อ API) [NEW]**

#### **1. [auth.service.ts](file:///c:/Users/Windows%2011/StoreGame/client/src/services/auth.service.ts)**
*   **หน้าที่**: ยิง API Login/Register
*   **โค้ด**: `axios.post('/auth/login', ...)`

#### **2. [games.service.ts](file:///c:/Users/Windows%2011/StoreGame/client/src/services/games.service.ts)**
*   **หน้าที่**: ดึงข้อมูลเกม, สร้างเกมใหม่
*   **โค้ด**: `fetch('/games', ...)`

#### **3. [bookings.service.ts](file:///c:/Users/Windows%2011/StoreGame/client/src/services/bookings.service.ts)**
*   **หน้าที่**: จองเกม, ดึงประวัติการจอง
*   **โค้ด**: `fetch('/bookings', ...)`

#### **4. [payments.service.ts](file:///c:/Users/Windows%2011/StoreGame/client/src/services/payments.service.ts) [PLANNED]**
*   **หน้าที่**: อัปโหลดสลิปเงิิน
*   **การทำงาน**:
    *   `uploadSlip(file)`: ส่งไฟล์ภาพไปที่ `/payments/upload-slip`
    *   `confirmPayment(bookingId)`: แจ้งยืนยันการโอน

#### **5. [dashboard.service.ts](file:///c:/Users/Windows%2011/StoreGame/client/src/services/dashboard.service.ts) [PLANNED]**
*   **หน้าที่**: ดึงข้อมูลสถิติมาแสดงบน Dashboard
*   **การทำงาน**:
    *   `getStats()`: ดึงยอดขายรวม, จำนวน User
    *   `getRevenueChart()`: ดึงข้อมูลกราฟ

### **📁 /src/context (การจัดการข้อมูลส่วนกลาง)**

#### **1. [AuthContext.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/context/AuthContext.tsx)**
*   **หน้าที่**: เก็บสถานะการ Login
*   **การทำงาน (Code Reference)**:
    *   **[บันทึก Token (login)](file:///c:/Users/Windows%2011/StoreGame/client/src/context/AuthContext.tsx#L54)**:

#### **2. [CartContext.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/context/CartContext.tsx)**
*   **หน้าที่**: ตะกร้าสินค้า
*   **การทำงาน (Code Reference)**:
    *   **[เพิ่มสินค้า (addToCart)](file:///c:/Users/Windows%2011/StoreGame/client/src/context/CartContext.tsx#L38)**:

### **📁 /src/pages (หน้าจอและการทำงาน)**

#### **1. [Dashboard.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/pages/Dashboard.tsx)**
*   **หน้าที่**: หน้าหลัก Dashboard
*   **การทำงาน (Code Reference)**:
    *   **[แยกเมนู Admin](file:///c:/Users/Windows%2011/StoreGame/client/src/pages/Dashboard.tsx#L87)**:

#### **2. [MyBookings.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/pages/MyBookings.tsx)**
*   **หน้าที่**: หน้าประวัติการจอง
*   **การทำงาน (Code Reference)**:
    *   **[ดึงข้อมูล (useEffect)](file:///c:/Users/Windows%2011/StoreGame/client/src/pages/MyBookings.tsx#L36)**:

#### **3. [BookingManagement.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/pages/BookingManagement.tsx)**
*   **หน้าที่**: หน้าจัดการการจอง (Admin)
*   **การทำงาน (Code Reference)**:
    *   **อนุมัติจ่ายเงิน (`handlePaymentAction`)**:
        ```typescript
        await updatePaymentStatus(token, id, 'PAID');
        if (action === 'APPROVE') {
            await updateBookingStatus(token, id, 'CONFIRMED'); // Auto-confirm เมื่อจ่ายเงินแล้ว
        }
        ```

#### **4. [GameManagement.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/pages/GameManagement.tsx)**
*   **หน้าที่**: หน้าจัดการเกม (Admin)
*   **การทำงาน (Code Reference)**:
    *   **[Preview รูปภาพ (GameManagement.tsx)](file:///c:/Users/Windows%2011/StoreGame/client/src/pages/GameManagement.tsx#L394)**:

### **📁 /src/components (UI ย่อย)**

#### **1. [GameList.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/components/GameList.tsx)**
*   **หน้าที่**: แสดงรายการเกม
*   **การทำงาน (Code Reference)**:
    *   **[กรองหมวดหมู่ (GameList.tsx)](file:///c:/Users/Windows%2011/StoreGame/client/src/components/GameList.tsx#L125)**:

#### **2. [SnowBackground.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/components/SnowBackground.tsx)**
*   **หน้าที่**: Effect หิมะตก
*   **การทำงาน (Code Reference)**:
    *   **[CSS Box-Shadow Technique](file:///c:/Users/Windows%2011/StoreGame/client/src/index.css#L4)**: แทนที่จะสร้าง div หลายตัว ใช้ box-shadow สร้างจุดหลายๆ จุดใน layer เดียว

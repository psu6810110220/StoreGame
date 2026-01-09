# Backend Development Requirements Compliance (NestJS)
เอกสารนี้แสดงการตรวจสอบว่าโปรเจกต์ได้ปฏิบัติตามข้อกำหนด Backend Development ครบถ้วน โดยอ้างอิงจาก Source Code จริง

---

## 🟢 1. Database Design
> **Requirement**: ใช้ PostgreSQL รันผ่าน Docker Compose

*   ✅ **Compliant**: มีไฟล์ `docker-compose.yml` ที่กำหนด Service `postgres:15-alpine`
    *   **File**: [docker-compose.yml](file:///c:/Users/Windows%2011/StoreGame/docker-compose.yml)

> **Requirement**: มี Entity อย่างน้อย 3 Tables (One-to-Many และ Many-to-Many)

*   ✅ **Compliant**: ระบบมี Entity ที่มีความสัมพันธ์ซับซ้อนตามที่กำหนด:
    1.  **Users** (One) ↔ **Bookings** (Many)
    2.  **Bookings** (One) ↔ **BookingItems** (Many)
    3.  **Games** (One) ↔ **BookingItems** (Many)
    
    *   **Files**:
        *   [user.entity.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/users/user.entity.ts)
        *   [booking.entity.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/entities/booking.entity.ts) (บรรทัด 59, 63)
        *   [booking-item.entity.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/entities/booking-item.entity.ts) (บรรทัด 19, 24)

---

## 🟡 2. Authentication
> **Requirement**: ระบบ Register (Hash Password) และ Login (JWT)

*   ✅ **Compliant**: 
    *   **Register (Hash Password)**: ใช้ `bcrypt.hash` ในการเข้ารหัสรหัสผ่านก่อนบันทึกลงฐานข้อมูล
        *   Ref: [auth.service.ts: validateUser](file:///c:/Users/Windows%2011/StoreGame/server/src/auth/auth.service.ts#L33)
    *   **Login (JWT)**: ใช้ `JwtService` สร้าง Access Token ที่บรรจุ ID, Username, และ Role
        *   Ref: [auth.service.ts: login](file:///c:/Users/Windows%2011/StoreGame/server/src/auth/auth.service.ts#L51)

> **Requirement**: ใช้ .env และ ConfigService สำหรับค่าความลับต่างๆ

*   ✅ **Compliant**:
    *   ใช้ `ConfigService` ในการดึงค่า `JWT_SECRET`
    *   Ref: [jwt.strategy.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/auth/jwt.strategy.ts#L23)

---

## 🔵 3. Authorization
> **Requirement**: แบ่ง Role: ADMIN (Full CRUD) และ USER (Read & Interact)

*   ✅ **Compliant**:
    *   **Role Definition**: มี `enum UserRole { ADMIN, USER }`
    *   **Guard**: มี `RolesGuard` เพื่อป้องกัน API Endpoint
        *   Ref: [roles.guard.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/auth/roles.guard.ts)
    *   **Implementation**:
        *   **Admin**: สามารถ Create/Update/Delete Game ได้ (Ref: [games.controller.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/games/games.controller.ts#L18))
        *   **User**: สามารถดูรายการเกมและจอง (Interact) แต่แก้ไขข้อมูลเกมไม่ได้

---

## 🔴 4. Business Logic
> **Requirement**: มี Feature ซับซ้อนอย่างน้อย 1 อย่าง (เช่น ตัด Stock, คำนวณยอดรวม, ระบบจองที่ป้องกันการซ้อนทับ)

*   ✅ **Compliant**: **ระบบจองที่ตัด Stock แบบ Transactional (Transactional Booking System)**
    *   **Logic**: เมื่อมีการจอง (Create Booking) ระบบจะเปิด Transaction:
        1.  ล็อคข้อมูลเกม (`pessimistic_write`) เพื่อป้องกัน Race Condition (ป้องกันคนจองซ้อนกันวินาทีเดียวกัน)
        2.  ตรวจสอบ Stock (`game.stockQuantity < requested`) ถ้าไม่พอจะ Rollback ทันที
        3.  ตัด Stock จริง (`game.stockQuantity -= quantity`)
        4.  คำนวณยอดรวมอัตโนมัติ (`totalAmount`)
        5.  บันทึก Booking และ BookingItems
    
    *   **Code Reference**: [bookings.service.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/bookings/bookings.service.ts#L18)
        ```typescript
        await queryRunner.startTransaction();
        // ...
        const game = await queryRunner.manager.findOne(Game, { lock: { mode: 'pessimistic_write' } });
        // ...
        game.stockQuantity -= itemDto.quantity;
        // ...
        await queryRunner.commitTransaction();
        ```

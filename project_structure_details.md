# รายละเอียดโครงสร้างโปรเจกต์และหน้าที่ของไฟล์แบบเจาะลึก (Deep Dive Project Structure)

เอกสารนี้อธิบายหน้าที่ของแต่ละไฟล์ในระดับ **โค้ดและการทำงาน (Logic)** อย่างละเอียด พร้อม **ตัวอย่างโค้ด (Code Reference)** ประกอบ

---

## 🟢 ส่วนที่ 1: Server (`/server`) - NestJS Backend
ทำหน้าที่เป็นสมองของระบบ จัดการข้อมูลและ Logic ทั้งหมด

### **📁 /src/auth (ระบบความปลอดภัยและการเข้าสู่ระบบ)**

#### **1. [auth.service.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/auth/auth.service.ts)**
*   **หน้าที่หลัก**: Logic การยืนยันตัวตน (Authentication)
*   **การทำงาน (Code Reference)**:
    *   **ตรวจสอบรหัสผ่าน (`validateUser`)**: ใช้ `bcrypt` เทียบรหัสผ่านที่กรอกมา กับรหัสที่เข้ารหัสไว้ในฐานข้อมูล
        ```typescript
        const isMatch = await bcrypt.compare(pass, user.password);
        if (user && isMatch) { ... }
        ```
    *   **สร้าง Token (`login`)**: บรรจุข้อมูล User ID และ Role ลงใน JWT Token
        ```typescript
        const payload = { username: user.username, sub: user.id, role: user.role };
        return { access_token: this.jwtService.sign(payload) };
        ```

#### **2. [jwt.strategy.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/auth/jwt.strategy.ts)**
*   **หน้าที่หลัก**: ดักจับและแกะ Token (Strategy)
*   **การทำงาน (Code Reference)**:
    *   **ดึง Token จาก Header**:
        ```typescript
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // อ่านจาก Authorization: Bearer ...
          secretOrKey: 'SECRET_KEY', // กุญแจลับสำหรับถอดรหัส
        });
        ```

#### **3. [roles.guard.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/auth/roles.guard.ts)**
*   **หน้าที่หลัก**: ตรวจสอบสิทธิ์การใช้งาน (Authorization)
*   **การทำงาน (Code Reference)**:
    *   **เช็ค Role**: เปรียบเทียบ Role ของ User กับ Role ที่ API ต้องการ
        ```typescript
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, ...);
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some((role) => user.role?.includes(role)); // ถ้า Role ตรงกัน ยอมให้ผ่าน
        ```

### **📁 /src/users (ระบบผู้ใช้งาน)**

#### **1. [users.service.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/users/users.service.ts)**
*   **หน้าที่หลัก**: จัดการข้อมูล User ใน Database
*   **การทำงาน (Code Reference)**:
    *   **สร้าง Admin อัตโนมัติ (`seedAdmin`)**: ทำงานตอนเริ่ม Server (`onModuleInit`)
        ```typescript
        if (!adminExists) {
           const hashedPassword = await bcrypt.hash('admin1234', 10);
           // save admin to db...
        }
        ```

### **📁 /src/games (ระบบเกม)**

#### **1. [games.controller.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/games/games.controller.ts)**
*   **หน้าที่หลัก**: API Endpoints สำหรับเกม
*   **การทำงาน (Code Reference)**:
    *   **จำกัดสิทธิ์ Admin**: ใช้ Decorator `@Roles` เพื่อล็อก API
        ```typescript
        @Post()
        @Roles(UserRole.ADMIN) // เฉพาะ Admin เท่านั้นที่เพิ่มเกมได้
        create(@Body() createGameDto: CreateGameDto) { ... }
        ```

#### **2. [game.entity.ts](file:///c:/Users/Windows%2011/StoreGame/server/src/entities/game.entity.ts)**
*   **หน้าที่หลัก**: โครงสร้างตาราง Game ใน Database
*   **การทำงาน (Code Reference)**:
    *   **กำหนด Column**:
        ```typescript
        @Column()
        title: string;
        
        @Column({ nullable: true }) // ยอมให้เป็นค่าว่างได้
        imageUrl: string;
        ```

---

## 🔵 ส่วนที่ 2: Client (`/client`) - React Frontend
ทำหน้าที่แสดงผลและโต้ตอบกับผู้ใช้

### **📁 /src (Configuration & Routing)**

#### **2. [App.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/App.tsx)**
*   **หน้าที่หลัก**: จัดการเส้นทาง (Route) และการป้องกันหน้าเว็บ
*   **การทำงาน (Code Reference)**:
    *   **Protected Route**: เช็คว่ามี Token ไหม ถ้าไม่มีให้ดีดกลับไป Login
        ```typescript
        const ProtectedRoute = ({ children }) => {
          const { token } = useAuth();
          if (!token) return <Navigate to="/login" replace />;
          return <>{children}</>;
        };
        ```

### **📁 /src/context (การจัดการข้อมูลส่วนกลาง)**

#### **1. [AuthContext.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/context/AuthContext.tsx)**
*   **หน้าที่**: เก็บสถานะการ Login
*   **การทำงาน (Code Reference)**:
    *   **บันทึก Token (`login`)**:
        ```typescript
        const login = (accessToken, ...) => {
           // จำในเครื่อง (ถาวร) หรือ จำใน Browser (ชั่วคราว)
           const storage = remember ? localStorage : sessionStorage;
           storage.setItem('token', accessToken);
           axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`; // แนบ Token ไปกับทุก Request
        };
        ```

#### **2. [CartContext.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/context/CartContext.tsx)**
*   **หน้าที่**: ตะกร้าสินค้า
*   **การทำงาน (Code Reference)**:
    *   **เพิ่มสินค้า (`addToCart`)**:
        ```typescript
        setCart((prevCart) => {
           const existing = prevCart.find(item => item.id === product.id);
           if (existing) { return ...quantity + 1... } // ถ้ามีแล้ว บวกจำนวน
           return [...prevCart, { ...product, quantity: 1 }]; // ถ้าไม่มี เพิ่มใหม่
        });
        ```

### **📁 /src/pages (หน้าจอและการทำงาน)**

#### **2. [Dashboard.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/pages/Dashboard.tsx)**
*   **หน้าที่**: หน้าหลัก Dashboard
*   **การทำงาน (Code Reference)**:
    *   **แยกเมนู Admin**:
        ```tsx
        {user.role === 'admin' && (
           <AdminPanel /> // แสดงส่วนนี้เฉพาะเมื่อเป็น Admin
        )}
        ```

#### **3. [MyBookings.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/pages/MyBookings.tsx)**
*   **หน้าที่**: หน้าประวัติการจอง
*   **การทำงาน (Code Reference)**:
    *   **ดึงข้อมูล (`useEffect`)**:
        ```typescript
        useEffect(() => {
           const data = await getMyBookings(token);
           setBookings(data);
        }, [token]);
        ```

#### **4. [BookingManagement.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/pages/BookingManagement.tsx)**
*   **หน้าที่**: หน้าจัดการการจอง (Admin)
*   **การทำงาน (Code Reference)**:
    *   **อนุมัติจ่ายเงิน (`handlePaymentAction`)**:
        ```typescript
        await updatePaymentStatus(token, id, 'PAID');
        if (action === 'APPROVE') {
            await updateBookingStatus(token, id, 'CONFIRMED'); // Auto-confirm เมื่อจ่ายเงินแล้ว
        }
        ```

#### **5. [GameManagement.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/pages/GameManagement.tsx)**
*   **หน้าที่**: หน้าจัดการเกม (Admin)
*   **การทำงาน (Code Reference)**:
    *   **Preview รูปภาพ**:
        ```tsx
        <input onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
        {/* รูปตัวอย่างจะเปลี่ยนทันทีที่ State เปลี่ยน */}
        <img src={formData.imageUrl} />
        ```

### **📁 /src/components (UI ย่อย)**

#### **1. [GameList.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/components/GameList.tsx)**
*   **หน้าที่**: แสดงรายการเกม
*   **การทำงาน (Code Reference)**:
    *   **กรองหมวดหมู่**:
        ```typescript
        const filteredGames = games.filter(game => {
           if (categoryFilter === 'All') return true;
           return game.category === categoryFilter;
        });
        ```

#### **2. [SnowBackground.tsx](file:///c:/Users/Windows%2011/StoreGame/client/src/components/SnowBackground.tsx)**
*   **หน้าที่**: Effect หิมะตก
*   **การทำงาน (Code Reference)**:
    *   **สร้างหิมะสุ่ม**:
        ```tsx
        {[...Array(50)].map((_, i) => (
           <div style={{ 
              left: `${Math.random() * 100}vw`, 
              animationDuration: `${Math.random() * 3 + 2}s` 
           }} />
        ))}
        ```

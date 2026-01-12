# 📘 คัมภีร์โค้ดฉบับมหากาพย์ (The Ultimate Code Bible)

นี่คือเอกสารที่รวบรวมคำอธิบายที่ **"ละเอียดที่สุด"** เท่าที่จะทำได้ โดยเจาะลึกทั้ง **ความหมายของสัญลักษณ์**, **ไวยากรณ์ (Syntax)**, และ **ตรรกะ (Logic)** ของทุกไฟล์สำคัญครับ

---

## 🔤 พจนานุกรมสัญลักษณ์และไวยากรณ์ (Syntax Dictionary)
ก่อนจะอ่านโค้ด ต้องเข้าใจ "ภาษาต่างดาว" พวกนี้ก่อนครับ

| สัญลักษณ์ / คำสั่ง | ความหมายในภาษาคน | ตัวอย่างการใช้ |
| :--- | :--- | :--- |
| **`=>` (Arrow Function)** | ฟังก์ชันแบบย่อ (เหมือน "ไปทำ...") | `() => console.log('Hi')` (สั่งให้ปริ้น Hi) |
| **`?` (Optional Chain)** | "ถ้ามีก็ทำ ถ้าไม่มีก็ช่างมัน" (กัน Error) | `user?.role` (ถ้า user เป็น null ก็ไม่พัง แค่คืนค่า undefined) |
| **`<T>` (Generic)** | "ตัวแปรชนิดอะไรก็ได้ เดี๋ยวบอกทีหลัง" | `useState<string>` (บอกว่า State นี้เก็บเฉพาะตัวอักษรนะ) |
| **`interface`** | "แม่พิมพ์" หรือ "ข้อกำหนด" | `interface User { id: number }` (ใครจะเป็น User ต้องมี id เป็นตัวเลข) |
| **`@` (Decorator)** | "ป้ายแปะหน้าห้อง" (บอกว่า Class นี้คืออะไร) | `@Module`, `@Injectable`, `@Controller` |
| **`async / await`** | "รอเดี๋ยว..." (ใช้กับงานที่ต้องรอ เช่น โหลดข้อมูล) | `await axios.get(...)` (รอให้โหลดเสร็จก่อนค่อยบรรทัดต่อไป) |
| **`...` (Spread Operator)** | "เทกระจาด" (เอาของข้างในออกมา) | `...formData` (เอาข้อมูลเก่าทั้งหมด มาแปะรวมกับของใหม่) |

---

## 🖥️ เจาะลึก Backend (NestJS) แบบบรรทัดต่อบรรทัด

### 1. 📂 `server/src/main.ts` (จุดเริ่ม)
```typescript
import { NestFactory } from '@nestjs/core';
// ... imports อื่นๆ

async function bootstrap() {
  // 1. สร้าง App (ตัวร้าน) ขึ้นมา
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // <NestExpressApplication> คือการบอก Generic ว่า "ร้านนี้ใช้ระบบ Express นะ"

  // 2. เปิดโฟลเดอร์ให้คนเข้าถึงรูปภาพได้
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { // __dirname = ที่อยู่ไฟล์ปัจจุบัน
    prefix: '/uploads/', // ถ้าพิมพ์ URL /uploads/ ให้มาหาที่นี่
  });

  // 3. ปลดล็อค CORS (อนุญาตให้เว็บอื่นยิงมาหาได้)
  app.enableCors({
    origin: ['http://localhost:4000'], // อนุญาตแค่บ้านเรา (Frontend)
    credentials: true, // อนุญาตให้พกบัตร (Token) เข้ามาได้
  });

  // 4. ติดตั้งเครื่องตรวจจับ (Validation)
  app.useGlobalPipes(new ValidationPipe({ 
      whitelist: true, // ตัดข้อมูลขยะทิ้ง
      transform: true // แปลง String เป็น Number ให้ถ้าจำเป็น
  }));

  await app.listen(3000); // รอรับลูกค้าที่ประตู 3000
}
bootstrap(); // สั่งรันฟังก์ชัน
```

### 2. 📂 `server/src/app.module.ts` (โครงสร้างหลัก)
```typescript
@Module({ // แปะป้ายบอกว่า นี่คือ "ห้องบัญชาการหลัก"
  imports: [
    // 1. โหลดไฟล์ .env (ความลับ) เข้ามาในระบบ
    ConfigModule.forRoot({ isGlobal: true }), 
    
    // 2. เชื่อมต่อฐานข้อมูล (Database)
    TypeOrmModule.forRoot({
      type: 'postgres', // ใช้ PostgreSQL
      host: process.env.DATABASE_HOST, // อ่านค่าจาก .env
      autoLoadEntities: true, // ให้หาตารางเองอัตโนมัติ (ไม่ต้องมานั่งบอกทีละอัน)
      synchronize: true, // แก้โค้ดปุ๊บ แก้ Database ตามปั๊บ (ห้ามใช้ใน Production!)
    }),

    // 3. รวมแผนกย่อยๆ เข้ามาทำงานด้วยกัน
    UsersModule, AuthModule, GamesModule
  ],
})
export class AppModule {}
```

### 3. 📂 `server/src/auth/auth.service.ts` (ตรรกะ Login)
```typescript
async validateUser(identity: string, pass: string): Promise<any> {
    // 1. บรรทัดนี้คือการ "ค้นหา" ว่ามีคนชื่อนี้ไหม?
    const user = await this.usersService.findOneByUsername(identity);
    
    // 2. ถ้าเจอคน บรรทัดนี้จะ "เทียบรหัสผ่าน"
    // bcrypt.compare() จะเอารหัส 1234 ไปเข้าสูตร แล้วเทียบกับ $2b$10$... ในฐานข้อมูล
    const isMatch = await bcrypt.compare(pass, user.password);

    // 3. ถ้าคนถูกต้อง และรหัสถูกต้อง
    if (user && isMatch) {
        // ตัดรหัสผ่านทิ้งก่อนส่งกลับ (เพื่อความปลอดภัย)
        const { password, ...result } = user;
        return result; 
    }
    return null; // ถ้าไม่ถูก ให้บอกว่า "ไม่มีตัวตน"
}
```

---

## 💻 เจาะลึก Frontend (React) แบบละเอียดยิบ

### 1. 📂 `client/src/pages/GameManagement.tsx` (หน้าจัดการเกม)
ไฟล์นี้ซับซ้อนเพราะมีทั้งการจัดการ Form, Upload รูป, และตาราง

#### ส่วนประกาศตัวแปร (Variables & State)
```typescript
// ประกาศ State เพื่อเก็บข้อมูล (เหมือนกระดานทดเลข)
const [games, setGames] = useState<Game[]>([]); // เก็บรายชื่อเกมทั้งหมด (เป็น Array)
const [isModalOpen, setIsModalOpen] = useState(false); // เก็บว่า "เปิดหน้าต่าง Pop-up อยู่ไหม?"
const [formData, setFormData] = useState({ ... }); // เก็บข้อมูลที่กำลังพิมพ์อยู่ในฟอร์ม
```

#### ส่วนตรรกะการโหลดข้อมูล (Effects)
```typescript
useEffect(() => {
    fetchGames(); // ทันทีที่เข้าหน้านี้ ให้ไปโหลดเกมมาโชว์
}, []); // [] ว่างๆ แปลว่า "ทำแค่รอบเดียว"
```

#### ส่วนการอัปโหลดรูปภาพ (File Upload Logic)
```typescript
onChange={async (e) => {
    const file = e.target.files?.[0]; // 1. ดึงไฟล์ที่เลือกมาจาก Input
    if (file) {
        const formDataUpload = new FormData(); // 2. สร้างซองจดหมายพิเศษ (FormData)
        formDataUpload.append('file', file); // 3. ยัดไฟล์ใส่ซอง
        
        // 4. ส่งซองไปหา Server
        const res = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formDataUpload
        });
        
        // 5. Server ตอบกลับมาเป็น "ลิ้งก์รูปภาพ"
        const data = await res.json();
        
        // 6. เอาลิ้งก์นั้นไปแปะใน Form ของเรา (เตรียมกด Save)
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
    }
}}
```

#### ส่วนการกรองข้อมูล (Filter Logic)
```typescript
const filteredGames = games.filter(game => {
    // 1. เช็คว่าชื่อเกม ตรงกับที่พิมพ์ค้นหาไหม? (Search)
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. เช็คว่าหมวดหมู่ ตรงกับที่ติ๊กเลือกไหม? (Category Filter)
    const matchesCategory = selectedCategories.length === 0 || 
        game.categories?.some(c => selectedCategories.includes(c));

    // 3. ต้องตรงทั้งคู่ ถึงจะผ่านด่านไปโชว์ในตาราง
    return matchesSearch && matchesCategory;
});
```

### 2. 📂 `client/src/context/AuthContext.tsx`
```typescript
const [user, setUser] = useState<User | null>(null);

// ฟังก์ชัน Login ที่ละเอียดกว่าที่คิด
const login = (accessToken: string, userData: User, remember: boolean = true) => {
    // 1. เลือกกระเป๋าที่จะเก็บ (Local = ถาวร, Session = ชั่วคราว)
    const storage = remember ? localStorage : sessionStorage;

    // 2. ลบของเก่าจากกระเป๋าอีกใบ (กันสับสน)
    (remember ? sessionStorage : localStorage).removeItem('token');

    // 3. เก็บของใหม่ลงกระเป๋าที่เลือก
    storage.setItem('token', accessToken);
    
    // 4. อัปเดตตัวแปร user เพื่อให้หน้าจอเปลี่ยนทันที (เช่น เปลี่ยนปุ่ม Login -> Logout)
    setUser(userData);
};
```

---

## 📝 เคล็ดลับการอ่านโค้ด (Pro Tips)
1.  เจอ **`{ ...prev, newProp: value }`**: แปลว่า "ก๊อปปี้ค่าเก่ามาทั้งหมด แล้วแก้แค่ตัว newProp" (Immutability Pattern)
2.  เจอ **`e.preventDefault()`**: แปลว่า "หยุด! อย่าเพิ่งรีเฟรชหน้าจอ เดี๋ยวฉันจัดการเอง" (ใช้กับ Form Submit)
3.  เจอ **`useEffect` ที่ไม่มี `[]`**: ระวัง! มันจะทำงานวนไปเรื่อยๆ จนเครื่องค้าง (Infinite Loop)

หวังว่าฉบับ "มหากาพย์" นี้จะไขข้อข้องใจได้ทุกบรรทัดนะครับ! ถ้าตรงไหนยังงงอยู่อีก จิ้มถามเจาะจงได้เลยครับ! 🧐🔥

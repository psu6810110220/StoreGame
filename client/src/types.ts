// client/src/types.ts

// ==========================================
// 📂 Type Definitions (สัญญาข้อมูล)
// ==========================================
// ไฟล์นี้เก็บ Interface ทั้งหมดที่ใช้ใน Frontend
// เพื่อให้มั่นใจว่า Frontend กับ Backend คุยกันด้วยโครงสร้างข้อมูลเดียวกัน (Type Safety)

/**
 * 1. User Interface
 * ข้อมูลผู้ใช้งานที่ได้จากการ Login หรือ API
 */
export interface User {
  id: number;           // รหัสผู้ใช้ (Database ID)
  email: string;        // อีเมล
  displayName: string;  // ชื่อที่จะแสดงบนหน้าเว็บ (เช่น Username)
  role: 'user' | 'admin'; // ระดับสิทธิ์: 'user' (ลูกค้า) หรือ 'admin' (ผู้ดูแล)
}

/**
 * 2. AuthResponse Interface
 * ข้อมูลที่ Backend ส่งกลับมาเมื่อ Login สำเร็จ
 */
export interface AuthResponse {
  token: string; // Access Token (JWT) สำหรับพกไปขอข้อมูลจาก Backend
  user: User;    // ข้อมูลของผู้ใช้คนนั้น
}

/**
 * 3. Booking Interface
 * ข้อมูลใบจองสินค้า/บริการ
 */
export interface Booking {
  id: number;
  userId: number;       // ใครเป็นคนจอง
  gameName: string;     // จองเกมอะไร
  startTime: string;    // เริ่มจองเมื่อไหร่ (ISO String)
  endTime: string;      // สิ้นสุดเมื่อไหร่
  status: 'pending' | 'confirmed' | 'cancelled'; // สถานะการจอง
}

/**
 * 4. Game Interface
 * ข้อมูลสินค้า (เกม) ที่มีขายในร้าน
 */
export interface Game {
  id: number;
  title: string;        // ชื่อเกม
  description: string;  // คำบรรยาย
  price: number;        // ราคา (บาท)
  stockQuantity: number;// จำนวนสินค้าคงเหลือ
  imageUrl: string;     // URL รูปปกเกม
  categories?: string[];// หมวดหมู่เกม (Tags)
}
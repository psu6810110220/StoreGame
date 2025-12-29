// client/src/types.ts

// 1. หน้าตาข้อมูลผู้ใช้ (User)
export interface User {
  id: number;
  email: string;
  displayName: string;
  role: 'user' | 'admin'; // เผื่ออนาคตมีแอดมิน
}

// 2. หน้าตาข้อมูลตอน Login สำเร็จ (AuthResponse)
export interface AuthResponse {
  token: string; // กุญแจผ่านทาง (JWT)
  user: User;    // ข้อมูลคนนั้น
}

// 3. หน้าตาข้อมูลการจอง (Booking) - แถมให้เผื่อหน้าถัดไป
export interface Booking {
  id: number;
  userId: number;
  gameName: string;
  startTime: string; // เช่น "2023-12-25T10:00:00"
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
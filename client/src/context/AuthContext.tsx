import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// กำหนดหน้าตาของข้อมูล User
interface User {
  id: number;
  username: string;
  role?: string;
}

// กำหนดหน้าตาของ Context
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User, remember?: boolean) => void; // ✅ Updated to support Remember Me
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // ✅ 1. ดึงข้อมูลจาก LocalStorage เมื่อโหลดหน้าเว็บ (เพื่อให้กด Refresh แล้วไม่หลุด)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ 1. ดึงข้อมูลจาก Storage เมื่อโหลดหน้าเว็บ (Rehydrate)
    // เพื่อให้เวลา User กด Refresh หน้าจอ ข้อมูล Login จะได้ไม่หายไป
    const savedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser); // แปลง JSON String กลับเป็น Object
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user data", e);
        // ถ้าข้อมูลพัง ให้ลบทิ้งไปเลย (กัน Error ค้าง)
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      }
    }
    setLoading(false); // โหลดเสร็จแล้ว ปล่อยให้แสดงผลหน้าเว็บได้
  }, []);

  // ✅ 2. ฟังก์ชัน Login
  const login = (accessToken: string, userData: User, remember: boolean = true) => {
    // อัปเดต State ใน React (เพื่อให้หน้าจอรู้ว่าล็อกอินแล้ว)
    setToken(accessToken);
    setUser(userData);

    // เลือกกระเป๋าที่จะเก็บ (Local = ถาวร, Session = ชั่วคราว/ปิดบราวเซอร์หาย)
    const storage = remember ? localStorage : sessionStorage;

    // เคลียร์กระเป๋าอีกใบ เพื่อไม่ให้ข้อมูลตีกัน
    const otherStorage = remember ? sessionStorage : localStorage;
    otherStorage.removeItem('token');
    otherStorage.removeItem('user');

    // เก็บ Token และข้อมูล User ลงกระเป๋าที่เลือก
    storage.setItem('token', accessToken);
    storage.setItem('user', JSON.stringify(userData)); // ต้องแปลง Object เป็น String ก่อนเก็บ

    console.log("✅ AuthContext Updated: Logged in as", userData.role, "| Remember:", remember);

    // หมายเหตุ: การ navigate('/dashboard') ทำที่หน้า Login.tsx แล้ว
  };

  // ✅ 3. ฟังก์ชัน Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login'); // เด้งกลับไปหน้า Login
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook สำหรับเรียกใช้
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
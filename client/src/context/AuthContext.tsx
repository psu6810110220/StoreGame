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
  login: (token: string, user: User) => void; // ✅ เปลี่ยนจาก signIn เป็น login ที่รับค่าตรงๆ
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // ✅ 1. ดึงข้อมูลจาก LocalStorage เมื่อโหลดหน้าเว็บ (เพื่อให้กด Refresh แล้วไม่หลุด)
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user data", e);
        localStorage.removeItem('user'); // ล้างค่าที่เสียออก
      }
    }
  }, []);

  // ✅ 2. ฟังก์ชัน Login: มีหน้าที่แค่รับค่ามาบันทึก State และ LocalStorage
  // (API ถูกยิงมาจากหน้า Login.tsx แล้ว)
  const login = (accessToken: string, userData: User) => {
    // อัปเดต State
    setToken(accessToken);
    setUser(userData);

    // อัปเดต LocalStorage
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));

    console.log("✅ AuthContext Updated: Logged in as", userData.role);
    
    // หมายเหตุ: การ navigate('/dashboard') ทำที่หน้า Login.tsx แล้ว
    // แต่ถ้าอยากให้ชัวร์จะใส่ navigate('/dashboard') ตรงนี้เพิ่มก็ได้ครับ
  };

  // ✅ 3. ฟังก์ชัน Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); // เด้งกลับไปหน้า Login
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
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
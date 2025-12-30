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
    // Check LocalStorage first, then SessionStorage
    const savedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user data", e);
        // Clear both just in case
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // ✅ 2. ฟังก์ชัน Login
  const login = (accessToken: string, userData: User, remember: boolean = true) => {
    // อัปเดต State
    setToken(accessToken);
    setUser(userData);

    const storage = remember ? localStorage : sessionStorage;

    // Clear the OTHER storage to avoid conflicts
    const otherStorage = remember ? sessionStorage : localStorage;
    otherStorage.removeItem('token');
    otherStorage.removeItem('user');

    // อัปเดต Storage ที่เลือก
    storage.setItem('token', accessToken);
    storage.setItem('user', JSON.stringify(userData));

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
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookingSummary from './pages/BookingSummary';
import MyBookings from './pages/MyBookings';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import type { ReactNode } from 'react';

/**
 * 🛡️ ProtectedRoute Component
 * ==========================================
 * ทำหน้าที่เป็น "ยามเฝ้าประตู" ไม่ให้คนนอกเข้าถึงหน้าสำคัญ
 * หลักการ: เช็คว่ามี User ล็อกอินอยู่ไหม?
 * - ถ้ามี: ยอมให้ผ่านไป (return children)
 * - ถ้าไม่มี: เตะกลับไปหน้า Login โดยอัตโนมัติ (<Navigate to="/login" />)
 */
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token, loading } = useAuth(); // ดึง Token จาก Context และสถานะ loading

  // ถ้ากำลังโหลดข้อมูล (เช่น เช็ค Token ใน LocalStorage) ให้ขึ้น Loading ก่อน
  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-slate-900 text-white text-xl animate-pulse">Loading... ⏳</div>;
  }

  // ถ้าไม่มี Token -> ไปหน้า Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

/**
 * 🟡 App Component
 * ==========================================
 * เปรียบเสมือน "โครงสร้างหลัก" ของเว็บไซต์
 * ที่นี่เราจะกำหนดว่า URL ไหน จะให้แสดงผลหน้าจออะไร
 */
function App() {
  return (
    // ครอบด้วย Provider เพื่อให้ทุกหน้าเข้าถึงข้อมูลกลางได้
    // 1. AuthProvider: จัดการเรื่องล็อกอิน/ล็อกเอาท์
    // 2. CartProvider: จัดการตะกร้าสินค้า
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/*
             กำหนดเส้นทาง (Routes)
             path="/" คือหน้าแรก -> ให้เด้งไปหน้า Login เลย
          */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* หน้าสาธารณะ (ใครก็เข้าได้) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔒 หน้าที่ต้องล็อกอินก่อนถึงจะเข้าได้ (Protected Routes) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-summary"
            element={
              <ProtectedRoute>
                <BookingSummary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
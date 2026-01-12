import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GameManagement from "./GameManagement";
import BookingManagement from "./BookingManagement";
import UserManagement from "./UserManagement";
import GameList from "../components/GameList";
import SnowBackground from "../components/SnowBackground";

/**
 * 🟡 Dashboard Component
 * ==========================================
 * หน้าหลักของเว็บไซต์ (หลังจาก Login แล้ว)
 * ทำหน้าที่เป็นศูนย์กลางของระบบ:
 * 1. แสดงรายชื่อเกม (Marketplace)
 * 2. แสดงเมนูสำหรับ Admin (ถ้าล็อกอินเป็น Admin)
 * 3. แสดง Nav Bar และข้อมูลผู้ใช้
 */
function Dashboard() {
  const { user, logout } = useAuth(); // ดึงข้อมูล User และฟังก์ชัน Logout
  const navigate = useNavigate();

  // ----------------------------------------------------
  // 1. State Management (ตัวแปรควบคุมหน้าจอ)
  // ----------------------------------------------------

  // ควบคุมการเปิด/ปิด Panel ของ Admin (Game, Booking, User)
  const [showGameManagement, setShowGameManagement] = useState(false);
  const [showBookingManagement, setShowBookingManagement] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);

  // Key สำหรับ Force Refresh Component GameList
  // (เทคนิค: เมื่อค่า key เปลี่ยน React จะทำลาย Component เก่าทิ้งและสร้างใหม่ทันที)
  // ใช้เมื่อเราต้องการรีเซ็ต State ภายในของ GameList (เช่น หน้า Pagination กลับไปหน้า 1)
  const [gameListKey, setGameListKey] = useState(0);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative">
      <SnowBackground />

      {/* ---------------------------------------------------- */}
      {/* 2. Navbar (ส่วนหัวของเว็บไซต์)                         */}
      {/* ---------------------------------------------------- */}
      <nav className="bg-slate-800/80 backdrop-blur-md shadow-sm border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50">

        {/* Logo & Brand Name */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => {
            navigate('/dashboard');
            setGameListKey(prev => prev + 1); // รีเซ็ตหน้า GameList
            // ปิด Panel Admin ทั้งหมดเพื่อให้หน้าจอสะอาด
            setShowGameManagement(false);
            setShowBookingManagement(false);
            setShowUserManagement(false);
          }}
        >
          <div className="bg-indigo-500 p-2 rounded-lg text-white font-bold shadow-lg shadow-indigo-500/50">SG</div>
          <span className="text-xl font-bold bg-clip-text text-transparent text-gradient-store">
            StoreGame
          </span>
        </div>

        {/* Right Menu (Profile & Actions) */}
        <div className="flex items-center gap-4">
          {/* ปุ่มไปหน้า "การจองของฉัน" */}
          <button
            onClick={() => navigate('/my-bookings')}
            className="hidden sm:flex text-sm font-bold text-slate-300 hover:text-white border border-white/10 hover:border-indigo-500/50 bg-slate-700/50 hover:bg-slate-700 px-4 py-2 rounded-full transition-all"
          >
            📅 My Bookings
          </button>

          {/* User Info Display */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-200">{user?.username || "Guest User"}</p>
            <p className="text-xs text-indigo-400 capitalize">{user?.role || "user"}</p>
          </div>

          {/* User Avatar Circle */}
          <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-indigo-400 font-bold border-2 border-indigo-500/30 shadow-sm">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-full font-bold hover:bg-red-500/20 transition-colors shadow-sm border border-red-500/20"
          >
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8 z-10">

        {/* ---------------------------------------------------- */}
        {/* 3. Welcome Section (ส่วนต้อนรับ)                      */}
        {/* ---------------------------------------------------- */}
        <section className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/5 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-white">
              Happy New Year! 🎉 <span className="text-indigo-400">{user?.username || "Guest"}</span>
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-slate-400 font-medium">Your Status:</span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${user?.role === 'admin'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                {user?.role?.toUpperCase() || "USER"}
              </span>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 4. Admin Control Planel (เฉพาะ Admin เท่านั้นที่เห็น)  */}
        {/* ---------------------------------------------------- */}
        {user?.role === 'admin' && (
          <section className="bg-gradient-admin rounded-3xl p-8 shadow-xl text-white border border-indigo-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <span className="p-2 bg-white/10 rounded-xl backdrop-blur-md">🛠️</span>
                  Admin Control Panel
                </h3>
                <p className="text-indigo-200 mt-2">
                  Manage your game store efficiently.
                </p>
              </div>

              {/* ปุ่มควบคุมต่างๆ ของ Admin (Toggle Panels) */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowUserManagement(!showUserManagement)}
                  className={`flex-1 px-6 py-3 rounded-2xl font-bold transition transform hover:-translate-y-1 shadow-md border backdrop-blur-md ${showUserManagement
                    ? 'bg-purple-500/20 border-purple-400 text-purple-100'
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/10'
                    }`}
                >
                  {showUserManagement ? "Close Members" : "Manage Members"}
                </button>
                <button
                  onClick={() => setShowBookingManagement(!showBookingManagement)}
                  className={`flex-1 px-6 py-3 rounded-2xl font-bold transition transform hover:-translate-y-1 shadow-md border backdrop-blur-md ${showBookingManagement
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-100'
                    : 'bg-emerald-600 text-white shadow-emerald-500/30'
                    }`}
                >
                  {showBookingManagement ? "Close Bookings" : "Manage Bookings"}
                </button>
                <button
                  onClick={() => setShowGameManagement(!showGameManagement)}
                  className={`flex-1 px-6 py-3 rounded-2xl font-bold transition transform hover:-translate-y-1 shadow-md border backdrop-blur-md ${showGameManagement
                    ? 'bg-rose-500/20 border-rose-400 text-rose-100'
                    : 'bg-indigo-500 text-white shadow-indigo-500/30'
                    }`}
                >
                  {showGameManagement ? "Close Games" : "Manage Games"}
                </button>
              </div>
            </div>

            {/* แสดง Panel เมื่อกดปุ่ม (Conditional Rendering) */}

            {showGameManagement && (
              <div className="mt-10 animate-in fade-in slide-in-from-top-4 duration-500 bg-slate-900/50 rounded-2xl p-4 border border-white/10">
                <GameManagement />
              </div>
            )}

            {showBookingManagement && (
              <div className="mt-10 animate-in fade-in slide-in-from-top-4 duration-500 bg-slate-900/50 rounded-2xl p-4 border border-white/10">
                <BookingManagement onClose={() => setShowBookingManagement(false)} />
              </div>
            )}

            {showUserManagement && (
              <div className="mt-10 animate-in fade-in slide-in-from-top-4 duration-500 bg-slate-900/50 rounded-2xl p-4 border border-white/10">
                <UserManagement />
              </div>
            )}

          </section>
        )}

        {/* ---------------------------------------------------- */}
        {/* 5. Marketplace Section (หน้ารายการสินค้า)              */}
        {/* ---------------------------------------------------- */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-2xl font-bold text-white">Available Games</h3>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>
          {/* ส่ง key เข้าไปเพื่อให้ Component รีเฟรชตัวเองเมื่อ reset หน้า */}
          <GameList key={gameListKey} />
        </section>
      </main>

      <footer className="py-10 text-center text-slate-500 text-sm border-t border-white/5 mt-20 relative z-10">
        <p>© 2025 StoreGame Marketplace. Happy Holidays! ❄️</p>
      </footer>
    </div>
  );
}

export default Dashboard;
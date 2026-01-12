import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SnowBackground from '../components/SnowBackground';

export default function Login() {
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนหน้า
  const { login } = useAuth();    // ดึงฟังก์ชัน login จาก AuthContext

  // State เก็บค่าที่ user พิมพ์
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // State สำหรับแสดงแจ้งเตือน (Notification)
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' } | null>(null);

  // ฟังก์ชันเมื่อกดปุ่ม Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // กันไม่ให้หน้าเว็บ Refresh เอง

    // เคลียร์แจ้งเตือนเก่าก่อน
    setNotification(null);

    try {
      // 1. ส่งข้อมูลไปเช็คที่ Backend
      const response = await axios.post('http://localhost:3000/auth/login', {
        identity: username,
        password: password
      });

      // 2. ถ้าได้ Token กลับมา แปลว่าล็อกอินสำเร็จ
      if (response.data.access_token) {
        // บันทึก Token ลงเครื่อง (ผ่าน AuthContext)
        login(response.data.access_token, response.data.user, rememberMe);

        // แสดงผลสำเร็จ
        setNotification({ show: true, message: 'Welcome! 🎆', type: 'success' });

        // รอ 1.5 วินาที แล้วค่อยเปลี่ยนหน้าไป Dashboard (เพื่อให้ user อ่านข้อความ welcome ทัน)
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      // ถ้า Error ให้แสดงข้อความแจ้งเตือน
      const errorMsg = error.response?.data?.message || 'Invalid username or password.';
      setNotification({ show: true, message: errorMsg, type: 'error' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      <SnowBackground />

      <div className="w-full max-w-md space-y-8 rounded-3xl bg-slate-800/60 backdrop-blur-xl border border-white/10 p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">

        <div className="text-center relative">
          {/* Animated Gifts Decoration */}
          <div className="absolute -top-12 -left-8 text-5xl animate-bounce delay-100 drop-shadow-lg">🎁</div>
          <div className="absolute -top-12 -right-8 text-5xl animate-bounce delay-700 drop-shadow-lg">🎋</div>

          <div className="text-6xl mb-4 drop-shadow-lg inline-block hover:scale-110 transition-transform cursor-pointer">🎮</div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text text-gradient-welcome">
            Welcome!
          </h2>
          <p className="mt-3 text-sm text-slate-300 font-medium">
            ✨ Unbox your happiness with <span className="text-indigo-400 font-bold">StoreGame</span> ✨
          </p>
        </div>

        {/* Custom Notification Alert */}
        {notification && (
          <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 shadow-lg animate-in slide-in-from-top-2 ${notification.type === 'success'
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
            <span>{notification.type === 'success' ? '✅' : '⚠️'}</span>
            {notification.message}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1">
                Username or Email
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-4 py-3 bg-slate-900/50 border border-slate-600 placeholder-slate-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-slate-900/50 border border-slate-600 placeholder-slate-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-rose-500 hover:text-rose-400 focus:ring-rose-500 bg-slate-900 border-slate-600 rounded cursor-pointer transition-colors"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300 font-bold cursor-pointer select-none">
              Remember me
            </label>
          </div>


          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white btn-gradient-login shadow-lg shadow-rose-500/30 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-rose-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Start Gaming 🚀
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <span className="text-slate-500">Don't have an account? </span>
          <a href="/register" className="font-bold text-rose-400 hover:text-rose-300 transition-colors">
            Register for New Year Deals!
          </a>
        </div>

      </div >
    </div >
  );
}
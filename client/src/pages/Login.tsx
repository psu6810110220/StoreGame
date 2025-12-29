import { useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

export default function Login() {
  const navigate = useNavigate();
  
  // ✅ 1. เปลี่ยนชื่อตรงนี้เป็น login
  const { login } = useAuth(); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        identity: username, 
        password: password
      });

      if (response.data.access_token) {
        
        // ✅ 2. เปลี่ยนมาเรียกใช้ login แทน setToken 
        // ฟังก์ชันนี้จะจัดการทั้ง Token และ User ให้เองตามที่เราเขียนใน Context ครับ
        login(response.data.access_token, response.data.user);
        
        alert('เข้าสู่ระบบสำเร็จ!');
        navigate('/dashboard'); 
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      const errorMsg = error.response?.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
      alert(errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        
        <div className="text-center">
          <div className="text-5xl mb-2">🎮</div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="mt-2 text-sm text-gray-600">จองเกมที่ใช่ ในเวลาที่ชอบ</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อผู้ใช้ หรือ อีเมล
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="กรอกชื่อผู้ใช้ของคุณ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รหัสผ่าน
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <span className="text-gray-600">ยังไม่มีบัญชีหรอ? </span>
          <a href="/register" className="font-medium text-purple-600 hover:text-purple-500">
            สมัครสมาชิกใหม่
          </a>
        </div>

      </div>
    </div>
  );
}
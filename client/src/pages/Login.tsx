import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SnowBackground from '../components/SnowBackground';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Custom Notification State
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset notification
    setNotification(null);

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        identity: username,
        password: password
      });

      if (response.data.access_token) {
        login(response.data.access_token, response.data.user);

        // Show success notification
        setNotification({ show: true, message: 'Welcome! 🎆', type: 'success' });

        // Delay navigation slightly to show the message
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error: any) {
      console.error('Login Error:', error);
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
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-400 to-pink-400">
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

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 shadow-lg shadow-rose-500/30 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-rose-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
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

      </div>
    </div>
  );
}
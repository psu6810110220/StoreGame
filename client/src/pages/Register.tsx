import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SnowBackground from '../components/SnowBackground';

function Register() {
  const navigate = useNavigate();
  // State for form data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phoneNumber: ''
  });

  // State for custom notification
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setNotification({ show: true, message: 'Account created successfully! Redirecting...', type: 'success' });
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        const errorData = await response.json();
        setNotification({ show: true, message: `Registration failed: ${errorData.message || 'Unknown error'}`, type: 'error' });
      }

    } catch (error) {
      console.error("Connection Error:", error);
      setNotification({ show: true, message: "Cannot connect to server.", type: 'error' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      <SnowBackground />

      <div className="w-full max-w-md space-y-8 rounded-3xl bg-slate-800/60 backdrop-blur-xl border border-white/10 p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">

        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            Join the Fun!
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Create your account to start booking games.
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

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Username</label>
            <input
              type="text"
              name="username"
              className="block w-full px-4 py-3 bg-slate-900/50 border border-slate-600 placeholder-slate-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Choose a username"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="block w-full px-4 py-3 bg-slate-900/50 border border-slate-600 placeholder-slate-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Create a strong password"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="block w-full px-4 py-3 bg-slate-900/50 border border-slate-600 placeholder-slate-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="example@mail.com"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              className="block w-full px-4 py-3 bg-slate-900/50 border border-slate-600 placeholder-slate-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="08xxxxxxxx"
              onChange={handleChange}
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/30 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Create Account ✨
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <span className="text-slate-500">Already have an account? </span>
          <Link to="/login" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
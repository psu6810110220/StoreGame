import React, { useState } from 'react'; // <--- แก้ตรงนี้ครับ: เพิ่ม React เข้ามา
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  // สร้างตัวแปรเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phoneNumber: ''
  });

  // ฟังก์ชันคอยอัปเดตค่าเมื่อพิมพ์ในช่อง input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ฟังก์ชันเมื่อกดปุ่ม "Create Account"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรชเอง

    try {
      console.log("กำลังส่งข้อมูล:", formData);

      // ยิงไปที่ Backend (Port 3000)
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
        navigate('/login'); // เด้งไปหน้า Login ทันที
      } else {
        // กรณี Error เช่น ชื่อซ้ำ
        const errorData = await response.json();
        alert(`สมัครไม่ผ่าน: ${errorData.message || 'เกิดข้อผิดพลาด'}`);
      }

    } catch (error) {
      console.error("Connection Error:", error);
      alert("เชื่อมต่อ Server ไม่ได้ (ตรวจสอบว่ารัน Backend หรือยัง)");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              name="username"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter username"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="example@mail.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="08xxxxxxxx"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-200"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-700 font-bold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;


export default function Login() {
  return (
    // 1. 🔑 หัวใจสำคัญ: กรอบนอกสุดที่สั่งให้ทุกอย่างมาอยู่ "ตรงกลาง"
    // min-h-screen = ความสูงเต็มจอ
    // flex items-center justify-center = จัดกึ่งกลางทั้งแนวตั้งและแนวนอน
    // bg-gray-100 = สีพื้นหลังเทาอ่อนๆ ให้ดูสบายตา
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">

      {/* 2. ตัวการ์ดสีขาว: กำหนดความกว้าง ใส่ขอบโค้ง ใส่เงา */}
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">

        {/* ส่วนหัวข้อ */}
        <div className="text-center">
          <div className="text-5xl mb-2">🎮</div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome Back!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            จองเกมที่ใช่ ในเวลาที่ชอบ
          </p>
        </div>

        {/* ส่วนฟอร์ม */}
        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            {/* ช่อง Username/Email */}
            <div className="mb-4">
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อผู้ใช้ หรือ อีเมล
              </label>
              <input
                id="email-address"
                name="email"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="user@example.com"
              />
            </div>

            {/* ช่อง Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                รหัสผ่าน
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* ปุ่มกด */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </form>

        {/* ลิงก์สมัครสมาชิก */}
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
export default function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        
        {/* Header */}
        <div className="text-center">
          <div className="text-5xl mb-2">🚀</div>
          <h2 className="text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            เริ่มต้นใช้งานระบบจองเกมได้ฟรี!
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-4">
          
          {/* ชื่อเล่น / Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อเล่น (Display Name)
            </label>
            <input
              type="text"
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="เช่น พี่แว่น พาเพลิน"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล
            </label>
            <input
              type="email"
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="name@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่าน
            </label>
            <input
              type="password"
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ยืนยันรหัสผ่านอีกครั้ง
            </label>
            <input
              type="password"
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          {/* Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150"
            >
              สมัครสมาชิก
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-sm text-center">
          <span className="text-gray-600">มีบัญชีอยู่แล้ว? </span>
          <a href="/login" className="font-medium text-purple-600 hover:text-purple-500">
            เข้าสู่ระบบ
          </a>
        </div>

      </div>
    </div>
  );
}
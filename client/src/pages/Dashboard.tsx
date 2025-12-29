import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="mt-4 p-6 bg-white rounded-lg shadow-md inline-block min-w-72">
        <p className="text-lg">ยินดีต้อนรับคุณ: <strong>{user?.username || "User"}</strong></p>

        {/* ✅ เพิ่มการแสดงสถานะ Role เพื่อเช็คว่าเราเป็น Admin หรือยัง */}
        <p className="mt-2">
          สถานะปัจจุบัน:
          <span className={`ml-2 px-2 py-1 rounded text-sm font-bold ${user?.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}>
            {user?.role?.toUpperCase() || "USER"}
          </span>
        </p>

        {/* ✅ ส่วนแสดงผลเฉพาะ Admin เท่านั้น */}
        {user?.role === 'admin' && (
          <div className="mt-6 p-4 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50">
            <h3 className="font-bold text-purple-700">Admin Panel 🛠️</h3>
            <p className="text-sm text-purple-600 mb-3">เมนูนี้เห็นได้เฉพาะผู้จัดการระบบเท่านั้น</p>
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
              จัดการข้อมูลสมาชิก
            </button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <button
          onClick={logout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition shadow-sm"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
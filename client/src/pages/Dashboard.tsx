import { useNavigate } from "react-router-dom";

// 1. ตรวจสอบว่ามีส่วนนี้อยู่ด้านบนฟังก์ชัน Dashboard หรือไม่
const mockGames = [
  { id: 1, name: "FIFA 24", type: "Sports", platform: "PS5", image: "⚽", status: "Available", price: 20 },
  { id: 2, name: "Tekken 8", type: "Fighting", platform: "PS5", image: "🥊", status: "Busy", price: 25 },
  { id: 3, name: "Spider-Man 2", type: "Action", platform: "PS5", image: "🕷️", status: "Available", price: 30 }, 
  { id: 4, name: "Mario Kart 8", type: "Racing", platform: "Switch", image: "🏎️", status: "Maintenance", price: 15 },
  { id: 5, name: "Elden Ring", type: "RPG", platform: "PS4", image: "💍", status: "Available", price: 30 },
  { id: 6, name: "GTA V", type: "Open World", platform: "PS5", image: "🚗", status: "Busy", price: 25 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 text-white p-2 rounded-lg">
            <span className="text-xl">💿</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">DiscBooking</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-gray-800 font-medium text-sm">คุณลูกค้า (User)</span>
            <span className="text-purple-600 text-xs font-bold">Credits: 150 ฿</span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            ออกจากระบบ
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">คลังแผ่นเกม (Game Library)</h2>
          <p className="text-gray-500">เลือกจองแผ่นเกมที่คุณต้องการเล่น (Walk-in หรือ เช่ากลับบ้าน)</p>
        </div>

        {/* Filter Status */}
        <div className="flex gap-4 mb-6 text-sm font-medium text-gray-600 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> ว่างพร้อมจอง
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border shadow-sm">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> ถูกยืมอยู่
            </div>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border shadow-sm">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> ซ่อมบำรุง
            </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockGames.map((game) => (
            <div key={game.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col">
              
              {/* Cover Image Simulation */}
              <div className={`h-48 relative flex items-center justify-center text-7xl ${
                game.status === 'Available' ? 'bg-linear-to-br from-gray-100 to-gray-200' : 'bg-gray-100'
              }`}>
                <span className="drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                    {game.image}
                </span>
                
                {/* Platform Badge */}
                <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded shadow-sm ${
                        game.platform === 'PS5' ? 'bg-white text-blue-700' :
                        game.platform === 'Switch' ? 'bg-red-600 text-white' :
                        'bg-blue-800 text-white'
                    }`}>
                        {game.platform}
                    </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-1">{game.name}</h3>
                    <span className="text-sm font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded ml-2 whitespace-nowrap">
                        {game.price}฿
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{game.type}</p>
                </div>
                
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                    {/* Status Text */}
                    <div className="flex flex-col">
                         <span className="text-[10px] text-gray-400 font-medium uppercase">สถานะแผ่น</span>
                         <span className={`text-xs font-bold ${
                            game.status === 'Available' ? 'text-green-600' :
                            game.status === 'Busy' ? 'text-red-500' : 'text-orange-500'
                         }`}>
                            {game.status === 'Available' ? '● ว่าง' : 
                             game.status === 'Busy' ? '● ถูกยืม' : '● ปรับปรุง'}
                         </span>
                    </div>

                  <button 
                    disabled={game.status !== 'Available'}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      game.status === 'Available' 
                        ? 'bg-gray-900 text-white hover:bg-purple-600 hover:shadow-md' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {game.status === 'Available' ? 'จองแผ่น' : 'ไม่ว่าง'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
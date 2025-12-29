import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Routes>
      {/* ถ้าเข้า Path ว่างๆ (/) ให้กระโดดไปหน้า Login ทันที */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* เส้นทางหน้า Login */}
      <Route path="/login" element={<Login />} />
      
      {/* เส้นทางหน้า Register */}
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
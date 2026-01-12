import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';

/**
 * 🟡 ไฟล์ main.tsx
 * ==========================================
 * นี่คือ "จุดเริ่มต้น" (Entry Point) ของ React Application
 * เมื่อเราสั่ง `npm run dev` เว็บไซต์จะวิ่งมาที่ไฟล์นี้เป็นไฟล์แรก
 */

// 1. ค้นหา <div> ที่มี id="root" ในไฟล์ index.html
// นี่คือ "กล่องเปล่า" ที่ React จะเอาหน้าเว็บทั้งหมดไปใส่ไว้ข้างใน
const rootElement = document.getElementById('root')!;

// 2. สร้าง "ราก" (Root) ของ React
ReactDOM.createRoot(rootElement).render(
  // <React.StrictMode>
  // เป็นโหมดสำหรับนักพัฒนา ช่วยเตือนถ้าเราเขียนโค้ดไม่ดี
  // *ข้อควรรู้*: ในโหมด Dev มันจะรัน useEffect 2 รอบ (เพื่อเช็ค Bug)
  <React.StrictMode>

    {/* 
      3. <BrowserRouter>
      คือตัวจัดการ "ระบบนำทาง" (Routing) ของเว็บไซต์
      ทำให้เราเปลี่ยนหน้า (เช่น /login -> /dashboard) ได้โดยไม่ต้อง
      โหลดหน้าเว็บใหม่ (Refresh) เหมือนเว็บสมัยก่อน (Single Page Application)
    */}
    <BrowserRouter>
      {/* 4. เรียกใช้ <App /> ซึ่งเป็น Component หลักของโปรแกรม */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
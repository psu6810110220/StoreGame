import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // 1. เพิ่มบรรทัดนี้

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. เอา BrowserRouter มาครอบ App ไว้ */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
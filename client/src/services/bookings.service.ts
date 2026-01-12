const API_URL = "http://localhost:3000";

/**
 * 🟢 ฟังก์ชันสร้างการจองใหม่ (Create Booking)
 * ----------------------------------------
 * หน้าที่: ส่งข้อมูลการจองที่ผู้ใช้เลือก (สินค้า, วันที่) ไปยัง Backend
 * 
 * 📥 Parameters:
 * 1. token: JWT Token ของผู้ใช้ (สำคัญมาก! ใช้ยืนยันว่าใครเป็นคนจอง)
 * 2. bookingData: Object ข้อมูล เช่น { pickupDate: '...', items: [...] }
 * 
 * 🔄 Flow การทำงาน:
 * 1. ยิง Request ไปที่ `POST /bookings`
 * 2. แนบ Header `Authorization: Bearer <token>` เพื่อผ่าน Guard ของ Server
 * 3. รอรับ Response
 *    - ✅ สำเร็จ: คืนค่า JSON กลับไปให้ Component
 *    - ❌ ล้มเหลว: โยน Error ออกไปพร้อมข้อความจาก Server
 */
export const createBooking = async (token: string, bookingData: any) => {
    const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // <-- บัตรผ่านยืนยันตัวตน
        },
        body: JSON.stringify(bookingData), // แปลงข้อมูล JS Object -> JSON String ส่งไป
    });

    // ตรวจสอบสถานะการตอบกลับ (Response Status)
    // response.ok จะเป็น true ถ้า status code คือ 200-299
    if (!response.ok) {
        const errorData = await response.json();
        // โยน Error เพื่อให้หน้าบ้าน (try-catch) จับได้และแจ้งเตือนผู้ใช้
        throw new Error(errorData.message || "Failed to create booking");
    }
    return response.json();
};

/**
 * 🔵 ฟังก์ชันดูประวัติการจองของฉัน (Get My Bookings)
 * ----------------------------------------
 * หน้าที่: ดึงรายการจองเฉพาะของ User ที่ล็อกอินอยู่
 * 
 * 🔄 Flow การทำงาน:
 * 1. ยิง Request ไปที่ `GET /bookings/my`
 * 2. Server จะแกะ Token ดูว่าเราคือ User ID ไหน และ query เฉพาะของคนนั้นมาให้
 */
export const getMyBookings = async (token: string) => {
    const response = await fetch(`${API_URL}/bookings/my`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to fetch bookings");
    return response.json();
};

/**
 * 🔴 ฟังก์ชันดูการจองทั้งหมด (Get All Bookings - Admin Only)
 * ----------------------------------------
 * หน้าที่: ดึงรายการจองของทุกคนในระบบ (สำหรับหน้า Admin)
 * 
 * ⚠️ Requirement: User ที่ถือ Token นี้ต้องมี role เป็น 'admin' เท่านั้น
 * ถ้าเป็น user ธรรมดายิงไป -> Server จะตอบกลับ 403 Forbidden
 */
export const getAllBookings = async (token: string) => {
    const response = await fetch(`${API_URL}/bookings`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to fetch all bookings");
    return response.json();
};

/**
 * 🟠 ฟังก์ชันอัปเดตสถานะการจอง (Update Booking Status)
 * ----------------------------------------
 * หน้าที่: เปลี่ยนสถานะของงานจอง เช่น PENDING -> CONFIRMED
 * มักใช้เมื่อ Admin กดอนุมัติ หรือกดยกเลิก
 */
export const updateBookingStatus = async (token: string, bookingId: number, status: string) => {
    const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: "PATCH", // ใช้ PATCH เพราะแก้ไขแค่บางฟิลด์ (status)
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update booking status");
    return response.json();
};

/**
 * 🟣 ฟังก์ชันอัปเดตสถานะการจ่ายเงิน (Update Payment Status)
 * ----------------------------------------
 * หน้าที่: เปลี่ยนสถานะการโอนเงิน เช่น PENDING -> PAID (จ่ายแล้ว)
 */
export const updatePaymentStatus = async (token: string, bookingId: number, status: string) => {
    const response = await fetch(`${API_URL}/bookings/${bookingId}/payment-status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update payment status");
    return response.json();
};

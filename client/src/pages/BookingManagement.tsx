import React, { useEffect, useState } from 'react';
import { getAllBookings, updateBookingStatus, updatePaymentStatus } from '../services/bookings.service';
import { useAuth } from '../context/AuthContext';

interface BookingManagementProps {
    onClose: () => void;
}


const TABLE_HEAD_STICKY = "bg-slate-800 text-slate-400 uppercase font-bold text-xs sticky top-0 z-10 shadow-md";
const BADGE_ITEM = "text-xs bg-slate-700 px-2 py-0.5 rounded border border-white/5";
const BTN_VIEW_SLIP = "text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded hover:bg-indigo-500 hover:text-white transition";
const BTN_ACTION_APPROVE = "bg-emerald-500 hover:bg-emerald-400 text-white p-1.5 rounded shadow-lg transition";
const BTN_ACTION_REJECT = "bg-red-500 hover:bg-red-400 text-white p-1.5 rounded shadow-lg transition";
const BADGE_STATUS_PAID = "px-2 py-1 rounded text-xs font-bold text-emerald-400 bg-emerald-400/10";
const BADGE_STATUS_REJECTED = "px-2 py-1 rounded text-xs font-bold text-red-400 bg-red-400/10";
const BADGE_STATUS_PENDING = "px-2 py-1 rounded text-xs font-bold text-yellow-400 bg-yellow-400/10";

/**
 * 🟡 BookingManagement Component
 * ==========================================
 * หน้าจอสำหรับ Admin เพื่อจัดการการจองทั้งหมด
 * - ดูรายการจอง (List)
 * - ตรวจสอบสลิปโอนเงิน (Verify Payment)
 * - อนุมัติ/ปฏิเสธ การจอง (Approve/Reject)
 */
const BookingManagement: React.FC<BookingManagementProps> = ({ onClose }) => {
    const { token } = useAuth();

    // 1. State Management
    const [bookings, setBookings] = useState<any[]>([]); // เก็บข้อมูลการจองทั้งหมด
    const [loading, setLoading] = useState(true);        // สถานะการโหลดข้อมูล
    const [selectedSlip, setSelectedSlip] = useState<string | null>(null); // เก็บ URL รูปสลิปที่กำลังดูอยู่

    // 2. โหลดข้อมูล Booking ทั้งหมดเมื่อเปิดหน้านี้ (Component Mount)
    useEffect(() => {
        fetchBookings();
    }, []);

    // ฟังก์ชันดึงข้อมูลจาก API
    const fetchBookings = async () => {
        try {
            if (token) {
                const data = await getAllBookings(token);
                // ตรวจสอบว่าได้ Array จริงไหมเพื่อกัน Error
                if (Array.isArray(data)) {
                    setBookings(data);
                } else {
                    console.error("Data is not array:", data);
                    setBookings([]);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 3. ฟังก์ชันเปลี่ยนสถานะการจอง (Update Booking Status)
    // เช่น เปลี่ยนจาก PENDING -> CONFIRMED
    const handleStatusChange = async (id: number, status: string) => {
        if (!token) return;
        try {
            await updateBookingStatus(token, id, status);
            fetchBookings(); // โหลดข้อมูลใหม่เพื่ออัปเดตหน้าจอทันที
        } catch (error) {
            alert("Failed to update status");
        }
    };

    // 4. ฟังก์ชันตรวจสอบการชำระเงิน (Approve/Reject Payment)
    // ใช้เมื่อ Admin กดปุ่ม ✅ หรือ ❌ หลังดูสลิป
    const handlePaymentAction = async (id: number, action: 'APPROVE' | 'REJECT') => {
        if (!token) return;
        if (!window.confirm(`Are you sure you want to ${action} this payment?`)) return;

        try {
            // ถ้า Approve -> สถานะการจ่ายเงิน = PAID
            // ถ้า Reject -> สถานะการจ่ายเงิน = REJECTED
            const status = action === 'APPROVE' ? 'PAID' : 'REJECTED';
            await updatePaymentStatus(token, id, status);

            // Business Logic พิเศษ:
            // ถ้าอนุมัติการจ่ายเงิน (APPROVE) -> ให้เปลี่ยนสถานะการจองเป็น "ยืนยันแล้ว" (CONFIRMED) ให้อัตโนมัติเลย
            if (action === 'APPROVE') {
                await updateBookingStatus(token, id, 'CONFIRMED');
            }
            fetchBookings(); // โหลดข้อมูลใหม่
            setSelectedSlip(null); // ปิดหน้าต่างดูสลิป
        } catch (error) {
            alert("Failed to update payment status");
        }
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    📅 Manage Bookings
                </h2>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-white"
                >
                    ✕ Close
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-700 max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className={TABLE_HEAD_STICKY}>
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Items</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Deposit</th>
                            <th className="px-6 py-4 text-center">Slip</th>
                            <th className="px-6 py-4">Payment</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700 bg-slate-800/50">
                        {loading && (
                            <tr>
                                <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                                    <span className="animate-pulse">Loading bookings...</span>
                                </td>
                            </tr>
                        )}

                        {!loading && bookings.length === 0 && (
                            <tr>
                                <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                                    No bookings found.
                                </td>
                            </tr>
                        )}

                        {!loading && bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-slate-700/30 transition">
                                <td className="px-6 py-4 font-mono text-xs">#{booking.id}</td>
                                <td className="px-6 py-4 font-medium text-white">
                                    {booking.user?.username || <span className="text-red-400 italic">Deleted User</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        {booking.bookingItems && booking.bookingItems.length > 0 ? (
                                            booking.bookingItems.map((item: any) => (
                                                <span key={item.id} className={BADGE_ITEM}>
                                                    {item.game?.title || 'Unknown Game'} (x{item.quantity})
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-500 italic text-xs">No items</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-white font-bold">฿{parseFloat(booking.totalAmount || 0).toLocaleString()}</td>
                                <td className="px-6 py-4 text-emerald-400 font-bold">฿{parseFloat(booking.depositAmount || 0).toLocaleString()}</td>
                                <td className="px-6 py-4 text-center">
                                    {booking.slipUrl ? (
                                        <button
                                            onClick={() => setSelectedSlip(booking.slipUrl)}
                                            className={BTN_VIEW_SLIP}
                                        >
                                            View Slip 📄
                                        </button>
                                    ) : (
                                        <span className="text-slate-600 text-xs">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={booking.paymentStatus === 'PAID' ? BADGE_STATUS_PAID :
                                        booking.paymentStatus === 'REJECTED' ? BADGE_STATUS_REJECTED :
                                            BADGE_STATUS_PENDING
                                    }>
                                        {booking.paymentStatus || 'PENDING'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={booking.status}
                                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                        className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value="PENDING">PENDING</option>
                                        <option value="CONFIRMED">CONFIRMED</option>
                                        <option value="COMPLETED">COMPLETED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {booking.paymentStatus === 'PENDING' && booking.slipUrl && (
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => handlePaymentAction(booking.id, 'APPROVE')}
                                                className={BTN_ACTION_APPROVE}
                                                title="Approve Payment"
                                            >
                                                ✅
                                            </button>
                                            <button
                                                onClick={() => handlePaymentAction(booking.id, 'REJECT')}
                                                className={BTN_ACTION_REJECT}
                                                title="Reject Payment"
                                            >
                                                ❌
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Slip Preview Modal */}
            {selectedSlip && (
                <div className="fixed inset-0 z-modal-overlay flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedSlip(null)}>
                    <div className="relative max-w-lg w-full bg-slate-800 rounded-2xl p-2 border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <img src={selectedSlip} alt="Payment Slip" className="w-full h-auto rounded-xl" />
                        <button
                            onClick={() => setSelectedSlip(null)}
                            className="absolute -top-4 -right-4 bg-red-500 text-white w-8 h-8 rounded-full shadow-lg hover:bg-red-600 transition flex items-center justify-center font-bold"
                        >
                            ✕
                        </button>
                        <div className="p-4 text-center">
                            <p className="text-slate-400 text-sm">Verify the payment details carefully.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingManagement;

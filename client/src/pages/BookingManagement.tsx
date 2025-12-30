import React, { useEffect, useState } from 'react';
import { getAllBookings, updateBookingStatus, updatePaymentStatus } from '../services/bookings.service';
import { useAuth } from '../context/AuthContext';

interface BookingManagementProps {
    onClose: () => void;
}

const BookingManagement: React.FC<BookingManagementProps> = ({ onClose }) => {
    const { token } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlip, setSelectedSlip] = useState<string | null>(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            if (token) {
                const data = await getAllBookings(token);
                // Ensure data is array
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

    const handleStatusChange = async (id: number, status: string) => {
        if (!token) return;
        try {
            await updateBookingStatus(token, id, status);
            fetchBookings();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handlePaymentAction = async (id: number, action: 'APPROVE' | 'REJECT') => {
        if (!token) return;
        if (!window.confirm(`Are you sure you want to ${action} this payment?`)) return;

        try {
            const status = action === 'APPROVE' ? 'PAID' : 'REJECTED';
            await updatePaymentStatus(token, id, status);
            // If Approved, also confirm the booking
            if (action === 'APPROVE') {
                await updateBookingStatus(token, id, 'CONFIRMED');
            }
            fetchBookings();
            setSelectedSlip(null);
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
                    <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-xs sticky top-0 z-10 shadow-md">
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
                                                <span key={item.id} className="text-xs bg-slate-700 px-2 py-0.5 rounded border border-white/5">
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
                                            className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded hover:bg-indigo-500 hover:text-white transition"
                                        >
                                            View Slip 📄
                                        </button>
                                    ) : (
                                        <span className="text-slate-600 text-xs">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${booking.paymentStatus === 'PAID' ? 'text-emerald-400 bg-emerald-400/10' :
                                        booking.paymentStatus === 'REJECTED' ? 'text-red-400 bg-red-400/10' :
                                            'text-yellow-400 bg-yellow-400/10'
                                        }`}>
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
                                                className="bg-emerald-500 hover:bg-emerald-400 text-white p-1.5 rounded shadow-lg transition"
                                                title="Approve Payment"
                                            >
                                                ✅
                                            </button>
                                            <button
                                                onClick={() => handlePaymentAction(booking.id, 'REJECT')}
                                                className="bg-red-500 hover:bg-red-400 text-white p-1.5 rounded shadow-lg transition"
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
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedSlip(null)}>
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

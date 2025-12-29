import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllBookings, updateBookingStatus } from '../services/bookings.service';

interface BookingItem {
    id: number;
    quantity: number;
    game: {
        title: string;
        price: number;
    };
}

interface User {
    id: number;
    username: string;
    phoneNumber: string;
}

interface Booking {
    id: number;
    bookingDate: string;
    pickupDate: string;
    status: string;
    user: User;
    bookingItems: BookingItem[];
}

const BookingManagement: React.FC = () => {
    const { token } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<number | null>(null);

    const fetchBookings = async () => {
        try {
            if (token) {
                const data = await getAllBookings(token);
                setBookings(data);
            }
        } catch (error) {
            console.error("Failed to fetch all bookings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [token]);

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        setUpdating(id);
        try {
            if (token) {
                await updateBookingStatus(token, id, newStatus);
                // Refresh locally
                setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
            }
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        } finally {
            setUpdating(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'PENDING': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'COMPLETED': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'CANCELLED': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    if (loading) return <div className="text-center py-10 text-slate-400">Loading bookings...</div>;

    return (
        <div className="overflow-x-auto">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-indigo-400">📋</span> All Reserve Items
            </h3>

            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-sm uppercase tracking-wide">
                        <th className="p-4 font-semibold">ID</th>
                        <th className="p-4 font-semibold">User Info</th>
                        <th className="p-4 font-semibold">Game(s)</th>
                        <th className="p-4 font-semibold">Pickup Date</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                    {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-mono text-slate-500">#{booking.id}</td>
                            <td className="p-4">
                                <div className="font-bold text-white">{booking.user.username}</div>
                                <div className="text-xs text-slate-500">{booking.user.phoneNumber}</div>
                            </td>
                            <td className="p-4">
                                <ul className="space-y-1">
                                    {booking.bookingItems.map((item, i) => (
                                        <li key={i} className="text-slate-300">
                                            • {item.game.title} <span className="text-xs text-slate-500">x{item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td className="p-4 text-slate-300 font-medium">
                                {new Date(booking.pickupDate).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
                                    <div className="flex justify-end gap-2">
                                        {booking.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                                                disabled={updating === booking.id}
                                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs transition shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                                            >
                                                Confirm
                                            </button>
                                        )}
                                        {booking.status === 'CONFIRMED' && (
                                            <button
                                                onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                                                disabled={updating === booking.id}
                                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                            >
                                                Complete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {bookings.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    No bookings found.
                </div>
            )}
        </div>
    );
};

export default BookingManagement;

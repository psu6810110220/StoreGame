import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyBookings } from '../services/bookings.service';
import SnowBackground from '../components/SnowBackground';

interface BookingItem {
    id: number;
    quantity: number;
    game: {
        id: number;
        title: string;
        price: number;
        imageUrl: string;
    };
}

interface Booking {
    id: number;
    bookingDate: string;
    pickupDate: string;
    status: string;
    totalAmount: number;
    depositAmount: number;
    paymentStatus: string;
    slipUrl: string;
    bookingItems: BookingItem[];
}

const MyBookings: React.FC = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                if (token) {
                    const data = await getMyBookings(token);
                    // Handle potential decimal strings from backend
                    const sanitizedData = data.map((b: any) => ({
                        ...b,
                        totalAmount: parseFloat(b.totalAmount),
                        depositAmount: parseFloat(b.depositAmount)
                    }));
                    setBookings(sanitizedData);
                }
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [token]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'PENDING': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'CANCELLED': return 'bg-red-500/20 text-red-300 border-red-500/30';
            case 'COMPLETED': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'text-emerald-400';
            case 'REJECTED': return 'text-red-400';
            default: return 'text-yellow-400';
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col relative text-white">
            <SnowBackground />

            {/* Navbar */}
            <nav className="bg-slate-800/80 backdrop-blur-md shadow-sm border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="bg-indigo-500 p-2 rounded-lg text-white font-bold shadow-lg shadow-indigo-500/50">SG</div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-400">
                        StoreGame
                    </span>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                    &larr; Back to Dashboard
                </button>
            </nav>

            <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full z-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-extrabold flex items-center gap-3">
                        <span className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400">📅</span>
                        My Bookings
                    </h2>
                    <div className="text-slate-400 text-sm">
                        Total Bookings: <span className="text-white font-bold">{bookings.length}</span>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-400 animate-pulse">Loading your bookings...</div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800/50 rounded-3xl border border-white/5">
                        <div className="text-6xl mb-4">🛒</div>
                        <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
                        <p className="text-slate-400 mb-6">Looks like you haven't booked any games yet.</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-bold transition shadow-lg shadow-indigo-500/30"
                        >
                            Browse Games
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-indigo-500/30 transition-all duration-300 shadow-lg">
                                <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center bg-white/5">
                                    <div className="flex gap-4 items-center">
                                        <div className="bg-slate-700 h-10 w-10 rounded-full flex items-center justify-center font-bold text-slate-300">
                                            #{booking.id}
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Booked on</p>
                                            <p className="font-medium text-slate-200">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 items-center">
                                        <div>
                                            <p className="text-xs text-slate-400 text-right">Pickup Date</p>
                                            <p className="font-bold text-indigo-300">{new Date(booking.pickupDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Left: Items */}
                                        <div className="md:col-span-2 space-y-4">
                                            {booking.bookingItems.map((item, index) => (
                                                <div key={index} className="flex gap-4 items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <div className="h-16 w-16 bg-slate-700 rounded-lg overflow-hidden shrink-0">
                                                        <img
                                                            src={item.game.imageUrl}
                                                            alt={item.game.title}
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Game';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-white">{item.game.title}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-slate-400 text-sm">฿{item.game.price.toLocaleString()} x {item.quantity}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Right: Payment Info */}
                                        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                                            <div>
                                                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Payment Info</h5>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-slate-400 text-sm">Total:</span>
                                                    <span className="text-white font-bold text-sm">฿{booking.totalAmount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between mb-4">
                                                    <span className="text-slate-400 text-sm">Deposit (10%):</span>
                                                    <span className="text-emerald-400 font-black">฿{booking.depositAmount.toLocaleString()}</span>
                                                </div>
                                                <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                                                    <span className="text-slate-400 text-xs text-right">Payment Status:</span>
                                                    <span className={`text-sm font-black uppercase ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                                        {booking.paymentStatus}
                                                    </span>
                                                </div>
                                            </div>

                                            {booking.slipUrl && (
                                                <a
                                                    href={booking.slipUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-4 block text-center py-2 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-lg border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
                                                >
                                                    View Transfer Slip 📄
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyBookings;

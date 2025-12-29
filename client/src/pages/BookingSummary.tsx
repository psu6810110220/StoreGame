import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/bookings.service';
import SnowBackground from '../components/SnowBackground';

// Define the interface for the game object passed via location state
interface Game {
    id: number;
    title: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
}

const BookingSummary: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token } = useAuth();
    const game = location.state?.game as Game;

    const [pickupDate, setPickupDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success',
    });

    // Handle case where user navigates directly without state
    if (!game) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">No Game Selected</h2>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-700"
                    >
                        Go Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const handleConfirmBooking = async () => {
        if (!pickupDate) {
            setPopup({ show: true, message: 'Please select a pickup date', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const bookingData = {
                pickupDate: new Date(pickupDate).toISOString(),
                items: [
                    {
                        gameId: game.id,
                        quantity: 1 // Default to 1 for now
                    }
                ]
            };

            if (token) {
                await createBooking(token, bookingData);
                setPopup({ show: true, message: 'Jong Samrej! (Booking Successful)', type: 'success' });
            }
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.message.includes('stock') ? 'Out of Stock' : 'Booking Failed';
            setPopup({ show: true, message: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const closePopup = () => {
        setPopup({ ...popup, show: false });
        if (popup.type === 'success') {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden">
            <SnowBackground />

            <div className="flex-1 flex items-center justify-center p-6 z-10">
                <div className="bg-slate-800/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/10 max-w-2xl w-full">
                    <h2 className="text-3xl font-extrabold text-white mb-6 text-center">Booking Summary</h2>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Game Image */}
                        <div className="w-full md:w-1/3">
                            <div className="aspect-3/4 rounded-xl overflow-hidden shadow-lg border border-white/10">
                                <img
                                    src={game.imageUrl}
                                    alt={game.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="w-full md:w-2/3 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
                                <p className="text-indigo-400 font-semibold text-lg mb-4">฿{game.price.toLocaleString()}</p>
                                <p className="text-slate-300 text-sm mb-6">{game.description}</p>

                                <div className="mb-6">
                                    <label htmlFor="pickupDate" className="block text-slate-400 text-sm font-bold mb-2">
                                        Select Pickup Date
                                    </label>
                                    <input
                                        type="date"
                                        id="pickupDate"
                                        value={pickupDate}
                                        onChange={(e) => setPickupDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-auto">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition focus:outline-none focus:ring-2 focus:ring-slate-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmBooking}
                                    disabled={loading}
                                    className={`flex-1 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition transform hover:-translate-y-1 ${loading
                                        ? 'bg-indigo-500/50 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30'
                                        }`}
                                >
                                    {loading ? 'Processing...' : 'Confirm Booking'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup Modal */}
            {popup.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-slate-800 border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl transform scale-100 animate-in zoom-in-95 duration-300">
                        <div className="text-center">
                            <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-6 ${popup.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                {popup.type === 'success' ? (
                                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                {popup.type === 'success' ? 'Success!' : 'Error'}
                            </h3>
                            <p className="text-slate-300 mb-6">{popup.message}</p>
                            <button
                                onClick={closePopup}
                                className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition ${popup.type === 'success'
                                    ? 'bg-green-600 hover:bg-green-500 shadow-green-500/30'
                                    : 'bg-red-600 hover:bg-red-500 shadow-red-500/30'
                                    }`}
                            >
                                {popup.type === 'success' ? 'OK' : 'Try Again'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingSummary;

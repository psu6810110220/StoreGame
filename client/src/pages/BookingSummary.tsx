import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/bookings.service';
import SnowBackground from '../components/SnowBackground';

//String Configuration for PromptPay
// 👇👇👇 CHANGE YOUR PROMPTPAY NUMBER HERE 👇👇👇
const PROMPTPAY_NUMBER = "1801301340741"; // e.g., "1801301340741" or Tax ID "1234567890123"
const ACCOUNT_NAME = "MR SORNTHEP RODBUATONG";
// 👆👆👆 CHANGE YOUR ACCOUNT NAME HERE 👆👆👆

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
    // Safely access game state with optional chaining
    const game = location.state?.game as Game | undefined;

    const [pickupDate, setPickupDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [slipUrl, setSlipUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const [popup, setPopup] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success',
    });

    // Handle case where user navigates directly without state or game is missing
    if (!game) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white relative overflow-hidden">
                <SnowBackground />
                <div className="text-center z-10 bg-slate-800/80 p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
                    <h2 className="text-2xl font-bold mb-4">No Game Selected</h2>
                    <p className="text-slate-400 mb-6">Please select a game from the dashboard first.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-700 text-white font-bold transition shadow-lg shadow-indigo-500/30"
                    >
                        Go Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const depositAmount = game.price * 0.10;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                setSlipUrl(data.url);
            } else {
                alert("Upload failed");
            }
        } catch (err) {
            console.error(err);
            alert("Error uploading slip");
        } finally {
            setUploading(false);
        }
    };

    const handleConfirmBooking = async () => {
        if (!pickupDate) {
            setPopup({ show: true, message: 'Please select a pickup date', type: 'error' });
            return;
        }

        if (!slipUrl) {
            setPopup({ show: true, message: 'Please upload a payment slip', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            const bookingData = {
                pickupDate: new Date(pickupDate).toISOString(),
                items: [
                    {
                        gameId: game.id,
                        quantity: 1
                    }
                ],
                slipUrl: slipUrl
            };

            if (token) {
                await createBooking(token, bookingData);
                setPopup({ show: true, message: 'Booking & Payment Submitted! Waiting for admin approval.', type: 'success' });
            }
        } catch (error: any) {
            console.error(error);
            setPopup({ show: true, message: error.message || 'Booking Failed', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const closePopup = () => {
        setPopup({ ...popup, show: false });
        if (popup.type === 'success') {
            navigate('/my-bookings');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden">
            <SnowBackground />

            <div className="flex-1 flex items-center justify-center p-6 z-10">
                <div className="bg-slate-800/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/10 max-w-4xl w-full">
                    <h2 className="text-3xl font-extrabold text-white mb-6 text-center">Booking Summary & Payment</h2>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Game Card & Details */}
                        <div className="flex-1 space-y-6">
                            <div className="flex gap-4 p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                                <div className="w-24 h-32 rounded-lg overflow-hidden shrink-0">
                                    <img src={game.imageUrl} className="w-full h-full object-cover" alt={game.title} />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h3 className="text-xl font-bold text-white">{game.title}</h3>
                                    <p className="text-slate-400 text-sm line-clamp-2 mt-1">{game.description}</p>
                                </div>
                            </div>

                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-400">Game Price</span>
                                    <span className="text-white font-medium">฿{game.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-y border-white/5">
                                    <span className="text-slate-400">Total Calculation</span>
                                    <div className="text-right">
                                        <div className="text-xs text-indigo-400 uppercase font-bold tracking-widest">Deposit Required (10%)</div>
                                        <div className="text-2xl font-black text-emerald-400">฿{depositAmount.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-slate-400 text-sm font-bold mb-2">Select Pickup Date</label>
                                    <input
                                        type="date"
                                        value={pickupDate}
                                        onChange={(e) => setPickupDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="w-full md:w-[350px] space-y-6 flex flex-col">
                            <div className="bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center">
                                <div className="text-center mb-4">
                                    <h4 className="text-slate-900 font-black text-lg">PROMPT PAY QR</h4>
                                    <p className="text-slate-500 text-xs mt-1">Scan to pay exact deposit amount</p>
                                </div>

                                {/* Dynamic QR Code (Locks the Amount) */}
                                <div className="w-64 h-64 overflow-hidden border-4 border-slate-100 rounded-3xl relative flex items-center justify-center bg-white shadow-inner p-2">
                                    <img
                                        src={`https://promptpay.io/${PROMPTPAY_NUMBER}/${depositAmount}`}
                                        alt="PromptPay QR"
                                        className="w-full h-full object-contain mix-blend-multiply"
                                        onError={(e) => {
                                            // Fallback to static image if API fails
                                            (e.target as HTMLImageElement).src = '/my-qr.jpg';
                                        }}
                                    />
                                </div>

                                <div className="mt-4 text-center">
                                    <span className="text-xs text-slate-400">Account Name</span>
                                    <p className="font-bold text-slate-800">{ACCOUNT_NAME}</p>
                                </div>
                            </div>

                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex-1 flex flex-col">
                                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs">2</span>
                                    Upload Payment Slip
                                </h4>

                                <div className="relative group flex-1 min-h-[120px]">
                                    {slipUrl ? (
                                        <div className="relative h-full rounded-xl overflow-hidden border-2 border-emerald-500">
                                            <img src={slipUrl} className="w-full h-full object-cover" alt="Slip" />
                                            <button
                                                onClick={() => setSlipUrl('')}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="border-2 border-dashed border-slate-600 rounded-2xl h-full flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-slate-800/30 transition-all">
                                            <span className="text-2xl mb-2">{uploading ? '⌛' : '📤'}</span>
                                            <span className="text-xs text-slate-400 font-medium">Click to upload slip</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-bold transition active:scale-95"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleConfirmBooking}
                            disabled={loading || uploading || !slipUrl || !pickupDate}
                            className={`flex-[2] px-6 py-4 rounded-2xl font-black text-lg text-white shadow-xl transition transform active:scale-95 ${loading || !slipUrl || !pickupDate
                                ? 'bg-indigo-500/50 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/30'
                                }`}
                        >
                            {loading ? 'Submitting...' : 'Pay & Confirm Booking'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Popup Modal */}
            {popup.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
                        <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-6 ${popup.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {popup.type === 'success' ? (
                                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">{popup.type === 'success' ? 'Great!' : 'Oops!'}</h3>
                        <p className="text-slate-300 mb-8">{popup.message}</p>
                        <button
                            onClick={closePopup}
                            className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition ${popup.type === 'success' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingSummary;

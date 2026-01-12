import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Game } from '../types';

interface GameCardProps {
    game: Game;
}

const CARD_GAME_CLASS = "bg-slate-800/40 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 border border-white/10 hover:border-indigo-500/50 ring-1 ring-white/5 hover:ring-indigo-500/30 flex flex-col group/card relative";
const BTN_BOOK_ACTIVE = "mt-4 w-full py-2.5 rounded-xl font-bold transition-all shadow-lg btn-gradient-primary text-white shadow-indigo-500/30 transform hover:scale-[1.02]";
const BTN_BOOK_DISABLE = "mt-4 w-full py-2.5 rounded-xl font-bold transition-all shadow-lg bg-slate-700 text-slate-500 cursor-not-allowed";

const GameCard: React.FC<GameCardProps> = ({ game }) => {
    const navigate = useNavigate();

    return (
        <div className={CARD_GAME_CLASS}>
            {/* Seasonal Decoration: Small snowflake on card */}
            <div className="absolute top-2 right-2 text-white/10 text-2xl z-10 select-none pointer-events-none group-hover/card:text-white/30 transition-colors">❄</div>

            <div className="h-48 overflow-hidden relative group">
                <img
                    src={game.imageUrl}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                />
                {game.stockQuantity === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white font-bold text-xl uppercase tracking-wider border-2 border-white px-4 py-1">Out of Stock</span>
                    </div>
                )}

                {/* Action Hover Overlay */}
                {game.stockQuantity > 0 && (
                    <div className="absolute inset-0 bg-indigo-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <span className="text-white font-bold bg-indigo-600 px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">Book Now</span>
                    </div>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-lg font-bold text-white line-clamp-1 group-hover/card:text-indigo-300 transition-colors" title={game.title}>
                        {game.title}
                    </h3>
                    {/* Display First Category as Tag */}
                    {game.categories && game.categories.length > 0 && (
                        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide whitespace-nowrap">
                            {game.categories[0]}
                        </span>
                    )}
                </div>

                {/* Additional Categories if any */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {game.categories?.slice(1).map((cat: string) => (
                        <span key={cat} className="text-[10px] text-slate-400 bg-slate-700/50 px-1.5 py-0.5 rounded border border-slate-600">
                            #{cat}
                        </span>
                    ))}
                </div>

                <p className="text-slate-400 text-sm mb-4 line-clamp-2" title={game.description}>
                    {game.description}
                </p>

                <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500">Price</span>
                        <span className="text-xl font-bold text-emerald-400">฿{game.price.toLocaleString()}</span>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="text-xs text-slate-500">Stock</span>
                        <span className={`font-bold ${game.stockQuantity < 5 ? 'text-rose-400' : 'text-slate-300'}`}>
                            {game.stockQuantity} items
                        </span>
                    </div>
                </div>

                <button
                    disabled={game.stockQuantity === 0}
                    onClick={() => navigate('/booking-summary', { state: { game } })}
                    className={game.stockQuantity > 0 ? BTN_BOOK_ACTIVE : BTN_BOOK_DISABLE}
                >
                    {game.stockQuantity > 0 ? 'Book This Game ✨' : 'Sold Out'}
                </button>
            </div>
        </div>
    );
};

export default GameCard;

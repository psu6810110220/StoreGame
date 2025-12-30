import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGames } from '../services/games.service';

const GAME_CATEGORIES = ['Action', 'Adventure', 'RPG', 'Simulation', 'Strategy', 'Sports', 'Racing', 'Puzzle', 'Shooter', 'Fighting', 'Horror', 'Platformer'];

interface Game {
    id: number;
    title: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    categories?: string[];
}

const GameList: React.FC = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Empty array means 'All'

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchGames = async () => {
            try {
                if (token) {
                    const data = await getGames(token);
                    setGames(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("Failed to fetch games", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [token]);

    // Filtering Logic
    const filteredGames = selectedCategories.length === 0
        ? games
        : games.filter(game =>
            game.categories?.some(cat => selectedCategories.includes(cat))
        );

    // Pagination Logic (Based on Filtered Games)
    const indexOfLastGame = currentPage * itemsPerPage;
    const indexOfFirstGame = indexOfLastGame - itemsPerPage;
    const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
    const totalPages = Math.ceil(filteredGames.length / itemsPerPage);

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategories]);

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    if (loading) {
        return <div className="text-center py-10 text-slate-400">Loading games...</div>;
    }

    return (
        <div className="mt-8">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">🎮 Available Games</h2>
                </div>

                {/* Category Filter - Multi-select, Flex Wrap, Compact */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategories([])}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all border ${selectedCategories.length === 0
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                            }`}
                    >
                        All
                    </button>
                    {GAME_CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => toggleCategory(cat)}
                            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all border flex items-center gap-1 ${selectedCategories.includes(cat)
                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            {cat}
                            {selectedCategories.includes(cat) && <span>✓</span>}
                        </button>
                    ))}
                </div>
            </div>

            {filteredGames.length === 0 ? (
                <div className="text-center py-16 bg-slate-800/20 rounded-3xl border border-white/5">
                    <p className="text-slate-500 text-lg">No games found in the selected categories.</p>
                    {selectedCategories.length > 0 && (
                        <button
                            onClick={() => setSelectedCategories([])}
                            className="mt-4 text-indigo-400 hover:text-indigo-300 font-bold underline"
                        >
                            View All Games
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentGames.map((game) => (
                            <div key={game.id} className="bg-slate-800/40 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 border border-white/10 hover:border-indigo-500/50 ring-1 ring-white/5 hover:ring-indigo-500/30 flex flex-col group/card relative">
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
                                        {game.categories?.slice(1).map(cat => (
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
                                        className={`mt-4 w-full py-2.5 rounded-xl font-bold transition-all shadow-lg ${game.stockQuantity > 0
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/30 transform hover:scale-[1.02]'
                                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                            }`}
                                    >
                                        {game.stockQuantity > 0 ? 'Book This Game ✨' : 'Sold Out'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls - Highlighted Visibility */}
                    {totalPages > 1 && (
                        <div className="flex flex-col items-center gap-4 mt-12 bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border-2 border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                            <span className="text-slate-400 text-sm font-medium uppercase tracking-widest">Navigate Pages</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => changePage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-6 py-3 rounded-2xl bg-slate-700 text-white border border-white/10 hover:bg-indigo-600 hover:border-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all transform active:scale-95 font-bold shadow-lg flex items-center gap-2 group"
                                >
                                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Prev
                                </button>

                                {/* Page Numbers - Large & Glowing */}
                                <div className="flex gap-3 mx-4">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => changePage(page)}
                                            className={`w-14 h-14 rounded-2xl font-extrabold text-lg transition-all flex items-center justify-center shadow-xl ${currentPage === page
                                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white scale-110 shadow-indigo-500/50 ring-2 ring-white/20'
                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/10 hover:scale-105'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => changePage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-6 py-3 rounded-2xl bg-slate-700 text-white border border-white/10 hover:bg-indigo-600 hover:border-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all transform active:scale-95 font-bold shadow-lg flex items-center gap-2 group"
                                >
                                    Next <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default GameList;

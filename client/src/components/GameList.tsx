import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGames } from '../services/games.service';

interface Game {
    id: number;
    title: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
}

const GameList: React.FC = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="text-center py-10">Loading games...</div>;
    }

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">🎮 Available Games</h2>

            {games.length === 0 ? (
                <p className="text-gray-500">No games available at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {games.map((game) => (
                        <div key={game.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
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
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={game.title}>
                                        {game.title}
                                    </h3>
                                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-semibold">
                                        RPG
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2 title={game.description}">
                                    {game.description}
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500">Price</span>
                                        <span className="text-xl font-bold text-green-600">฿{game.price.toLocaleString()}</span>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-gray-500">Stock</span>
                                        <span className={`font-medium ${game.stockQuantity < 5 ? 'text-red-500' : 'text-gray-700'}`}>
                                            {game.stockQuantity} items
                                        </span>
                                    </div>
                                </div>

                                <button
                                    disabled={game.stockQuantity === 0}
                                    onClick={() => navigate('/booking-summary', { state: { game } })}
                                    className={`mt-4 w-full py-2 rounded-lg font-medium transition-colors ${game.stockQuantity > 0
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-lg shadow-indigo-500/30'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {game.stockQuantity > 0 ? 'Book This Game' : 'Sold Out'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GameList;

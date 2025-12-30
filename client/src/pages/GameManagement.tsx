import React, { useState, useEffect } from "react";
import { getGames, createGame, updateGame, deleteGame } from "../services/games.service";
import { useAuth } from "../context/AuthContext";

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

const GameManagement: React.FC = () => {
    const { token, user } = useAuth();
    const [games, setGames] = useState<Game[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGame, setEditingGame] = useState<Game | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: 0,
        stockQuantity: 0,
        imageUrl: "",
        categories: [] as string[],
    });

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            if (token) {
                const data = await getGames(token);
                setGames(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Error fetching games:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            if (editingGame) {
                await updateGame(token, editingGame.id, formData);
            } else {
                await createGame(token, formData);
            }
            setIsModalOpen(false);
            setEditingGame(null);
            setFormData({
                title: "",
                description: "",
                price: 0,
                stockQuantity: 0,
                imageUrl: "",
                categories: [],
            });
            fetchGames();
        } catch (error) {
            alert("Error saving game: " + (error as any).message);
            console.error(error);
        }
    };

    const handleEdit = (game: Game) => {
        setEditingGame(game);
        setFormData({
            title: game.title,
            description: game.description,
            price: game.price,
            stockQuantity: game.stockQuantity,
            imageUrl: game.imageUrl,
            categories: game.categories || [],
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!token || !window.confirm("Are you sure you want to delete this game?")) return;
        try {
            await deleteGame(token, id);
            fetchGames();
        } catch (error) {
            console.error("Error deleting game:", error);
        }
    };

    const toggleCategory = (category: string) => {
        setFormData(prev => {
            const currentCats = prev.categories || [];
            if (currentCats.includes(category)) {
                return { ...prev, categories: currentCats.filter(c => c !== category) };
            } else {
                return { ...prev, categories: [...currentCats, category] };
            }
        });
    };

    const toggleFilterCategory = (category: string) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    if (user?.role !== 'admin') {
        return null;
    }

    const filteredGames = games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            game.categories?.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategories.length === 0 ||
            game.categories?.some(c => selectedCategories.includes(c));

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="p-6 bg-slate-800 rounded-lg shadow-lg border border-slate-700 mt-6 text-white">
            <div className="flex flex-col gap-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="text-2xl">🎮</span> Game Management
                    </h2>

                    <div className="flex gap-4 w-full md:w-auto">
                        {/* Search Bar */}
                        <div className="relative flex-1 md:w-64">
                            <input
                                type="text"
                                placeholder="Search games..."
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 px-4 pl-10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                        </div>

                        <button
                            onClick={() => {
                                setEditingGame(null);
                                setFormData({ title: "", description: "", price: 0, stockQuantity: 0, imageUrl: "", categories: [] });
                                setIsModalOpen(true);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold shadow-md transition-all active:scale-95 whitespace-nowrap"
                        >
                            <span className="text-xl">+</span> Add New
                        </button>
                    </div>
                </div>

                {/* Filter Tags */}
                <div className="flex flex-wrap gap-2 items-center bg-slate-900/30 p-3 rounded-xl border border-slate-700/50">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Filter by Tag:</span>
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
                            onClick={() => toggleFilterCategory(cat)}
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

            <div className="overflow-hidden rounded-xl border border-slate-700 shadow-sm">
                <table className="min-w-full bg-slate-800 text-left">
                    <thead>
                        <tr className="bg-slate-700/50 text-slate-300 border-b border-slate-700">
                            <th className="py-4 px-6 font-semibold uppercase tracking-wider text-sm">Title</th>
                            <th className="py-4 px-6 font-semibold uppercase tracking-wider text-sm">Categories</th>
                            <th className="py-4 px-6 font-semibold uppercase tracking-wider text-sm">Price</th>
                            <th className="py-4 px-6 font-semibold uppercase tracking-wider text-sm">Stock</th>
                            <th className="py-4 px-6 font-semibold uppercase tracking-wider text-sm text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {filteredGames.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-slate-500">
                                    {(searchTerm || selectedCategories.length > 0) ? "No games match your search filters." : "No games found. Start by adding one!"}
                                </td>
                            </tr>
                        ) : (
                            filteredGames.map((game) => (
                                <tr key={game.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            {game.imageUrl && (
                                                <img src={game.imageUrl} alt={game.title} className="w-10 h-10 rounded object-cover bg-slate-900 hidden sm:block" />
                                            )}
                                            <span className="font-medium text-white">{game.title}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-wrap gap-1">
                                            {game.categories && game.categories.length > 0 ? game.categories.map(c => (
                                                <span key={c} className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                                                    {c}
                                                </span>
                                            )) : <span className="text-slate-500 text-xs">-</span>}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-bold text-emerald-400">฿{game.price.toLocaleString()}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${game.stockQuantity > 0
                                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                            }`}>
                                            {game.stockQuantity} items
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(game)}
                                            className="text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500 p-2 rounded-lg transition-all border border-indigo-500/30"
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(game.id)}
                                            className="text-red-300 hover:text-white bg-red-500/20 hover:bg-red-500 p-2 rounded-lg transition-all border border-red-500/30"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="relative bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-700 overflow-hidden transform transition-all scale-100 p-0 my-8 flex flex-col max-h-[90vh]">
                            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50 shrink-0">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    {editingGame ? "✏️ Edit Game" : "✨ Add New Game"}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Basic Info */}
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                                placeholder="Enter game title"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                                            <textarea
                                                required
                                                rows={3}
                                                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                                                placeholder="What is this game about?"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Pricing & Stock */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Price (฿)</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-slate-500">฿</span>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 pl-8 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Stock</label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                                value={formData.stockQuantity}
                                                onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    {/* Categories */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Categories</label>
                                        <div className="flex flex-wrap gap-2 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                            {GAME_CATEGORIES.map(category => {
                                                const isSelected = formData.categories && formData.categories.includes(category);
                                                return (
                                                    <button
                                                        key={category}
                                                        type="button"
                                                        onClick={() => toggleCategory(category)}
                                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${isSelected
                                                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                                                            : 'bg-slate-800 text-slate-400 border-slate-600 hover:border-slate-500 hover:text-slate-200'
                                                            }`}
                                                    >
                                                        {category} {isSelected && '✓'}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Image Section */}
                                    <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
                                        <label className="block text-sm font-medium text-slate-300 mb-3">Game Cover Image</label>

                                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                                            {/* Preview */}
                                            <div className="w-full sm:w-32 h-32 shrink-0 bg-slate-900 rounded-lg overflow-hidden border border-slate-600 flex items-center justify-center relative group">
                                                {formData.imageUrl ? (
                                                    <img
                                                        src={formData.imageUrl}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-4xl opacity-20">📷</span>
                                                )}
                                            </div>

                                            {/* Inputs */}
                                            <div className="flex-1 space-y-3 w-full">
                                                <div className="relative">
                                                    <input
                                                        type="url"
                                                        required
                                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 pl-9 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
                                                        placeholder="Image URL"
                                                        value={formData.imageUrl}
                                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                                    />
                                                    <span className="absolute left-3 top-2.5 text-slate-400">🔗</span>
                                                </div>
                                                <div className="text-center text-slate-500 text-xs">- OR -</div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const formDataUpload = new FormData();
                                                            formDataUpload.append('file', file);
                                                            try {
                                                                const btn = e.target;
                                                                btn.disabled = true;
                                                                btn.style.opacity = '0.5';
                                                                const res = await fetch('http://localhost:3000/upload', {
                                                                    method: 'POST',
                                                                    body: formDataUpload
                                                                });
                                                                const data = await res.json();
                                                                if (data.url) {
                                                                    setFormData(prev => ({ ...prev, imageUrl: data.url }));
                                                                } else {
                                                                    alert("Upload failed: " + (data.message || "Unknown error"));
                                                                }
                                                                btn.disabled = false;
                                                                btn.style.opacity = '1';
                                                            } catch (err) {
                                                                alert("Error uploading file.");
                                                                e.target.disabled = false;
                                                                e.target.style.opacity = '1';
                                                            }
                                                        }
                                                    }}
                                                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-700 mt-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-5 py-2.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white font-medium transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 font-bold shadow-lg shadow-indigo-500/30 transition transform active:scale-95 flex items-center gap-2"
                                        >
                                            {editingGame ? "💾 Save Changes" : "🚀 Create Game"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameManagement;

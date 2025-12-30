import React, { useState, useEffect } from "react";
import { getGames, createGame, updateGame, deleteGame } from "../services/games.service";
import { useAuth } from "../context/AuthContext";

interface Game {
    id: number;
    title: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
}

const GameManagement: React.FC = () => {
    const { token, user } = useAuth();
    const [games, setGames] = useState<Game[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGame, setEditingGame] = useState<Game | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: 0,
        stockQuantity: 0,
        imageUrl: "",
    });

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            if (token) {
                const data = await getGames(token);
                setGames(data);
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

    if (user?.role !== 'admin') {
        return null;
    }

    return (
        <div className="p-6 bg-slate-800 rounded-lg shadow-lg border border-slate-700 mt-6 text-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-2xl">🎮</span> Game Management
                </h2>
                <button
                    onClick={() => {
                        setEditingGame(null);
                        setFormData({ title: "", description: "", price: 0, stockQuantity: 0, imageUrl: "" });
                        setIsModalOpen(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold shadow-md transition-all active:scale-95"
                >
                    <span className="text-xl">+</span> Add New Game
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-700 shadow-sm">
                <table className="min-w-full bg-slate-800 text-left">
                    <thead>
                        <tr className="bg-slate-700/50 text-slate-300 border-b border-slate-700">
                            <th className="py-4 px-6 font-semibold uppercase tracking-wider text-sm">Title</th>
                            <th className="py-4 px-6 font-semibold uppercase tracking-wider text-sm">Price</th>
                            <th className="py-4 px-6 font-semibold uppercase tracking-wider text-sm">Stock</th>
                            <th className="py-4 px-6 font-semibold uppercase tracking-wider text-sm text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {games.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-slate-500">
                                    No games found. Start by adding one!
                                </td>
                            </tr>
                        ) : (
                            games.map((game) => (
                                <tr key={game.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="py-4 px-6 font-medium text-white">{game.title}</td>
                                    <td className="py-4 px-6 font-bold text-emerald-400">฿{game.price.toLocaleString()}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${game.stockQuantity > 0
                                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                            }`}>
                                            {game.stockQuantity} items
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center space-x-3">
                                        <button
                                            onClick={() => handleEdit(game)}
                                            className="text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500 px-3 py-1.5 rounded-md transition-all text-sm font-medium border border-indigo-500/30"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(game.id)}
                                            className="text-red-300 hover:text-white bg-red-500/20 hover:bg-red-500 px-3 py-1.5 rounded-md transition-all text-sm font-medium border border-red-500/30"
                                        >
                                            Delete
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
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="relative bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700 overflow-hidden transform transition-all scale-100 p-0 my-8">
                            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                                <h3 className="text-xl font-bold text-white">
                                    {editingGame ? "✏️ Edit Game" : "✨ Add New Game"}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
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

                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Price (฿)</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                    <div className="flex-1">
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

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Image</label>

                                    {/* Image Preview */}
                                    {formData.imageUrl && (
                                        <div className="mb-3 relative group w-full h-48 bg-slate-900 rounded-lg overflow-hidden border border-slate-600">
                                            <img
                                                src={formData.imageUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-sm font-light">Current Image</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-3">
                                        {/* URL Input */}
                                        <div className="relative">
                                            <input
                                                type="url"
                                                required
                                                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 pl-9 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
                                                placeholder="Paste image URL here..."
                                                value={formData.imageUrl}
                                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            />
                                            <span className="absolute left-3 top-2.5 text-slate-400">🔗</span>
                                        </div>

                                        <div className="text-center text-slate-500 text-xs">- OR -</div>

                                        {/* File Upload Input */}
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const formDataUpload = new FormData();
                                                        formDataUpload.append('file', file);

                                                        try {
                                                            // Visual feedback
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
                                                            alert("Error uploading file. Please check server connection.");
                                                            console.error(err);
                                                            e.target.disabled = false;
                                                            e.target.style.opacity = '1';
                                                        }
                                                    }
                                                }}
                                                className="block w-full text-sm text-slate-400
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-indigo-500/10 file:text-indigo-400
                                            hover:file:bg-indigo-500/20
                                            cursor-pointer"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500">* Uploaded images are saved securely on the server.</p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-2.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white font-medium transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 font-bold shadow-lg shadow-indigo-500/30 transition transform active:scale-95"
                                    >
                                        {editingGame ? "Save Changes" : "Create Game"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameManagement;

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
            alert("Error saving game");
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
        <div className="p-6 bg-white rounded-lg shadow-md mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">🎮 Game Management</h2>
                <button
                    onClick={() => {
                        setEditingGame(null);
                        setFormData({ title: "", description: "", price: 0, stockQuantity: 0, imageUrl: "" });
                        setIsModalOpen(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    + Add New Game
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border">Title</th>
                            <th className="py-2 px-4 border">Price</th>
                            <th className="py-2 px-4 border">Stock</th>
                            <th className="py-2 px-4 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map((game) => (
                            <tr key={game.id} className="hover:bg-gray-50 text-center">
                                <td className="py-2 px-4 border text-left">{game.title}</td>
                                <td className="py-2 px-4 border text-green-600 font-bold">฿{game.price}</td>
                                <td className="py-2 px-4 border">{game.stockQuantity}</td>
                                <td className="py-2 px-4 border space-x-2">
                                    <button
                                        onClick={() => handleEdit(game)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(game.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">{editingGame ? "Edit Game" : "Add New Game"}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border rounded p-2"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea
                                    required
                                    className="w-full border rounded p-2"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium">Price</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full border rounded p-2"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium">Stock</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full border rounded p-2"
                                        value={formData.stockQuantity}
                                        onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Image URL</label>
                                <input
                                    type="url"
                                    required
                                    className="w-full border rounded p-2"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameManagement;

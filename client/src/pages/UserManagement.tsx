import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, deleteUser } from '../services/users.service';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
}

const UserManagement: React.FC = () => {
    const { token, user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            if (token) {
                const data = await getAllUsers(token);
                setUsers(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            if (token) {
                await deleteUser(token, id);
                setUsers(users.filter(u => u.id !== id));
            }
        } catch (error) {
            alert("Failed to delete user");
        }
    };

    if (loading) return <div className="text-center py-10 text-slate-400">Loading members...</div>;

    return (
        <div className="relative">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-3xl">🎄</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                    Member List
                </span>
            </h3>

            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-xl bg-slate-800/40 backdrop-blur-md">
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-900/90 backdrop-blur-xl text-slate-400 text-xs uppercase tracking-wider z-10 shadow-sm">
                            <tr>
                                <th className="p-4 font-bold border-b border-white/10">ID</th>
                                <th className="p-4 font-bold border-b border-white/10">Username</th>
                                <th className="p-4 font-bold border-b border-white/10">Email</th>
                                <th className="p-4 font-bold border-b border-white/10">Role</th>
                                <th className="p-4 font-bold border-b border-white/10 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-white/5 transition-all duration-200">
                                    <td className="p-4 font-mono text-slate-500 text-xs group-hover:text-indigo-400 transition-colors">
                                        #{user.id}
                                    </td>
                                    <td className="p-4 font-bold text-white flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold ring-2 ring-transparent group-hover:ring-white/20 transition-all">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        {user.username}
                                        {currentUser?.id === user.id && (
                                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                                YOU
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-slate-400">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border shadow-sm ${user.role === 'admin'
                                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {currentUser?.id !== user.id && (
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-slate-400 hover:text-white hover:bg-rose-600/80 bg-slate-700/50 px-3 py-1.5 rounded-lg transition-all shadow hover:shadow-rose-500/20 text-xs font-bold flex items-center gap-1 ml-auto"
                                            >
                                                <span>🗑️</span> Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {users.length === 0 && <div className="text-center py-12 text-slate-500 italic">No members found.</div>}
        </div>
    );
};

export default UserManagement;

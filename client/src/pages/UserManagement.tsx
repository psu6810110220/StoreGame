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
        <div className="overflow-x-auto">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-indigo-400">👥</span> Member List
            </h3>

            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-sm uppercase tracking-wide">
                        <th className="p-4 font-semibold">ID</th>
                        <th className="p-4 font-semibold">Username</th>
                        <th className="p-4 font-semibold">Email</th>
                        <th className="p-4 font-semibold">Role</th>
                        <th className="p-4 font-semibold text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-mono text-slate-500">#{user.id}</td>
                            <td className="p-4 font-bold text-white">
                                {user.username}
                                {currentUser?.id === user.id && <span className="ml-2 text-xs text-indigo-400">(You)</span>}
                            </td>
                            <td className="p-4">{user.email}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                {currentUser?.id !== user.id && (
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 px-3 py-1.5 rounded transition"
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {users.length === 0 && <div className="text-center py-8 text-slate-500">No members found.</div>}
        </div>
    );
};

export default UserManagement;

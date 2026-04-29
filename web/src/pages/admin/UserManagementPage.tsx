import { useEffect, useState } from 'react';
import { userService } from '../../api/userService';
import { ShieldCheck, ShieldAlert, Trash2, UserCog, Loader2 } from 'lucide-react';

export const UserManagementPage = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await userService.getAllUsers();
            setUsers(res.data);
        } catch (error) {
            console.error("Błąd pobierania agentów", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleToggleRole = async (user: any) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        if (window.confirm(`Czy na pewno zmienić uprawnienia dla ${user.username} na ${newRole.toUpperCase()}?`)) {
            await userService.updateRole(user._id, newRole);
            fetchUsers();
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (window.confirm("UWAGA: Czy na pewno chcesz trwale usunąć tego użytkownika z bazy?")) {
            await userService.deleteUser(id);
            fetchUsers();
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-zinc-950 text-white"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
            <header className="mb-12 border-b border-zinc-800 pb-8">
                <div className="flex items-center gap-3 text-blue-500 mb-2">
                    <UserCog size={20} />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Personnel Management</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter">OPERATIVES REGISTRY</h1>
            </header>

            <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-zinc-800/50 text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
                    <tr>
                        <th className="p-6">Agent Name</th>
                        <th className="p-6">Contact Email</th>
                        <th className="p-6">Access Level</th>
                        <th className="p-6 text-right">Procedures</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                    {users.map(user => (
                        <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="p-6 font-bold flex items-center gap-3">
                                <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-xs text-zinc-400 group-hover:border group-hover:border-blue-500/50">
                                    {user.username.substring(0, 2).toUpperCase()}
                                </div>
                                {user.username}
                            </td>
                            <td className="p-6 text-sm text-zinc-400 font-mono">{user.email}</td>
                            <td className="p-6">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                    user.role === 'admin'
                                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                        : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                }`}>
                                    {user.role === 'admin' ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                                    {user.role}
                                </div>
                            </td>
                            <td className="p-6 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleToggleRole(user)}
                                        className="p-2 hover:bg-amber-500/10 text-amber-500 rounded-lg transition-colors border border-transparent hover:border-amber-500/20"
                                        title="Promote/Demote"
                                    >
                                        <UserCog size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user._id)}
                                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                        title="Terminate Access"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
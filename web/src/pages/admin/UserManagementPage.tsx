import { useEffect, useState } from 'react';
import { userService } from '../../api/userService';
import { useUI } from '../../context/UIContext';
import { ShieldCheck, ShieldAlert, Trash2, UserCog, Loader2 } from 'lucide-react';

function roleLabel(role: string) {
    return role === 'admin' ? 'administrator' : 'użytkownik';
}

export const UserManagementPage = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast, confirm } = useUI();

    const fetchUsers = async () => {
        try {
            const res = await userService.getAllUsers();
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleToggleRole = async (user: any) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        const confirmed = await confirm(`Zmienić uprawnienia użytkownika ${user.username} na ${roleLabel(newRole)}?`);
        if (!confirmed) return;
        try {
            await userService.updateRole(user._id, newRole);
            fetchUsers();
            toast(`Rola zmieniona na ${roleLabel(newRole)}.`, 'success');
        } catch {
            toast('Nie udało się zaktualizować roli.', 'error');
        }
    };

    const handleDeleteUser = async (id: string) => {
        const confirmed = await confirm('Trwale usunąć tego użytkownika z bazy danych?');
        if (!confirmed) return;
        try {
            await userService.deleteUser(id);
            fetchUsers();
            toast('Użytkownik usunięty.', 'success');
        } catch {
            toast('Nie udało się usunąć użytkownika.', 'error');
        }
    };

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <Loader2 className="animate-spin text-slate-300" size={32} />
            </div>
        );
    }

    return (
        <div>
            <header className="mb-8">
                <h1 className="page-title">Użytkownicy</h1>
                <p className="page-subtitle mt-1">Zarządzaj kontami i poziomami dostępu</p>
            </header>

            <div className="card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-5 py-3">Imię i nazwa</th>
                            <th className="px-5 py-3">E-mail</th>
                            <th className="px-5 py-3">Rola</th>
                            <th className="px-5 py-3 text-right">Akcje</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map(user => (
                            <tr key={user._id} className="table-row group">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3 table-cell-strong">
                                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-400">
                                        {user.username.substring(0, 2).toUpperCase()}
                                    </div>
                                        {user.username}
                                    </div>
                                </td>
                                <td className="px-5 py-4 table-cell">{user.email}</td>
                                <td className="px-5 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                                        user.role === 'admin'
                                            ? 'bg-red-50 text-red-700 border border-red-100'
                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    }`}>
                                        {user.role === 'admin' ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                                        {roleLabel(user.role)}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleToggleRole(user)}
                                            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                            title="Zmień rolę"
                                        >
                                            <UserCog size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Usuń użytkownika"
                                        >
                                            <Trash2 size={16} />
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

import React, { useState, useEffect } from 'react';
import { userService } from '../../api/userService';
import { User, Lock, ShieldCheck, Loader2, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '', email: '' });
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | '', msg: string }>({ type: '', msg: '' });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const info = userData.user || userData;
        setUser({
            username: info.username || '',
            email: info.email || ''
        });
    }, []);

    const handleUpdateInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            await userService.updateProfile(user);

            const current = JSON.parse(localStorage.getItem('user') || '{}');
            if (current.user) {
                current.user = { ...current.user, ...user };
            } else {
                Object.assign(current, user);
            }
            localStorage.setItem('user', JSON.stringify(current));

            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('userUpdate'));

            setStatus({ type: 'success', msg: 'Profil zaktualizowany pomyślnie.' });

        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Aktualizacja profilu nie powiodła się.';
            setStatus({ type: 'error', msg: message });
        } finally { setLoading(false); }
    };

    const handleChangePass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return setStatus({ type: 'error', msg: 'Nowe hasła nie są identyczne.' });
        }
        setLoading(true);
        try {
            await userService.changePassword({
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });
            setStatus({ type: 'success', msg: 'Hasło zmienione pomyślnie.' });
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Zmiana hasła nie powiodła się.';
            setStatus({ type: 'error', msg: message });
        } finally { setLoading(false); }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-muted hover:text-accent transition-colors mb-6 group text-sm"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span>Wstecz</span>
            </button>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="page-title">Mój profil</h1>
                    <p className="page-subtitle mt-1">Zarządzaj danymi konta i hasłem</p>
                </div>
                <div className="p-3 bg-accent-muted rounded-xl text-accent">
                    <ShieldCheck size={28} />
                </div>
            </div>

            {status.msg && (
                <div className={`mb-6 p-4 rounded-xl border ${
                    status.type === 'success'
                        ? 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400'
                }`}>
                    {status.msg}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="card p-6 md:p-8">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-900 dark:text-slate-100">
                            <User size={20} className="text-accent" /> Podstawowe informacje
                        </h2>
                        <form onSubmit={handleUpdateInfo} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="form-label">Nazwa użytkownika</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={user.username}
                                        onChange={e => setUser({...user, username: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="form-label">Adres e-mail</label>
                                    <input
                                        type="email"
                                        className="input-field"
                                        value={user.email}
                                        onChange={e => setUser({...user, email: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Zapisz zmiany
                            </button>
                        </form>
                    </div>
                </div>

                <div className="card p-6 md:p-8">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-900 dark:text-slate-100">
                        <Lock size={20} className="text-rose-500" /> Bezpieczeństwo
                    </h2>
                    <form onSubmit={handleChangePass} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Obecne hasło"
                            className="input-field"
                            value={passwords.oldPassword}
                            onChange={e => setPasswords({...passwords, oldPassword: e.target.value})}
                            required
                        />
                        <hr className="border-slate-200 dark:border-slate-800 my-2" />
                        <input
                            type="password"
                            placeholder="Nowe hasło"
                            className="input-field"
                            value={passwords.newPassword}
                            onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Powtórz nowe hasło"
                            className="input-field"
                            value={passwords.confirmPassword}
                            onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
                            required
                        />
                        <button type="submit" disabled={loading} className="btn-primary w-full">
                            Zaktualizuj hasło
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

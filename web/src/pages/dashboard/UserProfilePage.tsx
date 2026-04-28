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
        try {
            await userService.updateProfile(user);
            setStatus({ type: 'success', msg: 'Dane profilowe zostały zaktualizowane.' });

            // Aktualizacja localStorage
            const current = JSON.parse(localStorage.getItem('user') || '{}');
            if (current.user) current.user = { ...current.user, ...user };
            else Object.assign(current, user);
            localStorage.setItem('user', JSON.stringify(current));

        } catch (err: any) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Błąd aktualizacji profilu.' });
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
            setStatus({ type: 'success', msg: 'Hasło zostało zmienione pomyślnie.' });
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Błąd zmiany hasła.' });
        } finally { setLoading(false); }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-6 group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span>Powrót</span>
            </button>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mój Profil</h1>
                    <p className="text-gray-500">Zarządzaj swoją tożsamością w systemie Voyager AI</p>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <ShieldCheck size={32} />
                </div>
            </div>

            {status.msg && (
                <div className={`mb-6 p-4 rounded-xl border ${
                    status.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                    {status.msg}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* LEWA KOLUMNA: DANE */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
                            <User size={20} className="text-indigo-500" /> Informacje podstawowe
                        </h2>
                        <form onSubmit={handleUpdateInfo} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nazwa użytkownika</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                                        value={user.username}
                                        onChange={e => setUser({...user, username: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Adres Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all"
                                        value={user.email}
                                        onChange={e => setUser({...user, email: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Zapisz zmiany
                            </button>
                        </form>
                    </div>
                </div>

                {/* PRAWA KOLUMNA: HASŁO */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
                        <Lock size={20} className="text-rose-500" /> Bezpieczeństwo
                    </h2>
                    <form onSubmit={handleChangePass} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Aktualne hasło"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-rose-500 transition-all text-sm"
                            value={passwords.oldPassword}
                            onChange={e => setPasswords({...passwords, oldPassword: e.target.value})}
                        />
                        <hr className="border-gray-100 my-2" />
                        <input
                            type="password"
                            placeholder="Nowe hasło"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm"
                            value={passwords.newPassword}
                            onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                        />
                        <input
                            type="password"
                            placeholder="Powtórz nowe hasło"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm"
                            value={passwords.confirmPassword}
                            onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all"
                        >
                            Aktualizuj hasło
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
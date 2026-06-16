import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useUI } from '../../context/UIContext';
import { AppearancePanel } from '../../components/common/AppearancePanel';
import { Mail, Lock, Compass, ArrowRight, Loader2, User } from 'lucide-react';

export const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useUI();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Hasła nie są identyczne');
        }

        setLoading(true);
        setError('');
        try {
            await api.post('/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            toast('Konto utworzone! Możesz się teraz zalogować.', 'success');
            navigate('/login');
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Rejestracja nie powiodła się';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 relative py-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200/50 via-transparent to-transparent dark:from-slate-800/30 pointer-events-none" />
            <div className="absolute top-4 right-4 z-10">
                <AppearancePanel />
            </div>

            <div className="w-full max-w-[400px] relative">
                <div className="card p-8 shadow-xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4 shadow-sm">
                            <Compass size={24} className="text-white dark:text-slate-900" />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Utwórz konto</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Dołącz do Smart Voyager</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nazwa użytkownika</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Twoje imię"
                                    className="input-field pl-10"
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="input-field pl-10"
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Hasło</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    placeholder="Min. 6 znaków"
                                    className="input-field pl-10"
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Potwierdź hasło</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    placeholder="Powtórz hasło"
                                    className="input-field pl-10"
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <button disabled={loading} type="submit" className="btn-primary w-full mt-2 py-3">
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Utwórz konto
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                        Masz już konto?{' '}
                        <Link to="/login" className="text-accent font-medium hover:underline">
                            Zaloguj się
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

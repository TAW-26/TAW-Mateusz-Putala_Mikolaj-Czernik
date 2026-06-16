import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useUI } from '../../context/UIContext';
import { AppearancePanel } from '../../components/common/AppearancePanel';
import { Mail, Lock, Compass, ArrowRight, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useUI();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
            window.location.reload();
        } catch {
            toast('Logowanie nie powiodło się. Sprawdź e-mail i hasło.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 relative">
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
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Witaj ponownie</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Zaloguj się do Smart Voyager</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Hasło</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <button disabled={loading} type="submit" className="btn-primary w-full mt-2 py-3">
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Zaloguj się
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                        Nie masz konta?{' '}
                        <Link to="/register" className="text-accent font-medium hover:underline">
                            Zarejestruj się
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

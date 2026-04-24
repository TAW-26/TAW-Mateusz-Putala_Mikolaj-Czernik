import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { Mail, Lock, Compass, ArrowRight, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
            window.location.reload();
        } catch (error) {
            alert('Nie udało się zalogować. Sprawdź dane (admin@voyager.pl / Haslo123!)');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6">
            <div className="w-full max-w-[400px]">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10">
                    <div className="p-4 bg-zinc-900 rounded-[2rem] text-white mb-4 shadow-xl shadow-zinc-200">
                        <Compass size={32} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter text-zinc-900">Welcome Back</h1>
                    <p className="text-zinc-500 text-sm mt-2">Log in to your Voyager AI account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email Input */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <input
                                required
                                type="email"
                                placeholder="admin@voyager.pl"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-zinc-100 border-2 border-zinc-300 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:border-zinc-900 ring-zinc-900/5 transition-all placeholder:text-zinc-400"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <input
                                required
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-zinc-100 border-2 border-zinc-300 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:border-zinc-900 ring-zinc-900/5 transition-all placeholder:text-zinc-400"
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-zinc-900 text-white rounded-2xl py-4 mt-4 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50 group shadow-lg shadow-zinc-100"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <span className="font-bold uppercase tracking-widest text-xs text-white">Sign In</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-white" />
                            </>
                        )}
                    </button>
                </form>

                {/* Registration Link */}
                <p className="mt-8 text-center text-zinc-500 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-zinc-900 font-bold hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};
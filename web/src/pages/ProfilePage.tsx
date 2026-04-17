import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import type { User } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Fingerprint,
    Zap,
    Circle,
    CheckCircle2,
    Globe2,
    Lock,
    User as UserIcon,
    ArrowRight
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const interestOptions = [
        { id: 'architektura_zabytkowa', label: 'History Architecture' },
        { id: 'architektura_nowoczesna', label: 'Modernism' },
        { id: 'kuchnia_lokalna', label: 'Gastronomy' },
        { id: 'winiarnie_browary', label: 'Wineries & Breweries' },
        { id: 'punkty_widokowe', label: 'Photo Spots' },
        { id: 'muzea_sztuki', label: 'Art Gallery' }
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/profile');
                setUser(res.data.user);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const toggleInterest = (id: string) => {
        if (!user) return;
        const current = user.preferences?.interests || [];
        const next = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
        setUser({ ...user, preferences: { ...user.preferences!, interests: next } });
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await api.put('/auth/profile', { preferences: user.preferences });
        } catch (err) {
            console.error("Save failed", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#09090b]">
            <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <Circle className="text-indigo-500 w-12 h-12 opacity-50" />
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30">
            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-[1200px] mx-auto py-16 px-6 relative z-10">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-indigo-400">
                                <Fingerprint size={32} />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="h-px w-4 bg-indigo-500"></span>
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400">Voyager Protocol</p>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-white">
                                {user?.username}<span className="text-indigo-500">.</span>
                            </h2>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="relative group px-8 py-4 bg-white text-black rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 overflow-hidden"
                    >
                        <div className="relative z-10 flex items-center gap-3">
                            {saving ? 'Synchronizing...' : 'Apply Changes'}
                            <Zap size={16} className={saving ? 'animate-pulse' : 'fill-current'} />
                        </div>
                    </button>
                </header>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-12">
                        <section className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md rounded-[2rem] p-8 md:p-10">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <Sparkles className="text-indigo-400" size={20} />
                                </div>
                                <h3 className="text-lg font-semibold">AI Preference Engine</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {interestOptions.map((opt) => {
                                    const active = user?.preferences?.interests.includes(opt.id);
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => toggleInterest(opt.id)}
                                            className={`group relative flex items-center justify-between px-6 py-5 rounded-2xl border transition-all duration-300 ${
                                                active
                                                    ? 'bg-indigo-600/10 border-indigo-500/50 text-white'
                                                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-800/50'
                                            }`}
                                        >
                                            <span className={`text-sm font-medium transition-colors ${active ? 'text-indigo-200' : ''}`}>
                                                {opt.label}
                                            </span>
                                            <div className={`p-1 rounded-full transition-all ${active ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-600 group-hover:text-zinc-400'}`}>
                                                <CheckCircle2 size={14} />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md rounded-[2rem] p-8 md:p-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Globe2 className="text-purple-400" size={20} />
                                </div>
                                <h3 className="text-lg font-semibold">Neural Directives</h3>
                            </div>
                            <textarea
                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 text-sm text-zinc-300 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 outline-none min-h-[180px] transition-all placeholder:text-zinc-700"
                                placeholder="Define specific behaviors for your AI guide..."
                                value={user?.preferences?.personalNotes || ''}
                                onChange={(e) => setUser({...user!, preferences: {...user!.preferences!, personalNotes: e.target.value}})}
                            />
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-8 space-y-6">
                            <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-900/40 border border-zinc-800 backdrop-blur-md rounded-[2.5rem] p-8">
                                <div className="flex items-center gap-2 text-zinc-500 mb-10 text-[10px] font-bold uppercase tracking-[0.2em]">
                                    <Lock size={14} className="text-indigo-500" /> Secure Profile
                                </div>

                                <div className="space-y-8">
                                    <div className="group">
                                        <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2 tracking-widest">Identifier</p>
                                        <div className="flex items-center gap-3 text-zinc-300">
                                            <UserIcon size={16} className="text-zinc-500" />
                                            <p className="text-sm font-medium">{user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-zinc-800/50">
                                        <p className="text-[10px] font-bold text-zinc-600 uppercase mb-4 tracking-widest">Clearance Level</p>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/5 border border-indigo-500/20 rounded-full">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">
                                                Level: {user?.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Help Box */}
                            <div className="p-8 rounded-[2.5rem] bg-indigo-600 flex flex-col gap-4 text-white overflow-hidden relative group cursor-pointer">
                                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                                    <Sparkles size={80} />
                                </div>
                                <h4 className="font-bold text-lg leading-tight relative z-10">Need help with <br/>your configuration?</h4>
                                <div className="flex items-center gap-2 text-sm font-medium opacity-80 group-hover:translate-x-1 transition-transform relative z-10">
                                    View Documentation <ArrowRight size={16} />
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};
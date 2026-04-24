import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import type { User } from '../types';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Fingerprint,
    Zap,
    Circle,
    CheckCircle2,
    Globe2,
    Map,
    ShieldCheck
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const defaultPreferences = {
        interests: [] as string[],
        travelStyle: {
            avoidPaidAttractions: false,
            onlyHiddenGems: false,
            kidFriendly: false,
            disabilityAccess: false,
            preferWalking: false,
        },
        personalNotes: ""
    };

    // Rozbudowana lista zainteresowań dla lepszego profilowania AI
    const interestOptions = [
        { id: 'architektura_zabytkowa', label: 'History Architecture' },
        { id: 'architektura_nowoczesna', label: 'Modernism' },
        { id: 'muzea_sztuki', label: 'Art Gallery' },
        { id: 'muzea_techniki', label: 'Tech Museums' },
        { id: 'historia_wojenna', label: 'War History' },
        { id: 'parki_narodowe', label: 'National Parks' },
        { id: 'góry', label: 'Mountains' },
        { id: 'jeziora_i_rzeki', label: 'Lakes & Rivers' },
        { id: 'punkty_widokowe', label: 'Photo Spots' },
        { id: 'fotografia', label: 'Photography' },
        { id: 'kuchnia_lokalna', label: 'Gastronomy' },
        { id: 'street_food', label: 'Street Food' },
        { id: 'kawiarnie', label: 'Cafes' },
        { id: 'winiarnie_browary', label: 'Wineries & Breweries' },
        { id: 'opcje_wege', label: 'Vegan Options' }
    ];

    // Opcje logiczne zgodne z interfejsem User
    const travelStyleOptions = [
        { id: 'avoidPaidAttractions', label: 'Avoid Paid Attractions' },
        { id: 'onlyHiddenGems', label: 'Only Hidden Gems' },
        { id: 'kidFriendly', label: 'Family Friendly' },
        { id: 'disabilityAccess', label: 'Disability Access' },
        { id: 'preferWalking', label: 'Prefer Walking' }
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
        const currentPrefs = user.preferences || defaultPreferences;
        const currentInterests = currentPrefs.interests || [];
        const nextInterests = currentInterests.includes(id)
            ? currentInterests.filter(i => i !== id)
            : [...currentInterests, id];

        setUser({
            ...user,
            preferences: { ...currentPrefs, interests: nextInterests }
        });
    };

    const toggleTravelStyle = (id: string) => {
        if (!user) return;
        const currentPrefs = user.preferences || defaultPreferences;
        const currentStyles = currentPrefs.travelStyle || defaultPreferences.travelStyle;

        setUser({
            ...user,
            preferences: {
                ...currentPrefs,
                travelStyle: {
                    ...currentStyles,
                    [id]: !((currentStyles as any)[id])
                }
            }
        });
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const res = await api.put('/auth/profile', { preferences: user.preferences });
            const userRaw = localStorage.getItem('user');
            if (userRaw) {
                const currentUser = JSON.parse(userRaw);
                localStorage.setItem('user', JSON.stringify({ ...currentUser, ...res.data.user }));
            }
            alert('Voyager Protocol Synchronized.');
        } catch (err: any) {
            alert("Sync error: " + (err.response?.data?.message || "Check connection"));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#09090b]">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                <Circle className="text-indigo-500 w-12 h-12 opacity-30" />
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-[1200px] mx-auto py-16 px-6 relative z-10">
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
                            <h2 className="text-3xl font-bold tracking-tight text-white">{user?.username}<span className="text-indigo-500">.</span></h2>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="relative group px-8 py-4 bg-white text-black rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                        <div className="relative z-10 flex items-center gap-3">
                            {saving ? 'Syncing...' : 'Apply Changes'}
                            <Zap size={16} className={saving ? 'animate-pulse' : 'fill-current'} />
                        </div>
                    </button>
                </header>

                <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-12">

                        {/* 1. AI INTEREST ENGINE */}
                        <section className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md rounded-[2rem] p-8 md:p-10">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <Sparkles className="text-indigo-400" size={20} />
                                </div>
                                <h3 className="text-lg font-semibold">AI Preference Engine</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {interestOptions.map((opt) => {
                                    const active = user?.preferences?.interests?.includes(opt.id);
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => toggleInterest(opt.id)}
                                            className={`flex items-center justify-between px-4 py-4 rounded-xl border transition-all duration-300 ${
                                                active ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                            }`}
                                        >
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{opt.label}</span>
                                            {active && <CheckCircle2 size={14} className="text-indigo-400" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* 2. TRAVEL LOGIC & CONSTRAINTS */}
                        <section className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md rounded-[2rem] p-8 md:p-10">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <Map className="text-emerald-400" size={20} />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Travel Logic & Constraints</h3>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {travelStyleOptions.map((opt) => {
                                    const travelStyle = user?.preferences?.travelStyle || defaultPreferences.travelStyle;
                                    const active = (travelStyle as any)[opt.id];
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => toggleTravelStyle(opt.id)}
                                            className={`px-5 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                                active ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* 3. NEURAL DIRECTIVES */}
                        <section className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md rounded-[2rem] p-8 md:p-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Globe2 className="text-purple-400" size={20} />
                                </div>
                                <h3 className="text-lg font-semibold">Neural Directives</h3>
                            </div>
                            <textarea
                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 text-sm text-zinc-300 focus:border-purple-500/50 outline-none min-h-[150px] transition-all resize-none"
                                placeholder="Example: Always suggest vegan restaurants or avoid steep stairs..."
                                value={user?.preferences?.personalNotes || ''}
                                onChange={(e) => {
                                    if (!user) return;
                                    const currentPrefs = user.preferences || defaultPreferences;
                                    setUser({
                                        ...user,
                                        preferences: { ...currentPrefs, personalNotes: e.target.value }
                                    });
                                }}
                            />
                        </section>
                    </div>

                    <aside className="lg:col-span-4 space-y-6">
                        <div className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-md rounded-[2.5rem] p-8">
                            <div className="flex items-center gap-2 text-zinc-500 mb-10 text-[10px] font-bold uppercase tracking-[0.2em]">
                                <ShieldCheck size={14} className="text-indigo-500" /> Secure Protocol
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2">Identifier</p>
                                    <p className="text-sm font-medium text-zinc-300">{user?.email}</p>
                                </div>
                                <div className="pt-6 border-t border-zinc-800/50">
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase mb-4">Clearance</p>
                                    <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase">
                                        Level: {user?.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};
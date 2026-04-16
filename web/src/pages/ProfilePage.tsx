// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import type { User } from '../types';

export const ProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const interestOptions = [
        'architektura_zabytkowa', 'muzea_sztuki', 'góry',
        'kuchnia_lokalna', 'winiarnie_browary', 'opcje_wege'
    ];

    useEffect(() => {
        api.get('/auth/profile').then(res => {
            setUser(res.data.user);
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        if (!user) return;
        try {
            await api.put('/auth/profile', {
                preferences: user.preferences
            });
            alert("Profil zaktualizowany!");
        } catch (err) { console.error(err); }
    };

    if (loading) return <p>Ładowanie profilu...</p>;

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Twój Profil AI 🛡️</h2>

            <section className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Czym się interesujesz?</h3>
                <div className="flex flex-wrap gap-2">
                    {interestOptions.map(opt => (
                        <button
                            key={opt}
                            onClick={() => {
                                const current = user?.preferences?.interests || [];
                                const next = current.includes(opt) ? current.filter(i => i !== opt) : [...current, opt];
                                setUser({ ...user!, preferences: { ...user!.preferences!, interests: next } });
                            }}
                            className={`px-4 py-2 rounded-full text-sm transition ${
                                user?.preferences?.interests.includes(opt)
                                    ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {opt.replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>
            </section>

            <section className="mb-8 p-4 bg-indigo-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-indigo-900">Styl Podróżowania</h3>
                <div className="space-y-3">
                    {[
                        { key: 'avoidPaidAttractions', label: 'Unikaj płatnych atrakcji' },
                        { key: 'onlyHiddenGems', label: 'Tylko "perełki" (Hidden Gems)' },
                        { key: 'kidFriendly', label: 'Przyjazne dzieciom' }
                    ].map(style => (
                        <label key={style.key} className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={(user?.preferences?.travelStyle as any)?.[style.key]}
                                onChange={(e) => {
                                    const ts = { ...user!.preferences!.travelStyle, [style.key]: e.target.checked };
                                    setUser({ ...user!, preferences: { ...user!.preferences!, travelStyle: ts } });
                                }}
                                className="w-5 h-5 accent-indigo-600"
                            />
                            <span className="text-gray-700">{style.label}</span>
                        </label>
                    ))}
                </div>
            </section>

            <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
                Zapisz ustawienia podróżnika
            </button>
        </div>
    );
};
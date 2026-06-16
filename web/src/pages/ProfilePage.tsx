import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import type { User } from '../types';
import { useUI } from '../context/UIContext';
import { Loader2 } from 'lucide-react';
import {
    Sparkles,
    Zap,
    CheckCircle2,
    Globe2,
    Map,
    Palmtree,
    Utensils,
    Compass,
    Building2,
    LibraryBig
} from 'lucide-react';

function roleLabel(role?: string) {
    return role === 'admin' ? 'administrator' : 'użytkownik';
}

export const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useUI();

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

    const interestCategories = [
        {
            name: 'Architektura',
            icon: <Building2 size={16} />,
            options: [
                { id: 'architektura_zabytkowa', label: 'Architektura zabytkowa' },
                { id: 'architektura_nowoczesna', label: 'Modernizm i szkło' },
                { id: 'brutalizm', label: 'Brutalizm' },
                { id: 'industrializm', label: 'Design przemysłowy' },
                { id: 'sakralna', label: 'Przestrzenie sakralne' },
                { id: 'urbanistyka', label: 'Urbanistyka' }
            ]
        },
        {
            name: 'Historia i sztuka',
            icon: <LibraryBig size={16} />,
            options: [
                { id: 'muzea_sztuki', label: 'Galerie sztuki' },
                { id: 'muzea_techniki', label: 'Technika i inżynieria' },
                { id: 'historia_wojenna', label: 'Historia wojenna' },
                { id: 'archeologia', label: 'Stanowiska archeologiczne' },
                { id: 'sredniowiecze', label: 'Średniowiecze' },
                { id: 'renesans_barok', label: 'Renesans i barok' },
                { id: 'lokalny_folklor', label: 'Lokalny folklor' }
            ]
        },
        {
            name: 'Natura i outdoor',
            icon: <Palmtree size={16} />,
            options: [
                { id: 'parki_narodowe', label: 'Parki narodowe' },
                { id: 'góry', label: 'Wysokie góry' },
                { id: 'jeziora_i_rzeki', label: 'Jeziora i rzeki' },
                { id: 'gory_hiking', label: 'Wędrówki górskie' },
                { id: 'natura_parki', label: 'Parki miejskie i natura' },
                { id: 'wybrzeze_plaze', label: 'Wybrzeże i plaże' },
                { id: 'jaskinie', label: 'Jaskinie i geologia' }
            ]
        },
        {
            name: 'Jedzenie i napoje',
            icon: <Utensils size={16} />,
            options: [
                { id: 'kuchnia_lokalna', label: 'Kuchnia lokalna' },
                { id: 'street_food', label: 'Street food' },
                { id: 'kawiarnie', label: 'Kultura kawiarni' },
                { id: 'winiarnie_browary', label: 'Winnice i browary' },
                { id: 'opcje_wege', label: 'Opcje wegańskie' },
                { id: 'fine_dining', label: 'Fine dining' },
                { id: 'targi_rolnicze', label: 'Targi rolnicze' }
            ]
        },
        {
            name: 'Styl życia i aktywność',
            icon: <Compass size={16} />,
            options: [
                { id: 'punkty_widokowe', label: 'Punkty widokowe' },
                { id: 'fotografia', label: 'Fotografia' },
                { id: 'zycie_nocne', label: 'Życie nocne' },
                { id: 'zakupy', label: 'Zakupy' },
                { id: 'relaks_spa', label: 'Wellness i spa' },
                { id: 'technologia', label: 'Przyszłość i technologia' },
                { id: 'sporty_ekstremalne', label: 'Sporty ekstremalne' },
                { id: 'lokalne_targi', label: 'Lokalne targi' }
            ]
        }
    ];

    const travelStyleOptions = [
        { id: 'avoidPaidAttractions', label: 'Unikaj płatnych atrakcji' },
        { id: 'onlyHiddenGems', label: 'Tylko ukryte perełki' },
        { id: 'kidFriendly', label: 'Przyjazne rodzinom' },
        { id: 'disabilityAccess', label: 'Dostępność dla osób z niepełnosprawnością' },
        { id: 'preferWalking', label: 'Preferuję chodzenie' }
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
            toast('Preferencje zapisane pomyślnie.', 'success');
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Sprawdź połączenie';
            toast(`Błąd synchronizacji: ${message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-slate-300" size={32} />
        </div>
    );

    return (
        <div>
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="page-title">Preferencje podróży</h1>
                    <p className="page-subtitle mt-1">
                        Te ustawienia pomagają AI dopasować propozycje wycieczek
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary"
                >
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
                    {saving ? 'Zapisywanie…' : 'Zapisz zmiany'}
                </button>
            </header>

            <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">

                        <section className="card p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-6">
                                <Sparkles className="text-slate-500" size={18} />
                                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Zainteresowania</h3>
                            </div>

                            <div className="space-y-10">
                                {interestCategories.map((category) => (
                                    <div key={category.name}>
                                        <div className="flex items-center gap-2 mb-3 text-slate-500">
                                            {category.icon}
                                            <span className="text-xs font-medium text-muted">{category.name}</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            {category.options.map((opt) => {
                                                const active = user?.preferences?.interests?.includes(opt.id);
                                                return (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => toggleInterest(opt.id)}
                                                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                                                            active
                                                                ? 'bg-accent-muted border-accent text-slate-900 dark:text-slate-100'
                                                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                                                        }`}
                                                    >
                                                        <span className="font-medium">{opt.label}</span>
                                                        {active && <CheckCircle2 size={14} />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="card p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-6">
                                <Map className="text-slate-500" size={18} />
                                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Styl podróży</h3>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {travelStyleOptions.map((opt) => {
                                    const travelStyle = user?.preferences?.travelStyle || defaultPreferences.travelStyle;
                                    const active = (travelStyle as any)[opt.id];
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => toggleTravelStyle(opt.id)}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                                                active ? 'bg-accent-muted border-accent text-slate-900 dark:text-slate-100' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="card p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Globe2 className="text-slate-500" size={18} />
                                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Notatki osobiste</h3>
                            </div>
                            <textarea
                                className="input-field min-h-[120px] resize-none"
                                placeholder="Przykład: Zawsze proponuj restauracje wegańskie lub unikaj stromych schodów..."
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

                    <aside className="lg:col-span-4">
                        <div className="card p-6">
                            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-4">Konto</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">E-mail</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{user?.email}</p>
                                </div>
                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-xs text-slate-400 mb-2">Rola</p>
                                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300">
                                        {roleLabel(user?.role)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
        </div>
    );
};

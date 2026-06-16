import React, { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { tripsService } from '../../api/tripsService';
import { TripCard } from '../../components/trips/TripCard';
import { useUI } from '../../context/UIContext';
import { Plus, Loader2, Trash2, Pencil, Heart } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

function formatTripCount(n: number): string {
    if (n === 1) return '1 wycieczka';
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
        return `${n} wycieczki`;
    }
    return `${n} wycieczek`;
}

export const DashboardPage: React.FC = () => {
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast, confirm } = useUI();

    const [searchParams, setSearchParams] = useSearchParams();
    const isFilterFromUrl = searchParams.get('filter') === 'favorites';
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(isFilterFromUrl);

    useEffect(() => {
        setShowOnlyFavorites(isFilterFromUrl);
    }, [isFilterFromUrl]);

    const loadTrips = () => {
        setLoading(true);
        api.get('/trips')
            .then(res => {
                const responseContent = res.data;
                const data = responseContent.data || responseContent || [];
                setTrips(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.error('Failed to load trips:', err);
                setTrips([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadTrips();
    }, []);

    const handleToggleFilter = () => {
        const nextState = !showOnlyFavorites;
        setShowOnlyFavorites(nextState);
        if (nextState) {
            setSearchParams({ filter: 'favorites' });
        } else {
            setSearchParams({});
        }
    };

    const toggleFavorite = async (e: React.MouseEvent, trip: any) => {
        e.preventDefault();
        e.stopPropagation();
        const id = trip._id || trip.id;
        try {
            const newStatus = !trip.isFavorite;
            await tripsService.updateTrip(id, { isFavorite: newStatus });
            setTrips(prev => prev.map(t =>
                (t._id || t.id) === id ? { ...t, isFavorite: newStatus } : t
            ));
        } catch (err) {
            console.error('Favorite toggle failed:', err);
        }
    };

    const handleDeleteTrip = async (id: string) => {
        const confirmed = await confirm('Czy na pewno chcesz usunąć tę wycieczkę?');
        if (!confirmed) return;
        try {
            await tripsService.deleteTrip(id);
            setTrips(prev => prev.filter(t => (t._id || t.id) !== id));
            toast('Wycieczka usunięta.', 'success');
        } catch (err) {
            console.error('Delete failed:', err);
            toast('Nie udało się usunąć wycieczki.', 'error');
        }
    };

    const filteredTrips = useMemo(() => {
        if (showOnlyFavorites) {
            return trips.filter(t => t.isFavorite);
        }
        return trips;
    }, [trips, showOnlyFavorites]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="page-title">
                        {showOnlyFavorites ? 'Ulubione wycieczki' : 'Twoje wycieczki'}
                    </h1>
                    <p className="page-subtitle mt-1">
                        {loading ? 'Ładowanie…' : formatTripCount(filteredTrips.length)}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleToggleFilter}
                        className={`btn-secondary ${
                            showOnlyFavorites ? '!bg-rose-50 dark:!bg-rose-950/40 !border-rose-200 dark:!border-rose-900/50 !text-rose-700 dark:!text-rose-400' : ''
                        }`}
                    >
                        <Heart size={16} fill={showOnlyFavorites ? 'currentColor' : 'none'} />
                        Ulubione
                    </button>

                    <Link to="/dashboard/add-trip" className="btn-primary">
                        <Plus size={16} />
                        Nowa wycieczka
                    </Link>
                </div>
            </div>

            {!showOnlyFavorites && !loading && trips.length === 0 && (
                <div className="card p-6 mb-8">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">Zaplanuj pierwszą wycieczkę</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-md">
                        Utwórz wycieczkę, a AI zaproponuje przystanki na podstawie Twoich preferencji i budżetu.
                    </p>
                    <Link to="/dashboard/add-trip" className="btn-primary">
                        <Plus size={16} />
                        Utwórz wycieczkę
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-full py-16 flex justify-center">
                        <Loader2 className="animate-spin text-slate-300 dark:text-slate-600" size={32} />
                    </div>
                ) : filteredTrips.length > 0 ? (
                    filteredTrips.map((trip: any) => (
                        <div key={trip._id || trip.id} className="relative group">
                            <div className="absolute top-3 right-3 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => toggleFavorite(e, trip)}
                                    className={`p-1.5 rounded-lg border transition-colors ${
                                        trip.isFavorite
                                            ? 'bg-rose-500 text-white border-rose-500'
                                            : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700 hover:text-rose-600'
                                    }`}
                                    title={trip.isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                                >
                                    <Heart size={14} fill={trip.isFavorite ? 'currentColor' : 'none'} />
                                </button>

                                <Link
                                    to={`/dashboard/edit-trip/${trip._id || trip.id}`}
                                    className="p-1.5 bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-700 rounded-lg hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                                >
                                    <Pencil size={14} />
                                </Link>

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteTrip(trip._id || trip.id);
                                    }}
                                    className="p-1.5 bg-white dark:bg-slate-900 text-red-500 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <TripCard trip={trip} />
                        </div>
                    ))
                ) : !loading && (
                    <div className="col-span-full py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl card">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {showOnlyFavorites ? 'Brak ulubionych wycieczek.' : 'Nie znaleziono wycieczek.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

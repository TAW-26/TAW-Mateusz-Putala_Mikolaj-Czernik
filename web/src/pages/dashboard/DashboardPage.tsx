import React, { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { tripsService } from '../../api/tripsService';
import { TripCard } from '../../components/trips/TripCard';
import { Plus, LayoutGrid, Activity, Loader2, Trash2, Settings, Heart } from 'lucide-react';
// Zmieniony import: dodano useSearchParams
import { Link, useSearchParams } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Obsługa parametrów URL (?filter=favorites)
    const [searchParams, setSearchParams] = useSearchParams();
    const isFilterFromUrl = searchParams.get('filter') === 'favorites';

    const [showOnlyFavorites, setShowOnlyFavorites] = useState(isFilterFromUrl);

    // 2. Synchronizacja stanu z adresem URL
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
                console.error("Błąd ładowania:", err);
                setTrips([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadTrips();
    }, []);

    // 3. Funkcja przełączania filtra (aktualizuje też URL)
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
            console.error("Favorite toggle failed:", err);
        }
    };

    const handleDeleteTrip = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this journey?")) return;
        try {
            await tripsService.deleteTrip(id);
            setTrips(prev => prev.filter(t => (t._id || t.id) !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const filteredTrips = useMemo(() => {
        if (showOnlyFavorites) {
            return trips.filter(t => t.isFavorite);
        }
        return trips;
    }, [trips, showOnlyFavorites]);

    return (
        <div className="max-w-[1200px] mx-auto py-12 px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                        <Activity size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Dashboard</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter text-zinc-900">
                        {showOnlyFavorites ? 'Favorite Journeys' : 'Your Journeys'}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleToggleFilter}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all border ${
                            showOnlyFavorites
                                ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm'
                                : 'bg-zinc-100 border-transparent text-zinc-600 hover:bg-zinc-200'
                        }`}
                    >
                        <Heart size={16} fill={showOnlyFavorites ? "currentColor" : "none"} />
                        {showOnlyFavorites ? "Showing Favorites" : "All Trips"}
                    </button>

                    <Link
                        to="/dashboard/add-trip"
                        className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                    >
                        <Plus size={16} /> New Adventure
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!showOnlyFavorites && (
                    <>
                        <div className="lg:col-span-2 p-8 bg-zinc-900 rounded-[2.5rem] text-white flex flex-col justify-between relative overflow-hidden group">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold tracking-tight mb-2">Ready for a new discovery?</h2>
                                <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
                                    Use our Llama 3.3 engine to generate a complete itinerary based on your latest profile preferences.
                                </p>
                            </div>
                            <div className="relative z-10 mt-8">
                                <Link to="/dashboard/add-trip" className="inline-block px-6 py-3 bg-white text-zinc-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                                    Generate with AI
                                </Link>
                            </div>
                        </div>

                        <div className="p-8 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] flex flex-col justify-between">
                            <LayoutGrid className="text-zinc-300" />
                            <div>
                                <p className="text-4xl font-bold tracking-tighter text-zinc-900">
                                    {loading ? <Loader2 className="animate-spin inline" size={24} /> : trips.length}
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Expeditions</p>
                            </div>
                        </div>
                    </>
                )}

                {loading ? (
                    <div className="lg:col-span-3 py-20 text-center">
                        <Loader2 className="animate-spin mx-auto text-zinc-300" size={48} />
                    </div>
                ) : filteredTrips.length > 0 ? (
                    filteredTrips.map((trip: any) => (
                        <div key={trip._id || trip.id} className="relative group">
                            <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button
                                    onClick={(e) => toggleFavorite(e, trip)}
                                    className={`p-2 backdrop-blur-sm rounded-full shadow-md border transition-colors ${
                                        trip.isFavorite
                                            ? 'bg-rose-500 text-white border-rose-400'
                                            : 'bg-white/90 text-zinc-400 border-zinc-100 hover:text-rose-500'
                                    }`}
                                    title={trip.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                                >
                                    <Heart size={16} fill={trip.isFavorite ? "currentColor" : "none"} />
                                </button>

                                <Link
                                    to={`/dashboard/edit-trip/${trip._id || trip.id}`}
                                    className="p-2 bg-white/90 backdrop-blur-sm text-zinc-600 rounded-full hover:bg-zinc-900 hover:text-white shadow-md border border-zinc-100 transition-colors"
                                >
                                    <Settings size={16} />
                                </Link>

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteTrip(trip._id || trip.id);
                                    }}
                                    className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full hover:bg-red-500 hover:text-white shadow-md border border-zinc-100 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <TripCard trip={trip} />
                        </div>
                    ))
                ) : (
                    <div className="lg:col-span-3 py-20 text-center border-2 border-dashed border-zinc-100 rounded-[2.5rem]">
                        <p className="text-zinc-400 text-sm font-medium italic">
                            {showOnlyFavorites ? "No favorite journeys yet. Click the heart to add some!" : "No journeys found."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
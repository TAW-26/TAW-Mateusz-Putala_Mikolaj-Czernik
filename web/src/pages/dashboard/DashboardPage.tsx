import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { tripsService } from '../../api/tripsService'; // Importujemy serwis
import { TripCard } from '../../components/trips/TripCard';
import { Plus, LayoutGrid, Activity, Loader2, Trash2 } from 'lucide-react'; // Dodano Trash2
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/trips')
            .then(res => {
                const responseContent = res.data;
                if (responseContent && Array.isArray(responseContent.data)) {
                    setTrips(responseContent.data);
                } else if (Array.isArray(responseContent)) {
                    setTrips(responseContent);
                } else if (responseContent && Array.isArray(responseContent.trips)) {
                    setTrips(responseContent.trips);
                } else {
                    setTrips([]);
                }
            })
            .catch(err => {
                console.error("Błąd ładowania wycieczek:", err);
                setTrips([]);
            })
            .finally(() => setLoading(false));
    }, []);

    // --- FUNKCJA USUWANIA ---
    const handleDeleteTrip = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this journey?")) return;

        try {
            await tripsService.deleteTrip(id);
            // Usuwamy wycieczkę ze stanu UI
            setTrips(prev => prev.filter(t => (t._id || t.id) !== id));
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Could not delete the expedition.");
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto py-12 px-6">
            {/* Header sekcji */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                        <Activity size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Dashboard</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter text-zinc-900">Your Journeys</h1>
                </div>

                <Link
                    to="/dashboard/add-trip"
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                >
                    <Plus size={16} /> New Adventure
                </Link>
            </div>

            {/* Siatka główna */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Karta AI Prompt */}
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

                {/* Karta Statystyk */}
                <div className="p-8 bg-zinc-50 border border-zinc-100 rounded-[2.5rem] flex flex-col justify-between">
                    <LayoutGrid className="text-zinc-300" />
                    <div>
                        <p className="text-4xl font-bold tracking-tighter text-zinc-900">
                            {loading ? <Loader2 className="animate-spin inline" size={24} /> : trips.length}
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Expeditions</p>
                    </div>
                </div>

                {/* Lista wycieczek z przyciskiem usuwania */}
                {loading ? (
                    <div className="lg:col-span-3 py-20 text-center">
                        <Loader2 className="animate-spin mx-auto text-zinc-300" size={48} />
                    </div>
                ) : trips.length > 0 ? (
                    trips.map((trip: any) => (
                        <div key={trip._id || trip.id} className="relative group">
                            {/* Przycisk usuwania (pojawia się na hover) */}
                            <button
                                onClick={() => handleDeleteTrip(trip._id || trip.id)}
                                className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-sm text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-sm border border-zinc-100"
                                title="Delete Trip"
                            >
                                <Trash2 size={16} />
                            </button>

                            <TripCard trip={trip} />
                        </div>
                    ))
                ) : (
                    <div className="lg:col-span-3 py-20 text-center border-2 border-dashed border-zinc-100 rounded-[2.5rem]">
                        <p className="text-zinc-400 text-sm font-medium italic">No journeys found. Start by creating one!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
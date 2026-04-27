import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { tripsService } from '../../api/tripsService.ts';
import type { Trip } from '../../types';
import { Mapbox } from '../../components/trips/Mapbox.tsx';
import { MapPin, Sparkles, Loader2, Navigation, Clock, ShieldCheck } from 'lucide-react';

export const TripDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        if (!id) return;
        try {
            const res = await tripsService.getTripDetails(id);
            setTrip(res.data || res);
        } catch (err) {
            console.error("Load error:", err);
            setError("Could not synchronize with the Voyager Database.");
        }
    }, [id]);

    const handleGenerateAI = async () => {
        if (!id) return;
        setIsGenerating(true);
        try {
            await tripsService.generateAIWaypoints(id);
            await loadData();
        } catch (err) {
            alert("AI Engine failure. Check your Groq API Key.");
        } finally { setIsGenerating(false); }
    };

    useEffect(() => { loadData(); }, [loadData]);

    if (error) return <div className="p-20 text-red-500">{error}</div>;
    if (!trip) return (
        <div className="flex h-screen items-center justify-center bg-zinc-950">
            <Loader2 className="animate-spin text-zinc-500" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
            <header className="max-w-6xl mx-auto flex justify-between items-end mb-12 border-b border-zinc-800 pb-8">
                <div>
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Active Mission</span>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tighter">{trip.title}</h1>
                    <p className="text-zinc-500 mt-2 flex items-center gap-2">
                        <MapPin size={16} /> {trip.origin.address}
                        <Navigation size={14} className="text-zinc-700" />
                        {trip.destination.address}
                    </p>
                </div>

                <button
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className="group relative px-8 py-4 bg-zinc-100 text-zinc-950 rounded-2xl font-bold overflow-hidden transition-all hover:scale-105 disabled:opacity-50"
                >
                    <div className="flex items-center gap-2 relative z-10">
                        {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                        <span>{isGenerating ? 'AI OPTIMIZING...' : 'GENERATE AI ROUTE'}</span>
                    </div>
                </button>
            </header>

            {/* 1. ZMIANA: grid-cols-5 daje większą elastyczność w podziale miejsca */}
            <main className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-10">
                {/* 2. ZMIANA: col-span-2 dla listy waypointów */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <Clock size={14} /> Intelligence Directives (Waypoints)
                    </h2>

                    <div className="space-y-4">
                        {trip.waypoints?.map((wp: any, index: number) => (
                            <div key={wp._id || index} className="group bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2rem] hover:border-purple-500/50 transition-all">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-black text-xs border border-zinc-700 group-hover:bg-purple-600 transition-colors">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 w-[2px] bg-zinc-800 my-2"></div>
                                    </div>
                                    <div className="flex-1 pb-2">
                                        <h4 className="text-lg font-bold mb-1 leading-tight">{wp.name}</h4>
                                        <p className="text-purple-400 text-[10px] font-medium mb-2 flex items-center gap-1">
                                            <MapPin size={10} /> {wp.address || "Location verified by AI"}
                                        </p>
                                        <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">{wp.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {(!trip.waypoints || trip.waypoints.length === 0) && (
                            <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-[3rem]">
                                <Sparkles className="mx-auto text-zinc-700 mb-4" size={40} />
                                <p className="text-zinc-500 italic text-sm">No waypoints detected. Initialize AI Engine.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. ZMIANA: col-span-3 dla mapy, aby była znacznie większa */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="sticky top-8">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] overflow-hidden h-[650px] shadow-2xl relative p-3">
                            {trip.waypoints && trip.waypoints.length > 0 ? (
                                <Mapbox
                                    waypoints={trip.waypoints}
                                    center={[
                                        trip.waypoints[0].location?.lat || 52.2297,
                                        trip.waypoints[0].location?.lng || 21.0122
                                    ]}
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-zinc-500 bg-zinc-950/50 rounded-[2.5rem]">
                                    <MapPin className="mb-4 opacity-20" size={64} />
                                    <p className="text-lg font-medium">Initialize AI Route</p>
                                    <p className="text-sm opacity-60">Deploying Tactical Map Overlay...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
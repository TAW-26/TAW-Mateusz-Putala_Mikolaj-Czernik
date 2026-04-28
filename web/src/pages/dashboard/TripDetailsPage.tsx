import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { tripsService } from '../../api/tripsService.ts';
import { Mapbox } from '../../components/trips/Mapbox.tsx';
import { MapPin, Sparkles, Loader2, Navigation, Clock, ShieldCheck, Trash2, CheckCircle2 } from 'lucide-react';

export const TripDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [trip, setTrip] = useState<any | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mapRef = useRef<any>(null);

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

    useEffect(() => { loadData(); }, [loadData]);

    // --- FUNKCJE ZAPISUJĄCE DO BAZY (DLA WAYPOINTÓW) ---

    const toggleVisited = async (e: React.MouseEvent, wp: any) => {
        e.stopPropagation();
        if (!wp._id) return;

        try {
            const newStatus = !wp.visited;

            await tripsService.updateWaypoint(wp._id, { visited: newStatus });

            setTrip((prev: any) => ({
                ...prev,
                waypoints: prev.waypoints.map((w: any) =>
                    w._id === wp._id ? { ...w, visited: newStatus } : w
                )
            }));
        } catch (err) {
            console.error("Sync error:", err);
            alert("Critical failure: Could not update mission status.");
        }
    };

    const deleteWaypoint = async (e: React.MouseEvent, wpId: string) => {
        e.stopPropagation();
        if (!window.confirm("Abort this objective? Point will be removed from navigation.")) return;

        try {
            await tripsService.deleteWaypoint(wpId);

            setTrip((prev: any) => ({
                ...prev,
                waypoints: prev.waypoints.filter((w: any) => w._id !== wpId)
            }));
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to remove point from database.");
        }
    };

    // --- LOGIKA AI I MAPY ---

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

    const handleWaypointClick = (wp: any) => {
        const lat = wp.location?.lat ?? wp.lat;
        const lng = wp.location?.lng ?? wp.lng;
        if (typeof lat === 'number' && typeof lng === 'number' && mapRef.current) {
            mapRef.current.flyTo([lat, lng] as [number, number]);
        }
    };

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
                    <h1 className="text-5xl font-bold tracking-tighter text-white">{trip.title}</h1>
                    <div className="text-zinc-500 mt-2 flex items-center gap-2 text-sm">
                        <MapPin size={16} className="text-zinc-400" /> {trip.origin.address}
                        <Navigation size={14} className="text-zinc-700" />
                        {trip.destination.address}
                    </div>
                </div>

                <button
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className="group relative px-8 py-4 bg-zinc-100 text-zinc-950 rounded-2xl font-bold overflow-hidden transition-all hover:scale-105 disabled:opacity-50 shadow-lg shadow-white/5"
                >
                    <div className="flex items-center gap-2 relative z-10">
                        {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                        <span>{isGenerating ? 'AI OPTIMIZING...' : 'GENERATE AI ROUTE'}</span>
                    </div>
                </button>
            </header>

            <main className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <Clock size={14} /> Intelligence Directives (Waypoints)
                    </h2>

                    <div className="space-y-4">
                        {trip.waypoints?.map((wp: any, index: number) => (
                            <div
                                key={wp._id || index}
                                onClick={() => handleWaypointClick(wp)}
                                className={`group bg-zinc-900/50 border ${wp.visited ? 'border-emerald-500/30' : 'border-zinc-800'} p-6 rounded-[2rem] hover:border-purple-500/50 hover:bg-zinc-900 transition-all cursor-pointer relative overflow-hidden`}
                            >
                                {wp.visited && <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />}

                                <div className="flex gap-4 relative z-10">
                                    <div className="flex flex-col items-center">
                                        <button
                                            onClick={(e) => toggleVisited(e, wp)}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border ${
                                                wp.visited
                                                    ? 'bg-emerald-500 border-emerald-400 text-white'
                                                    : 'bg-zinc-800 border-zinc-700 text-zinc-500 group-hover:border-purple-500'
                                            }`}
                                        >
                                            {wp.visited ? <CheckCircle2 size={16} /> : <span className="font-black text-[10px]">{index + 1}</span>}
                                        </button>
                                        {index !== trip.waypoints.length - 1 && (
                                            <div className="flex-1 w-[1px] bg-zinc-800 my-2"></div>
                                        )}
                                    </div>

                                    <div className="flex-1 pb-2">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`text-lg font-bold mb-1 leading-tight transition-all ${wp.visited ? 'text-zinc-500 line-through' : 'text-zinc-100'}`}>
                                                {wp.name}
                                            </h4>
                                            <button
                                                onClick={(e) => deleteWaypoint(e, wp._id)}
                                                className="p-2 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <p className="text-purple-400 text-[10px] font-bold mb-2 flex items-center gap-1 uppercase tracking-tighter">
                                            <MapPin size={10} /> {wp.address || "Location verified by AI"}
                                        </p>

                                        {/* ZMIENIONY FRAGMENT: line-clamp-3 na line-clamp-none po hoverze */}
                                        <p className="text-zinc-500 text-xs leading-relaxed transition-all duration-300 line-clamp-3 group-hover:line-clamp-none">
                                            {wp.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    <div className="sticky top-8">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] overflow-hidden h-[700px] shadow-2xl relative p-3">
                            {trip.waypoints && trip.waypoints.length > 0 ? (
                                <Mapbox
                                    ref={mapRef}
                                    waypoints={trip.waypoints}
                                    center={[
                                        trip.waypoints[0].location?.lat || trip.waypoints[0].lat || 52.2297,
                                        trip.waypoints[0].location?.lng || trip.waypoints[0].lng || 21.0122
                                    ] as [number, number]}
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-zinc-500 bg-zinc-950/50 rounded-[2.5rem]">
                                    <MapPin className="mb-4 opacity-10" size={64} />
                                    <p className="text-lg font-bold tracking-tighter text-zinc-700">MAP DISENGAGED</p>
                                    <p className="text-xs opacity-40 uppercase tracking-widest mt-2">Deploy AI to establish tactical overlay</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
import { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { tripsService } from '../../api/tripsService.ts';
import { Mapbox } from '../../components/trips/Mapbox.tsx';
import { useUI } from '../../context/UIContext';
import {
    MapPin,
    Sparkles,
    Loader2,
    ArrowRight,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Pencil,
    ArrowLeft,
} from 'lucide-react';

export const TripDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { toast, confirm } = useUI();
    const [trip, setTrip] = useState<any | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mapRef = useRef<{ flyTo: (coords: [number, number]) => void } | null>(null);

    const loadData = useCallback(async () => {
        if (!id) return;
        try {
            const res = await tripsService.getTripDetails(id);
            setTrip(res.data || res);
            setError(null);
        } catch (err: unknown) {
            console.error('Load error:', err);
            const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message
                || 'Nie udało się wczytać szczegółów wycieczki.';
            setError(message);
        }
    }, [id]);

    useEffect(() => { loadData(); }, [loadData]);

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
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message
                || 'Nie udało się zaktualizować statusu punktu trasy.';
            toast(message, 'error');
        }
    };

    const deleteWaypoint = async (e: React.MouseEvent, wpId: string) => {
        e.stopPropagation();
        const confirmed = await confirm('Usunąć ten punkt trasy z trasy?');
        if (!confirmed) return;
        try {
            await tripsService.deleteWaypoint(wpId);
            setTrip((prev: any) => ({
                ...prev,
                waypoints: prev.waypoints.filter((w: any) => w._id !== wpId)
            }));
            toast('Punkt trasy usunięty.', 'success');
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message
                || 'Nie udało się usunąć punktu trasy.';
            toast(message, 'error');
        }
    };

    const handleGenerateAI = async () => {
        if (!id) return;
        setIsGenerating(true);
        try {
            await tripsService.generateAIWaypoints(id);
            await loadData();
            toast('Trasa wygenerowana pomyślnie.', 'success');
        } catch (err: unknown) {
            const message = (err as { message?: string }).message || 'Generowanie AI nie powiodło się.';
            toast(message, 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleWaypointClick = (wp: any) => {
        const lat = wp.location?.lat ?? wp.lat;
        const lng = wp.location?.lng ?? wp.lng;
        if (typeof lat === 'number' && typeof lng === 'number' && mapRef.current) {
            mapRef.current.flyTo([lat, lng] as [number, number]);
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="card p-8 max-w-md text-center">
                    <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
                    <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Nie udało się wczytać wycieczki</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary"
                    >
                        Spróbuj ponownie
                    </button>
                </div>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="flex py-20 items-center justify-center">
                <Loader2 className="animate-spin text-slate-300" size={32} />
            </div>
        );
    }

    return (
        <div>
            <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-6 transition-colors"
            >
                <ArrowLeft size={16} />
                Wróć do wycieczek
            </Link>

            <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-8">
                <div>
                    <h1 className="page-title">{trip.title}</h1>
                    <div className="page-subtitle mt-2 flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1">
                            <MapPin size={14} className="text-slate-400" />
                            {trip.origin.address}
                        </span>
                        <ArrowRight size={14} className="text-slate-300 dark:text-slate-600" />
                        <span className="text-slate-600 dark:text-slate-400">{trip.destination.address}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        to={`/dashboard/edit-trip/${id}`}
                        className="btn-secondary"
                    >
                        <Pencil size={16} />
                        Edytuj
                    </Link>
                    <button
                        onClick={handleGenerateAI}
                        disabled={isGenerating}
                        className="btn-primary disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <Sparkles size={16} />
                        )}
                        {isGenerating ? 'Generowanie…' : 'Generuj trasę'}
                    </button>
                </div>
            </header>

            <div className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2 space-y-3">
                    <h2 className="text-sm font-medium text-slate-700 dark:text-slate-300">Punkty trasy</h2>

                    {trip.waypoints?.length === 0 && (
                        <div className="card p-6 text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Brak punktów trasy. Użyj „Generuj trasę”, aby utworzyć proponowany plan.
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        {trip.waypoints?.map((wp: any, index: number) => (
                            <div
                                key={wp._id || index}
                                onClick={() => handleWaypointClick(wp)}
                                className="group card-interactive p-4 cursor-pointer"
                            >
                                <div className="flex gap-3">
                                    <button
                                        onClick={(e) => toggleVisited(e, wp)}
                                        className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-medium border transition-colors ${
                                            wp.visited
                                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-400'
                                        }`}
                                    >
                                        {wp.visited ? <CheckCircle2 size={14} /> : index + 1}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className={`text-sm font-medium leading-snug ${
                                                wp.visited ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'
                                            }`}>
                                                {wp.name}
                                            </h4>
                                            <button
                                                onClick={(e) => deleteWaypoint(e, wp._id)}
                                                className="p-1 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                                aria-label="Usuń punkt trasy"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        {wp.address && (
                                            <p className="text-xs text-muted mt-1 flex items-center gap-1">
                                                <MapPin size={11} />
                                                {wp.address}
                                            </p>
                                        )}
                                        {wp.description && (
                                            <p className="text-xs text-muted mt-2 leading-relaxed">
                                                {wp.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="card overflow-hidden h-[480px] lg:h-[600px]">
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
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                                <MapPin className="text-slate-200 mb-3" size={40} />
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Brak danych mapy</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Wygeneruj trasę, aby zobaczyć punkty na mapie
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

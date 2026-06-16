import { useEffect, useState } from 'react';
import { tripsService } from '../../api/tripsService';
import { useUI } from '../../context/UIContext';
import { MapPin, Trash2, Loader2 } from 'lucide-react';

export const AdminWaypointsPage = () => {
    const [waypoints, setWaypoints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast, confirm } = useUI();

    const fetchWaypoints = () => {
        setLoading(true);
        tripsService.adminGetAllWaypoints()
            .then(res => {
                setWaypoints(res.data || res);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchWaypoints();
    }, []);

    const handleDeleteWaypoint = async (id: string) => {
        const confirmed = await confirm('Trwale usunąć ten punkt trasy z bazy danych?');
        if (!confirmed) return;
        try {
            await tripsService.deleteWaypoint(id);
            setWaypoints(prev => prev.filter(wp => wp._id !== id));
            toast('Punkt trasy usunięty.', 'success');
        } catch {
            toast('Nie udało się usunąć punktu trasy.', 'error');
        }
    };

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <Loader2 className="animate-spin text-slate-300" size={32} />
            </div>
        );
    }

    return (
        <div>
            <header className="mb-8">
                <h1 className="page-title">Punkty trasy</h1>
                <p className="page-subtitle mt-1">Wszystkie punkty trasy w systemie</p>
            </header>

            <div className="card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-5 py-3">Nazwa</th>
                            <th className="px-5 py-3">Wycieczka</th>
                            <th className="px-5 py-3">Adres</th>
                            <th className="px-5 py-3 text-right">Akcje</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {waypoints.map((wp) => (
                            <tr key={wp._id} className="table-row group transition-colors">
                                <td className="px-5 py-4">
                                    <div className="table-cell-strong">{wp.name}</div>
                                    {wp.description && (
                                        <div className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-xs">
                                            {wp.description}
                                        </div>
                                    )}
                                </td>
                                <td className="px-5 py-4 table-cell">
                                    {wp.trip?.title || 'Nieznana wycieczka'}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-1.5 table-cell">
                                        <MapPin size={13} className="text-slate-400 shrink-0" />
                                        <span className="line-clamp-1">{wp.address || 'Brak adresu'}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <button
                                        onClick={() => handleDeleteWaypoint(wp._id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                        title="Usuń punkt trasy"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

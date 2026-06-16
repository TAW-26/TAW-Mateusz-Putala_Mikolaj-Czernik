import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripsService } from '../../api/tripsService';
import { useUI } from '../../context/UIContext';
import { Globe, Users, Map as MapIcon, Loader2, Pencil, Trash2 } from 'lucide-react';

export const AdminDashboard = () => {
    const [allTrips, setAllTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { toast, confirm } = useUI();

    const fetchAdminStats = () => {
        setLoading(true);
        tripsService.adminGetAllTrips()
            .then(res => {
                setAllTrips(res.data || res);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchAdminStats();
    }, []);

    const handleDeleteTrip = async (id: string) => {
        const confirmed = await confirm('Trwale usunąć tę wycieczkę z bazy danych?');
        if (!confirmed) return;
        try {
            await tripsService.deleteTrip(id);
            setAllTrips(prev => prev.filter(t => t._id !== id));
            toast('Wycieczka usunięta.', 'success');
        } catch {
            toast('Błąd autoryzacji lub połączenia z bazą danych.', 'error');
        }
    };

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <Loader2 className="animate-spin text-slate-300" size={32} />
            </div>
        );
    }

    const stats = [
        { label: 'Łączna liczba wycieczek', value: allTrips.length, icon: Globe },
        { label: 'Aktywni użytkownicy', value: new Set(allTrips.map(t => t.user?._id)).size, icon: Users },
        { label: 'Łączna liczba punktów trasy', value: allTrips.reduce((acc, t) => acc + (t.waypoints?.length || 0), 0), icon: MapIcon },
    ];

    return (
        <div>
            <header className="mb-8">
                <h1 className="page-title">Przegląd administratora</h1>
                <p className="page-subtitle mt-1">Statystyki wycieczek i punktów trasy w całym systemie</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="card p-5">
                        <stat.icon className="text-slate-400 mb-3" size={20} strokeWidth={1.75} />
                        <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{stat.value}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-5 py-3">Wycieczka</th>
                            <th className="px-5 py-3">Użytkownik</th>
                            <th className="px-5 py-3">Trasa</th>
                            <th className="px-5 py-3">Punkty trasy</th>
                            <th className="px-5 py-3 text-right">Akcje</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {allTrips.map((trip) => (
                            <tr key={trip._id} className="table-row group">
                                <td className="px-5 py-4 font-medium text-slate-900 dark:text-slate-100">{trip.title}</td>
                                <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                                    {trip.user?.username || 'Nieznany'}
                                    <span className="block text-xs text-slate-400">{trip.user?.email}</span>
                                </td>
                                <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                                    {trip.origin?.address.split(',')[0]} → {trip.destination?.address.split(',')[0]}
                                </td>
                                <td className="px-5 py-4 table-cell">{trip.waypoints?.length || 0}</td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => navigate(`/dashboard/edit-trip/${trip._id}`)}
                                            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                            title="Edytuj wycieczkę"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTrip(trip._id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Usuń wycieczkę"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

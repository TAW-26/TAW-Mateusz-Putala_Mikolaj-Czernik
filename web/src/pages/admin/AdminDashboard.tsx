import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // DODANO
import { tripsService } from '../../api/tripsService';
import { ShieldAlert, Globe, Users, Map as MapIcon, Loader2, Edit3, Trash2 } from 'lucide-react'; // DODANO IKONY

export const AdminDashboard = () => {
    const [allTrips, setAllTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // DODANO

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

    // FUNKCJA USUWANIA DLA ADMINA
    const handleDeleteTrip = async (id: string) => {
        if (window.confirm("CRITICAL ACTION: Czy na pewno chcesz trwale usunąć tę misję z bazy danych?")) {
            try {
                await tripsService.deleteTrip(id);
                setAllTrips(prev => prev.filter(t => t._id !== id));
            } catch (err) {
                alert("Błąd autoryzacji lub połączenia z bazą.");
            }
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-zinc-950 text-white"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
            <header className="mb-12 border-b border-zinc-800 pb-8">
                <div className="flex items-center gap-3 text-red-500 mb-2">
                    <ShieldAlert size={20} />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">System Level Access</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter">COMMAND CENTER</h1>
            </header>

            {/* STATYSTYKI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                    { label: 'Total Missions', value: allTrips.length, icon: Globe, color: 'text-blue-400' },
                    { label: 'Active Users', value: new Set(allTrips.map(t => t.user?._id)).size, icon: Users, color: 'text-purple-400' },
                    { label: 'Total Waypoints', value: allTrips.reduce((acc, t) => acc + (t.waypoints?.length || 0), 0), icon: MapIcon, color: 'text-emerald-400' }
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                        <stat.icon className={`${stat.color} mb-4`} size={24} />
                        <div className="text-3xl font-black">{stat.value}</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* TABELA WYCIECZEK */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-zinc-800/50 text-[10px] uppercase tracking-widest text-zinc-500">
                    <tr>
                        <th className="p-6">Mission Title</th>
                        <th className="p-6">Operative (User)</th>
                        <th className="p-6">Route</th>
                        <th className="p-6">Waypoints</th>
                        <th className="p-6 text-right">Management</th> {/* ZMIENIONO NAGŁÓWEK */}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                    {allTrips.map((trip) => (
                        <tr key={trip._id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="p-6 font-bold">{trip.title}</td>
                            <td className="p-6 text-sm text-zinc-400">
                                {trip.user?.username || 'Unknown'}
                                <span className="block text-[10px] text-zinc-600">{trip.user?.email}</span>
                            </td>
                            <td className="p-6 text-xs text-zinc-500">
                                {trip.origin?.address.split(',')[0]} → {trip.destination?.address.split(',')[0]}
                            </td>
                            <td className="p-6 text-sm font-mono text-purple-400">{trip.waypoints?.length || 0}</td>
                            <td className="p-6 text-right"> {/* NOWA KOMÓRKA AKCJI */}
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                    <button
                                        onClick={() => navigate(`/dashboard/edit-trip/${trip._id}`)}
                                        className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-colors border border-transparent hover:border-blue-500/20"
                                        title="Edit Mission"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTrip(trip._id)}
                                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                        title="Terminate Data"
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
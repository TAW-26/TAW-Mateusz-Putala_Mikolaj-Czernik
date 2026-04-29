import { useEffect, useState } from 'react';
import { tripsService } from '../../api/tripsService';
import { MapPin, Trash2, Loader2, Link as LinkIcon, Database } from 'lucide-react';

export const AdminWaypointsPage = () => {
    const [waypoints, setWaypoints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
        if (window.confirm("TERMINATE OBJECTIVE: Czy na pewno usunąć ten punkt z bazy?")) {
            try {
                await tripsService.deleteWaypoint(id);
                setWaypoints(prev => prev.filter(wp => wp._id !== id));
            } catch (err) {
                alert("Błąd podczas usuwania punktu.");
            }
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-zinc-950 text-white"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
            <header className="mb-12 border-b border-zinc-800 pb-8">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <Database size={20} />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Global Intelligence</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter">WAYPOINT REGISTRY</h1>
            </header>

            <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-800/50 text-[10px] uppercase tracking-widest text-zinc-500">
                    <tr>
                        <th className="p-6">Point Name</th>
                        <th className="p-6">Mission (Trip)</th>
                        <th className="p-6">Address / Location</th>
                        <th className="p-6 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                    {waypoints.map((wp) => (
                        <tr key={wp._id} className="hover:bg-white/[0.02] group transition-colors">
                            <td className="p-6">
                                <div className="font-bold">{wp.name}</div>
                                <div className="text-[10px] text-zinc-500 font-mono mt-1 line-clamp-1 max-w-[250px]">
                                    {wp.description}
                                </div>
                            </td>
                            <td className="p-6">
                                <div className="flex items-center gap-2 text-blue-400 text-sm italic">
                                    <LinkIcon size={12} />
                                    {wp.trip?.title || 'Unknown Mission'}
                                </div>
                            </td>
                            <td className="p-6">
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                    <MapPin size={12} className="text-zinc-700" />
                                    {wp.address || "No address data"}
                                </div>
                            </td>
                            <td className="p-6 text-right">
                                <button
                                    onClick={() => handleDeleteWaypoint(wp._id)}
                                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
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
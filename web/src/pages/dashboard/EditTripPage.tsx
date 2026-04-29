import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
// Dodano ikonę Clock
import { Loader2, Settings, Activity, Route, MapPin, Flag, Banknote, Calendar, MessageSquare, Save, Clock } from 'lucide-react';

export const EditTripPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        origin: { address: '' },
        destination: { address: '' },
        startDate: '',
        endDate: '',
        budget: 0,
        description: '',
        aiSettings: {
            intensity: 5,
            discoverySpread: 5,
            numberOfPoints: 10,
            searchMode: 'along-route',
            tripStyle: 'leisure'
        }
    });

    // POBIERANIE DANYCH WYCIECZKI
    useEffect(() => {
        api.get(`/trips/${id}`)
            .then(res => {
                const trip = res.data.data || res.data;
                // Formatowanie daty do input type="date" (YYYY-MM-DD)
                const start = trip.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : '';
                const end = trip.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : '';

                setFormData({
                    ...trip,
                    startDate: start,
                    endDate: end,
                    aiSettings: { ...trip.aiSettings }
                });
            })
            .catch(err => console.error("Fetch error:", err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put(`/trips/${id}`, formData);
            navigate(`/dashboard/trip/${id}`); // Powrót do szczegółów
        } catch (err: any) {
            alert("Update failed: " + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="animate-spin text-zinc-300" size={48} />
        </div>
    );

    return (
        <div className="max-w-[700px] mx-auto py-12 px-6">
            <div className="mb-10">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                    <Settings size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Expedition Configuration</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter text-zinc-900">Edit Journey</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tytuł */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Trip Title</label>
                    <input required value={formData.title} className="w-full bg-zinc-100 border-2 border-zinc-200 rounded-2xl py-4 px-6 outline-none focus:border-zinc-900 transition-all font-medium text-zinc-900" onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>

                {/* Lokalizacje */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 opacity-60">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Starting Point</label>
                        <div className="relative">
                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <input disabled value={formData.origin.address} className="w-full bg-zinc-100 border-2 border-zinc-200 rounded-2xl py-4 pl-14 pr-6 cursor-not-allowed" />
                        </div>
                    </div>
                    <div className="space-y-2 opacity-60">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Destination</label>
                        <div className="relative">
                            <Flag className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <input disabled value={formData.destination.address} className="w-full bg-zinc-100 border-2 border-zinc-200 rounded-2xl py-4 pl-14 pr-6 cursor-not-allowed" />
                        </div>
                    </div>
                </div>

                {/* Daty Podróży */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Launch Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <input type="date" required value={formData.startDate} className="w-full bg-zinc-100 border-2 border-zinc-200 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-zinc-900 transition-all font-medium" onChange={e => setFormData({...formData, startDate: e.target.value})} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Return Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <input type="date" required value={formData.endDate} className="w-full bg-zinc-100 border-2 border-zinc-200 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-zinc-900 transition-all font-medium" onChange={e => setFormData({...formData, endDate: e.target.value})} />
                        </div>
                    </div>
                </div>

                {/* Życzenia */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Special Requirements</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-5 top-6 text-zinc-400" size={18} />
                        <textarea value={formData.description} className="w-full bg-zinc-100 border-2 border-zinc-200 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-zinc-900 transition-all font-medium min-h-[120px] resize-none" onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                </div>

                {/* AI SETTINGS BOX */}
                <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="space-y-8 relative z-10">
                        {/* INTENSYWNOŚĆ */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                    <Activity size={12} /> Intensywność
                                </label>
                                <span className="text-xs font-bold text-purple-400">{formData.aiSettings.intensity}/10</span>
                            </div>
                            <input type="range" min="0" max="10" value={formData.aiSettings.intensity} className="w-full accent-purple-500 cursor-pointer" onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, intensity: Number(e.target.value)}})} />
                        </div>

                        {/* ROZPROSZENIE */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                    <Route size={12} /> Rozproszenie
                                </label>
                                <span className="text-xs font-bold text-emerald-400">{formData.aiSettings.discoverySpread}/10</span>
                            </div>
                            <input type="range" min="0" max="10" value={formData.aiSettings.discoverySpread} className="w-full accent-emerald-500 cursor-pointer" onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, discoverySpread: Number(e.target.value)}})} />
                        </div>

                        {/* LICZBA PUNKTÓW AI (DODANO) */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                    <Clock size={12} /> Liczba Punktów AI
                                </label>
                                <span className="text-xs font-bold text-white italic">{formData.aiSettings.numberOfPoints} stops</span>
                            </div>
                            <input type="range" min="1" max="20" step="1" value={formData.aiSettings.numberOfPoints} className="w-full accent-white cursor-pointer" onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, numberOfPoints: Number(e.target.value)}})} />
                        </div>

                        <div className="pt-4 border-t border-white/5 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Banknote size={12}/> Budget (PLN)</label>
                            <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-bold outline-none focus:border-purple-500" value={formData.budget} onChange={e => setFormData({...formData, budget: Number(e.target.value)})} />
                        </div>
                    </div>
                </div>

                <button disabled={saving} type="submit" className="w-full bg-zinc-900 text-white rounded-[1.5rem] py-5 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl">
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16}/> Save Changes</>}
                </button>
            </form>
        </div>
    );
};
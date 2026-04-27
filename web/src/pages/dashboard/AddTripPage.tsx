import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { MapPin, Flag, Sparkles, Loader2, Compass, } from 'lucide-react';

export const AddTripPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        origin: { address: '' },
        destination: { address: '' },
        startDate: '', // Dodane dla zgodności ze schemą
        endDate: '',   // Dodane dla zgodności ze schemą
        budget: 0,
        aiSettings: {
            intensity: 3,
            numberOfPoints: 5,
            extraTimeTolerance: 20
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userRaw = localStorage.getItem('user');
            const userData = userRaw ? JSON.parse(userRaw) : null;

            // Przygotowanie payloadu idealnie pod TripSchema
            const payload = {
                ...formData,
                // Backend zajmie się userId z tokena, ale preferencje wysyłamy dla AI
                userPreferences: userData?.preferences || {}
            };

            const res = await api.post('/trips', payload);
            console.log("Trip created successfully:", res.data); // Użycie zmiennej usunie błąd
            // Przekierowanie do detali nowej wycieczki (wykorzystujemy ID z MongoDB)
            navigate(`/dashboard`);
        } catch (err: any) {
            console.error("Błąd zapisu:", err.response?.data || err.message);
            alert("Błąd zapisu: " + (err.response?.data?.message || "Błąd walidacji"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[700px] mx-auto py-12 px-6">
            <div className="mb-10">
                <div className="flex items-center gap-2 text-zinc-400 mb-2">
                    <Compass size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Trip Planner</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter text-zinc-900">New Expedition</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tytuł */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Trip Title</label>
                    <input
                        required
                        value={formData.title}
                        className="w-full bg-zinc-100 border-2 border-zinc-200 rounded-2xl py-4 px-6 outline-none focus:border-zinc-900 transition-all"
                        placeholder="np. Weekend w Pradze"
                        onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                </div>

                {/* Lokalizacje */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Starting Point</label>
                        <div className="relative">
                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <input
                                value={formData.origin.address}
                                className="w-full bg-zinc-100 border-2 border-zinc-200 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-zinc-900 transition-all"
                                placeholder="Obecna lokalizacja"
                                onChange={e => setFormData({...formData, origin: { ...formData.origin, address: e.target.value }})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Destination</label>
                        <div className="relative">
                            <Flag className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <input
                                required
                                value={formData.destination.address}
                                className="w-full bg-zinc-100 border-2 border-zinc-200 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-zinc-900 transition-all"
                                placeholder="Dokąd jedziesz?"
                                onChange={e => setFormData({...formData, destination: { ...formData.destination, address: e.target.value }})}
                            />
                        </div>
                    </div>
                </div>

                {/* DATY - Dodane dla zgodności z Trip.js */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Start Date</label>
                        <input
                            type="date"
                            required
                            className="w-full bg-zinc-100 border-2 border-zinc-200 rounded-2xl py-4 px-6 outline-none focus:border-zinc-900 transition-all"
                            onChange={e => setFormData({...formData, startDate: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">End Date</label>
                        <input
                            type="date"
                            required
                            className="w-full bg-zinc-100 border-2 border-zinc-200 rounded-2xl py-4 px-6 outline-none focus:border-zinc-900 transition-all"
                            onChange={e => setFormData({...formData, endDate: e.target.value})}
                        />
                    </div>
                </div>

                {/* AI Settings Box - bez zmian, bo pola idealnie pasują do Trip.js */}
                <div className="bg-zinc-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                    <Sparkles className="absolute right-[-20px] top-[-20px] w-40 h-40 text-white/5" />
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Sparkles size={20} className="text-yellow-400" /> AI Engine Settings
                    </h3>

                    <div className="space-y-6 relative z-10">
                        <div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-4">
                                <span className="text-zinc-400">Intensity (Stops Frequency)</span>
                                <span className="text-white">{formData.aiSettings.intensity}/5</span>
                            </div>
                            <input
                                type="range" min="1" max="5"
                                value={formData.aiSettings.intensity}
                                className="w-full accent-white cursor-pointer"
                                onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, intensity: Number(e.target.value)}})}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Max AI Waypoints</label>
                                <input
                                    type="number"
                                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 outline-none focus:border-white transition-all text-white"
                                    value={formData.aiSettings.numberOfPoints}
                                    onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, numberOfPoints: Number(e.target.value)}})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Budget (PLN)</label>
                                <input
                                    type="number"
                                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 outline-none focus:border-white transition-all text-white"
                                    value={formData.budget === 0 ? '' : formData.budget}
                                    onChange={e => setFormData({...formData, budget: Number(e.target.value)})}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-zinc-900 text-white rounded-2xl py-5 font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <span className="uppercase tracking-widest text-sm">Launch Voyager AI</span>}
                </button>
            </form>
        </div>
    );
};
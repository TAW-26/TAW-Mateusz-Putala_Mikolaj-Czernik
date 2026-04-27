import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import {
    MapPin,
    Flag,
    Sparkles,
    Loader2,
    Compass,
    Car,
    Target,
    Route,
    Clock,
    Banknote
} from 'lucide-react';

export const AddTripPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        origin: { address: '' },
        destination: { address: '' },
        startDate: '',
        endDate: '',
        budget: 0,
        aiSettings: {
            intensity: 3,
            numberOfPoints: 10,
            extraTimeTolerance: 20, // Minuty na każde zatrzymanie
            searchMode: 'along-route', // 'along-route' | 'destinations-only'
            tripStyle: 'leisure',    // 'express' | 'leisure'
            maxDeviationKm: 15       // Jak daleko od trasy głównej AI może szukać
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userRaw = localStorage.getItem('user');
            const userData = userRaw ? JSON.parse(userRaw) : null;

            const payload = {
                ...formData,
                userPreferences: userData?.preferences || {}
            };

            const res = await api.post('/trips', payload);
            const tripId = res.data.data?._id || res.data._id;
            navigate(`/dashboard/trip/${tripId}`);
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
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Voyager Mission Deployment</span>
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
                        placeholder="np. Roadtrip przez Alpy"
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
                                required
                                value={formData.origin.address}
                                className="w-full bg-zinc-100 border-2 border-zinc-200 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-zinc-900 transition-all font-medium"
                                placeholder="Start City"
                                onChange={e => setFormData({...formData, origin: { address: e.target.value }})}
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
                                className="w-full bg-zinc-100 border-2 border-zinc-200 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-zinc-900 transition-all font-medium"
                                placeholder="End City"
                                onChange={e => setFormData({...formData, destination: { address: e.target.value }})}
                            />
                        </div>
                    </div>
                </div>

                {/* Daty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Launch Date</label>
                        <input
                            type="date"
                            required
                            className="w-full bg-zinc-100 border-2 border-zinc-200 rounded-2xl py-4 px-6 outline-none focus:border-zinc-900 transition-all"
                            onChange={e => setFormData({...formData, startDate: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Return Date</label>
                        <input
                            type="date"
                            required
                            className="w-full bg-zinc-100 border-2 border-zinc-200 rounded-2xl py-4 px-6 outline-none focus:border-zinc-900 transition-all"
                            onChange={e => setFormData({...formData, endDate: e.target.value})}
                        />
                    </div>
                </div>

                {/* AI SETTINGS BOX */}
                <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                    <Sparkles className="absolute right-[-20px] top-[-20px] w-40 h-40 text-white/5 pointer-events-none" />

                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold flex items-center gap-2 italic">
                            <Sparkles size={20} className="text-purple-400" /> Voyager Engine Setup
                        </h3>
                        <div className="bg-white/10 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border border-white/10">
                            Vehicle Mode: Car
                        </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                        {/* Tryb szukania */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                <Target size={12} /> Discovery Range Mode
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, aiSettings: {...formData.aiSettings, searchMode: 'along-route'}})}
                                    className={`py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${formData.aiSettings.searchMode === 'along-route' ? 'bg-white text-zinc-900 border-white shadow-lg' : 'border-white/10 text-zinc-400 hover:border-white/30'}`}
                                >
                                    Along the Route
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, aiSettings: {...formData.aiSettings, searchMode: 'destinations-only'}})}
                                    className={`py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${formData.aiSettings.searchMode === 'destinations-only' ? 'bg-white text-zinc-900 border-white shadow-lg' : 'border-white/10 text-zinc-400 hover:border-white/30'}`}
                                >
                                    End City Focus
                                </button>
                            </div>
                        </div>

                        {/* Suwak odchylenia i budżet */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                        <Route size={12} /> Max Deviation
                                    </label>
                                    <span className="text-xs font-bold text-purple-400">{formData.aiSettings.maxDeviationKm} km</span>
                                </div>
                                <input
                                    type="range" min="5" max="100" step="5"
                                    value={formData.aiSettings.maxDeviationKm}
                                    className="w-full accent-purple-500 cursor-pointer"
                                    onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, maxDeviationKm: Number(e.target.value)}})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                    <Banknote size={12} /> Budget (PLN)
                                </label>
                                <input
                                    type="number"
                                    placeholder="Total Budget"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-all text-white font-bold"
                                    value={formData.budget === 0 ? '' : formData.budget}
                                    onChange={e => setFormData({...formData, budget: Number(e.target.value)})}
                                />
                            </div>
                        </div>

                        {/* Intensywność i Styl */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                        <Clock size={12} /> Stop Frequency
                                    </label>
                                    <span className="text-xs font-bold text-white italic">{formData.aiSettings.intensity}/20</span>
                                </div>
                                <input
                                    type="range" min="1" max="20"
                                    value={formData.aiSettings.intensity}
                                    className="w-full accent-white cursor-pointer"
                                    onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, intensity: Number(e.target.value)}})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                    <Car size={12} /> Travel Tempo
                                </label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-all text-white text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer"
                                    value={formData.aiSettings.tripStyle}
                                    onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, tripStyle: e.target.value}})}
                                >
                                    <option value="leisure" className="bg-zinc-900">Leisure (Sightseeing)</option>
                                    <option value="express" className="bg-zinc-900">Express (Fast Move)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-zinc-900 text-white rounded-[1.5rem] py-5 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50 shadow-xl"
                >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : "Initialize AI Trajectory"}
                </button>
            </form>
        </div>
    );
};
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useUI } from '../../context/UIContext';
import { Loader2, Clock, Activity, Route, MapPin, Flag, Banknote, Calendar, MessageSquare } from 'lucide-react';

export const AddTripPage = () => {
    const navigate = useNavigate();
    const { toast } = useUI();
    const [loading, setLoading] = useState(false);

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
            navigate(`/trips/${tripId}`);
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Błąd walidacji';
            toast(`Nie udało się utworzyć wycieczki: ${message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <header className="mb-8">
                <h1 className="page-title">Nowa wycieczka</h1>
                <p className="page-subtitle mt-1">Uzupełnij szczegóły podróży i parametry AI</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tytuł wycieczki</label>
                    <input required value={formData.title} className="input-field" placeholder="np. Road trip po Polsce" onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="form-label">Punkt startowy</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input required value={formData.origin.address} className="input-field pl-10" placeholder="Miasto startowe" onChange={e => setFormData({...formData, origin: { address: e.target.value }})} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="form-label">Cel podróży</label>
                        <div className="relative">
                            <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input required value={formData.destination.address} className="input-field pl-10" placeholder="Miasto docelowe" onChange={e => setFormData({...formData, destination: { address: e.target.value }})} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="form-label">Data rozpoczęcia</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="date" required value={formData.startDate} className="input-field pl-10" onChange={e => setFormData({...formData, startDate: e.target.value})} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="form-label">Data zakończenia</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="date" required value={formData.endDate} className="input-field pl-10" onChange={e => setFormData({...formData, endDate: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="form-label">Specjalne wymagania</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 text-slate-400" size={16} />
                        <textarea
                            value={formData.description}
                            className="input-field pl-10 min-h-[100px] resize-none"
                            placeholder="np. Unikaj autostrad, tylko miejsca przyjazne psom..."
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Ustawienia AI</h3>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <label className="text-muted flex items-center gap-2">
                                <Activity size={14} /> Intensywność wycieczki
                            </label>
                            <span className="font-medium text-slate-900 dark:text-slate-100">{formData.aiSettings.intensity}/10</span>
                        </div>
                        <input type="range" min="0" max="10" step="1" value={formData.aiSettings.intensity} className="w-full accent-slate-900 cursor-pointer" onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, intensity: Number(e.target.value)}})} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <label className="text-muted flex items-center gap-2">
                                <Route size={14} /> Zasięg eksploracji
                            </label>
                            <span className="font-medium text-slate-900 dark:text-slate-100">{formData.aiSettings.discoverySpread}/10</span>
                        </div>
                        <input type="range" min="0" max="10" step="1" value={formData.aiSettings.discoverySpread} className="w-full accent-slate-900 cursor-pointer" onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, discoverySpread: Number(e.target.value)}})} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <label className="text-muted flex items-center gap-2">
                                <Clock size={14} /> Liczba przystanków
                            </label>
                            <span className="font-medium text-slate-900 dark:text-slate-100">{formData.aiSettings.numberOfPoints}</span>
                        </div>
                        <input type="range" min="1" max="20" step="1" value={formData.aiSettings.numberOfPoints} className="w-full accent-slate-900 cursor-pointer" onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, numberOfPoints: Number(e.target.value)}})} />
                    </div>

                    <div className="pt-4 border-t border-slate-200 space-y-1.5">
                        <label className="form-label flex items-center gap-2">
                            <Banknote size={14} /> Budżet (PLN)
                        </label>
                        <input type="number" className="input-field" placeholder="np. 2000" value={formData.budget || ''} onChange={e => setFormData({...formData, budget: Number(e.target.value)})} />
                    </div>
                </div>

                <button disabled={loading} type="submit" className="btn-primary w-full py-3">
                    {loading ? <Loader2 className="animate-spin" size={16} /> : 'Utwórz wycieczkę'}
                </button>
            </form>
        </div>
    );
};

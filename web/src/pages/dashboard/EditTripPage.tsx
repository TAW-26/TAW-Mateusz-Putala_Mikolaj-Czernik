import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useUI } from '../../context/UIContext';
import { Loader2, Activity, Route, Banknote, Save, Clock } from 'lucide-react';

export const EditTripPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useUI();
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

    useEffect(() => {
        api.get(`/trips/${id}`)
            .then(res => {
                const trip = res.data.data || res.data;
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
            navigate(`/trips/${id}`);
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message
                || (err as { message?: string }).message;
            toast(`Aktualizacja nie powiodła się: ${message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-slate-300" size={32} />
        </div>
    );

    return (
        <div className="max-w-xl mx-auto">
            <header className="mb-8">
                <h1 className="page-title">Edytuj wycieczkę</h1>
                <p className="page-subtitle mt-1">Zaktualizuj szczegóły wycieczki i parametry AI</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="form-label">Tytuł wycieczki</label>
                    <input required value={formData.title} className="input-field" onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 opacity-60">
                        <label className="form-label">Punkt startowy</label>
                        <input disabled value={formData.origin.address} className="input-field bg-slate-50 dark:bg-slate-800 cursor-not-allowed text-slate-500" />
                    </div>
                    <div className="space-y-1.5 opacity-60">
                        <label className="form-label">Cel podróży</label>
                        <input disabled value={formData.destination.address} className="input-field bg-slate-50 dark:bg-slate-800 cursor-not-allowed text-slate-500" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="form-label">Data rozpoczęcia</label>
                        <input type="date" required value={formData.startDate} className="input-field" onChange={e => setFormData({...formData, startDate: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="form-label">Data zakończenia</label>
                        <input type="date" required value={formData.endDate} className="input-field" onChange={e => setFormData({...formData, endDate: e.target.value})} />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="form-label">Specjalne wymagania</label>
                    <textarea value={formData.description} className="input-field min-h-[100px] resize-none text-sm" onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Ustawienia AI</h3>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <label className="text-muted flex items-center gap-2"><Activity size={14} /> Intensywność</label>
                            <span className="font-medium text-slate-900 dark:text-slate-100">{formData.aiSettings.intensity}/10</span>
                        </div>
                        <input type="range" min="0" max="10" value={formData.aiSettings.intensity} className="w-full accent-slate-900 cursor-pointer" onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, intensity: Number(e.target.value)}})} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <label className="text-muted flex items-center gap-2"><Route size={14} /> Zasięg eksploracji</label>
                            <span className="font-medium text-slate-900 dark:text-slate-100">{formData.aiSettings.discoverySpread}/10</span>
                        </div>
                        <input type="range" min="0" max="10" value={formData.aiSettings.discoverySpread} className="w-full accent-slate-900 cursor-pointer" onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, discoverySpread: Number(e.target.value)}})} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <label className="text-muted flex items-center gap-2"><Clock size={14} /> Liczba przystanków</label>
                            <span className="font-medium text-slate-900 dark:text-slate-100">{formData.aiSettings.numberOfPoints}</span>
                        </div>
                        <input type="range" min="1" max="20" step="1" value={formData.aiSettings.numberOfPoints} className="w-full accent-slate-900 cursor-pointer" onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, numberOfPoints: Number(e.target.value)}})} />
                    </div>

                    <div className="pt-4 border-t border-slate-200 space-y-1.5">
                        <label className="form-label flex items-center gap-2"><Banknote size={14} /> Budżet (PLN)</label>
                        <input type="number" className="input-field" value={formData.budget} onChange={e => setFormData({...formData, budget: Number(e.target.value)})} />
                    </div>
                </div>

                <button disabled={saving} type="submit" className="btn-primary w-full py-3">
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Zapisz zmiany</>}
                </button>
            </form>
        </div>
    );
};

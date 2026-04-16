import React, { useState } from 'react';
import { tripsService } from '../../api/tripsService.ts';
import { useNavigate } from 'react-router-dom';

export const AddTripPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        origin: { address: '' },
        destination: { address: '' },
        budget: 0,
        aiSettings: { intensity: 3, numberOfPoints: 5, extraTimeTolerance: 20 }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await tripsService.createTrip(formData);
            navigate('/dashboard');
        } catch (err) { alert("Błąd zapisu"); }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Nowa Podróż AI</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input placeholder="Tytuł" className="w-full border p-2" onChange={e => setFormData({...formData, title: e.target.value})} required />
                <input placeholder="Skąd (Punkt A)" className="w-full border p-2" onChange={e => setFormData({...formData, origin: {address: e.target.value}})} required />
                <input placeholder="Dokąd (Punkt B)" className="w-full border p-2" onChange={e => setFormData({...formData, destination: {address: e.target.value}})} required />

                <div className="bg-blue-50 p-4 rounded">
                    <h3 className="font-semibold mb-2">Ustawienia Planera AI</h3>
                    <label>Intensywność (1-5): {formData.aiSettings.intensity}</label>
                    <input type="range" min="1" max="5" className="w-full"
                           onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, intensity: Number(e.target.value)}})} />

                    <label>Liczba punktów: {formData.aiSettings.numberOfPoints}</label>
                    <input type="number" className="w-full border p-2"
                           onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, numberOfPoints: Number(e.target.value)}})} />
                </div>

                <button type="submit" className="w-full bg-green-600 text-white p-3 rounded">Utwórz i przejdź do planowania</button>
            </form>
        </div>
    );
};
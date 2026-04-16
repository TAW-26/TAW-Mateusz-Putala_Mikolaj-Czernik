import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { tripsService } from '../api/tripsService';
import type { Trip } from '../types';

export const TripDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const loadData = async () => {
        if (id) {
            const res = await tripsService.getTripDetails(id);
            setTrip(res.data);
        }
    };

    const handleGenerateAI = async () => {
        setIsGenerating(true);
        try {
            await tripsService.generateAIWaypoints(id!);
            await loadData(); // Odśwież listę po wygenerowaniu
        } finally { setIsGenerating(false); }
    };

    useEffect(() => { loadData(); }, [id]);

    if (!trip) return <div>Ładowanie...</div>;

    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{trip.title}</h1>
                    <p className="text-gray-600">{trip.origin.address} → {trip.destination.address}</p>
                </div>
                <button
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className="bg-purple-600 text-white px-6 py-2 rounded-full animate-pulse shadow-lg"
                >
                    {isGenerating ? '🤖 AI myśli...' : '✨ Generuj trasę AI'}
                </button>
            </header>

            <section className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Plan zwiedzania (Waypoints)</h2>
                    {trip.waypoints?.map((wp, index) => (
                        <div key={wp._id} className="border-l-4 border-purple-500 p-4 bg-white shadow-sm">
                            <span className="text-xs font-bold text-purple-600">PUNKT {index + 1}</span>
                            <h4 className="font-bold">{wp.name}</h4>
                            <p className="text-sm text-gray-500">{wp.description}</p>
                        </div>
                    ))}
                    {trip.waypoints?.length === 0 && <p className="italic">Brak punktów. Kliknij przycisk AI!</p>}
                </div>

                <div className="bg-gray-100 rounded-lg p-4 h-[400px] flex items-center justify-center">
                    <p className="text-gray-400">Tu będzie mapa (Leaflet/Google Maps)</p>
                </div>
            </section>
        </div>
    );
};
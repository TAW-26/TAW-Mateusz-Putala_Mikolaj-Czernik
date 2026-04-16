// src/pages/dashboard/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import type { Trip } from '../../types/';
import { tripsService } from '../../api/tripsService';

export const DashboardPage: React.FC = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const data = await tripsService.getAllTrips();
                setTrips(data);
            } catch (error) {
                console.error("Błąd podczas pobierania wycieczek:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    if (loading) return <div>Ładowanie Twoich przygód... ✈️</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Twoje Wycieczki</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {trips.length > 0 ? (
                    trips.map((trip) => (
                        <div key={trip._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                            <h3>{trip.destination}</h3>
                            <p>Budżet: <strong>{trip.budget} PLN</strong></p>
                            <p>Data: {new Date(trip.startDate).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p>Brak wycieczek. Może czas coś zaplanować z AI?</p>
                )}
            </div>
        </div>
    );
};
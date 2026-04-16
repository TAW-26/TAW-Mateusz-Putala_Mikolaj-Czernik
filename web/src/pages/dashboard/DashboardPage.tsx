import React, { useEffect, useState } from 'react';
import { tripsService } from '../../api/tripsService';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                // Teraz tripsService.getTrips() nie będzie już na czerwono!
                const response = await tripsService.getTrips();

                // Wyciągamy tablicę z pola 'data' (zgodnie z Twoim backendem)
                const actualTrips = response.data || [];

                console.log("Moje wycieczki z bazy:", actualTrips);
                setTrips(actualTrips);
            } catch (error) {
                console.error("Błąd pobierania:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    if (loading) return <p style={{ padding: '20px' }}>Ładowanie Twoich przygód...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Twoje Wycieczki ✈️</h1>
                <Link to="/add-trip">
                    <button style={{ padding: '10px', cursor: 'pointer' }}>+ Dodaj nową</button>
                </Link>
            </div>

            {trips.length === 0 ? (
                <p>Brak wycieczek. Może czas coś zaplanować z AI?</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '20px' }}>
                    {trips.map((trip) => (
                        <div key={trip._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                            {/* Zmiana: używamy title zamiast destination */}
                            <h3>{trip.title}</h3>
                            <p>📍 <strong>Cel:</strong> {trip.destination?.address}</p>
                            <p>💰 <strong>Budżet:</strong> {trip.budget} PLN</p>
                            <p>📅 <strong>Status:</strong> {trip.status}</p>
                            <button style={{ width: '100%', marginTop: '10px' }}>Szczegóły</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
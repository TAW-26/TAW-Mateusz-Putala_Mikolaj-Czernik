import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Naprawa ikon przez CDN - najbardziej niezawodna metoda
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapEffect({ coords }: { coords: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (coords && coords[0] !== 0) {
            map.setView(coords, 10);
            // Wymuszenie przeliczenia rozmiaru, aby mapa nie była "szara"
            setTimeout(() => map.invalidateSize(), 300);
        }
    }, [coords, map]);
    return null;
}

interface MapboxProps {
    waypoints: any[];
    center: [number, number];
}

export const Mapbox = ({ waypoints, center }: MapboxProps) => {
    return (
        /* KLUCZ: z-index: 0 sprawia, że mapa nie "wchodzi" na sidebar.
           Wcześniej Leaflet mógł mieć domyślnie z-index: 400+, co blokowało menu.
        */
        <div style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}>
            <MapContainer
                center={center}
                zoom={10}
                // Styl inline gwarantuje wysokość, a zIndex: 0 bezpieczeństwo nawigacji
                style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {waypoints.map((wp, idx) => {
                    // Sprawdzamy czy lokalizacja jest w formacie wp.location.lat (z bazy)
                    const lat = wp.location?.lat || wp.lat;
                    const lng = wp.location?.lng || wp.lng;

                    if (typeof lat === 'number' && typeof lng === 'number') {
                        return (
                            <Marker key={wp._id || idx} position={[lat, lng]}>
                                <Popup>
                                    <div className="text-zinc-900 font-bold p-1">
                                        {wp.name}
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    }
                    return null;
                })}

                <MapEffect coords={center} />
            </MapContainer>
        </div>
    );
};
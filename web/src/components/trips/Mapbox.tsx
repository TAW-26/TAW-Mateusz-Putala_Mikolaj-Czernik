import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useImperativeHandle, forwardRef } from 'react';

// Naprawa ikon przez CDN
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Komponent pomocniczy do obsługi lotu do punktu
function MapController({ internalRef }: { internalRef: any }) {
    const map = useMap();

    useImperativeHandle(internalRef, () => ({
        flyTo: (coords: [number, number]) => {
            map.flyTo(coords, 14, {
                duration: 1.5
            });
        }
    }));

    return null;
}

interface MapboxProps {
    waypoints: any[];
    center: [number, number];
}

export const Mapbox = forwardRef((props: MapboxProps, ref) => {
    const { waypoints, center } = props;

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}>
            <MapContainer
                center={center}
                zoom={10}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController internalRef={ref} />

                {waypoints.map((wp, idx) => {
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
            </MapContainer>
        </div>
    );
});
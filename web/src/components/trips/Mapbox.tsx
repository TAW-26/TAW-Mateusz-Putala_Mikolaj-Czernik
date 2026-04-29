import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useImperativeHandle, forwardRef } from 'react';

// Ikona standardowa (dla punktów pośrednich)
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Ikona Gwiazdy dla STARTU (Złota)
const StartIcon = L.divIcon({
    html: `<div style="font-size: 24px; filter: drop-shadow(0 0 5px gold); cursor: pointer;">⭐</div>`,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

// Ikona Flagi dla METY (Czerwona)
const EndIcon = L.divIcon({
    html: `<div style="font-size: 24px; filter: drop-shadow(0 0 5px #ef4444); cursor: pointer;">🚩</div>`,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

// Ustawienie domyślnej ikony
L.Marker.prototype.options.icon = DefaultIcon;

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
            {/* Opcjonalny styl CSS, aby div-ikony nie miały białego tła/ramek */}
            <style>
                {`.custom-div-icon { background: none !important; border: none !important; }`}
            </style>

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
// ROZWIĄZANIE: Jawne określenie typu unii dla TypeScript
                        let currentIcon: L.Icon | L.DivIcon = DefaultIcon;
                        let labelPrefix = "";

                        if (idx === 0) {
                            currentIcon = StartIcon;
                            labelPrefix = "🚀 START: ";
                        } else if (idx === waypoints.length - 1) {
                            currentIcon = EndIcon;
                            labelPrefix = "🏁 META: ";
                        }

                        return (
                            <Marker
                                key={wp._id || idx}
                                position={[lat, lng]}
                                icon={currentIcon}
                            >
                                <Popup>
                                    <div className="text-zinc-900 font-bold p-1">
                                        {labelPrefix && (
                                            <span className="text-[10px] text-zinc-500 block mb-1 uppercase tracking-tighter">
{labelPrefix}
</span>
                                        )}
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
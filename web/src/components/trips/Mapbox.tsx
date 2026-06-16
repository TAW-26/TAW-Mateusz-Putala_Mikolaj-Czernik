import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useImperativeHandle, forwardRef, useMemo } from 'react';

const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

function createCircleIcon(color: string, label?: string) {
    const inner = label
        ? `<span style="font-size:11px;font-weight:600;color:white">${label}</span>`
        : '';
    return L.divIcon({
        html: `<div style="
            width:28px;height:28px;border-radius:50%;
            background:${color};border:2px solid white;
            box-shadow:0 1px 4px rgba(0,0,0,0.25);
            display:flex;align-items:center;justify-content:center;
        ">${inner}</div>`,
        className: 'custom-div-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
    });
}

const StartIcon = createCircleIcon('#0f172a', 'A');
const EndIcon = createCircleIcon('#dc2626', 'B');

L.Marker.prototype.options.icon = DefaultIcon;

function MapController({ internalRef }: { internalRef: React.Ref<{ flyTo: (coords: [number, number]) => void }> }) {
    const map = useMap();
    useImperativeHandle(internalRef, () => ({
        flyTo: (coords: [number, number]) => {
            map.flyTo(coords, 14, { duration: 1.5 });
        }
    }));
    return null;
}

interface MapboxProps {
    waypoints: Array<{
        _id?: string;
        name: string;
        location?: { lat: number; lng: number };
        lat?: number;
        lng?: number;
    }>;
    center: [number, number];
}

export const Mapbox = forwardRef<{ flyTo: (coords: [number, number]) => void }, MapboxProps>((props, ref) => {
    const { waypoints, center } = props;

    const routePositions = useMemo(() => {
        return waypoints
            .map(wp => {
                const lat = wp.location?.lat ?? wp.lat;
                const lng = wp.location?.lng ?? wp.lng;
                if (typeof lat === 'number' && typeof lng === 'number') {
                    return [lat, lng] as [number, number];
                }
                return null;
            })
            .filter((pos): pos is [number, number] => pos !== null);
    }, [waypoints]);

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}>
            <style>
                {`.custom-div-icon { background: none !important; border: none !important; }`}
            </style>

            <MapContainer
                center={center}
                zoom={10}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController internalRef={ref} />

                {routePositions.length >= 2 && (
                    <Polyline
                        positions={routePositions}
                        pathOptions={{
                            color: '#475569',
                            weight: 3,
                            opacity: 0.8,
                        }}
                    />
                )}

                {waypoints.map((wp, idx) => {
                    const lat = wp.location?.lat ?? wp.lat;
                    const lng = wp.location?.lng ?? wp.lng;
                    if (typeof lat === 'number' && typeof lng === 'number') {
                        let currentIcon: L.Icon | L.DivIcon = DefaultIcon;
                        let labelPrefix = '';

                        if (idx === 0) {
                            currentIcon = StartIcon;
                            labelPrefix = 'Start';
                        } else if (idx === waypoints.length - 1) {
                            currentIcon = EndIcon;
                            labelPrefix = 'Koniec';
                        }

                        return (
                            <Marker
                                key={wp._id || idx}
                                position={[lat, lng]}
                                icon={currentIcon}
                            >
                                <Popup>
                                    <div className="text-slate-900 dark:text-slate-100 text-sm">
                                        {labelPrefix && (
                                            <span className="text-xs text-muted block mb-0.5">
                                                {labelPrefix}
                                            </span>
                                        )}
                                        <span className="font-medium">{wp.name}</span>
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

Mapbox.displayName = 'Mapbox';

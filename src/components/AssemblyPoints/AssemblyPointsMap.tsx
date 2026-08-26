import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import type { AssemblyPoint } from '../../services/assemblyPoints';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface AssemblyPointsMapProps {
  points: AssemblyPoint[];
  onSelect: (point: AssemblyPoint) => void;
  onMapClick?: (lat: number, lng: number) => void;
  pendingMarker?: { lat: number; lng: number } | null;
}

function ClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function AssemblyPointsMap({
  points,
  onSelect,
  onMapClick,
  pendingMarker,
}: AssemblyPointsMapProps) {
  return (
    <MapContainer center={[45.9432, 24.9668]} zoom={7} style={{ height: 420, borderRadius: 12 }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onMapClick={onMapClick} />
      {points.map((point) => (
        <Marker
          key={point.id}
          position={[point.lat, point.lng]}
          eventHandlers={{ click: () => onSelect(point) }}
        >
          <Popup>
            <strong>{point.name}</strong>
            <br />
            {point.address}
            <br />
            {point.isActive ? 'Activ' : 'Dezactivat'}
          </Popup>
        </Marker>
      ))}
      {pendingMarker && <Marker position={[pendingMarker.lat, pendingMarker.lng]} />}
    </MapContainer>
  );
}
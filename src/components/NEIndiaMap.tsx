import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { Incident, Vehicle } from "../data/mockData";

const icon = (color: string) => L.divIcon({
  className: "ner-map-marker",
  html: `<div style="width:15px;height:15px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 5px #0006"></div>`,
  iconSize: [19, 19],
  iconAnchor: [9, 9],
});

interface NEIndiaMapProps {
  vehicles?: Vehicle[];
  incidents?: Incident[];
  showVehicles?: boolean;
  showIncidents?: boolean;
  showRoutes?: boolean;
  compact?: boolean;
  selectedVehicle?: string | null;
  onVehicleClick?: (vehicle: Vehicle) => void;
  onIncidentClick?: (incident: Incident) => void;
}

export default function NEIndiaMap({
  vehicles = [],
  incidents = [],
  showVehicles = true,
  showIncidents = true,
  selectedVehicle,
  onVehicleClick,
  onIncidentClick,
}: NEIndiaMapProps) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <MapContainer center={[25.2, 92.7]} zoom={7} style={{ width: "100%", height: "100%" }} zoomControl={!selectedVehicle}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        {showVehicles && vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.lat, vehicle.lng]}
            icon={icon(vehicle.status === "stopped" ? "#dc2626" : vehicle.status === "delayed" ? "#f97316" : "#1a56db")}
            eventHandlers={{ click: () => onVehicleClick?.(vehicle) }}
          >
            <Popup><strong>{vehicle.id} · {vehicle.regNo}</strong><br />{vehicle.cargo}<br />{vehicle.currentLocation}</Popup>
          </Marker>
        ))}
        {showIncidents && incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.lat, incident.lng]}
            icon={icon(incident.severity === "critical" ? "#dc2626" : incident.severity === "high" ? "#f97316" : "#eab308")}
            eventHandlers={{ click: () => onIncidentClick?.(incident) }}
          >
            <Popup><strong>{incident.title}</strong><br />{incident.location}<br />{incident.severity.toUpperCase()}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

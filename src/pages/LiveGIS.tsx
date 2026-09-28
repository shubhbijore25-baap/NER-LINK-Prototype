import { useEffect, useState } from "react";
import NEIndiaMap from "../components/NEIndiaMap";
import StatusBadge from "../components/StatusBadge";
import { type Vehicle, type Incident } from "../data/mockData";
import { api } from "../api";

type LayerKey = "vehicles" | "incidents" | "blockedRoads" | "riskZones" | "routes";

export default function LiveGIS() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    vehicles: true,
    incidents: true,
    blockedRoads: true,
    riskZones: true,
    routes: false,
  });
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    api.vehicles().then(setVehicles).catch((error) => console.error("Could not load GIS vehicles", error));
    api.incidents().then(setIncidents).catch((error) => console.error("Could not load GIS incidents", error));
  }, []);

  const toggleLayer = (key: LayerKey) => setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  const matchingVehicles = vehicles.filter((v) => !searchVal || `${v.id} ${v.regNo} ${v.currentLocation}`.toLowerCase().includes(searchVal.toLowerCase()));
  const filteredIncidents = incidents.filter((i) => (filterSeverity === "all" || i.severity === filterSeverity) && (!searchVal || `${i.title} ${i.location} ${i.district} ${i.state}`.toLowerCase().includes(searchVal.toLowerCase())));

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Left panel */}
      <div style={{ width: 300, background: "#fff", borderRight: "1px solid #e4e7ec", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Search */}
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f0f2f5" }}>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} width="13" height="13" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            <input
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search locations, vehicles…"
              style={{ width: "100%", padding: "7px 10px 7px 28px", fontSize: 12, border: "1px solid #e4e7ec", borderRadius: 5, outline: "none", fontFamily: "Inter, sans-serif", color: "#374151" }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #e4e7ec" }}>
          {["Incidents", "Vehicles"].map((tab) => {
            const active = tab === (selectedIncident ? "Incidents" : selectedVehicle ? "Vehicles" : "Incidents");
            return (
              <button key={tab} onClick={() => { if (tab === "Incidents") setSelectedVehicle(null); else setSelectedIncident(null); }} style={{ flex: 1, padding: "9px 0", fontSize: 12, fontWeight: 600, border: "none", background: "none", borderBottom: `2px solid ${active ? "#1a56db" : "transparent"}`, color: active ? "#1a56db" : "#6b7280", cursor: "pointer" }}>
                {tab} {tab === "Incidents" ? `(${filteredIncidents.length})` : `(${vehicles.length})`}
              </button>
            );
          })}
        </div>

        {/* Filter */}
        <div style={{ padding: "8px 14px", borderBottom: "1px solid #f0f2f5", display: "flex", gap: 4, flexWrap: "wrap" }}>
          {["all", "critical", "high", "medium", "low"].map((s) => (
            <button key={s} onClick={() => setFilterSeverity(s)} style={{ padding: "2px 8px", fontSize: 10, fontWeight: 600, border: "1px solid", borderColor: filterSeverity === s ? "#1a56db" : "#e4e7ec", borderRadius: 3, background: filterSeverity === s ? "#eff6ff" : "#fff", color: filterSeverity === s ? "#1a56db" : "#6b7280", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {s}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filteredIncidents.map((inc) => (
            <div key={inc.id} onClick={() => setSelectedIncident(inc)} style={{ padding: "10px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: selectedIncident?.id === inc.id ? "#eff6ff" : "#fff", borderLeft: `3px solid ${selectedIncident?.id === inc.id ? "#1a56db" : "transparent"}` }}
              onMouseEnter={(e) => { if (selectedIncident?.id !== inc.id) (e.currentTarget as HTMLDivElement).style.background = "#f9fafb"; }}
              onMouseLeave={(e) => { if (selectedIncident?.id !== inc.id) (e.currentTarget as HTMLDivElement).style.background = "#fff"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1f2937" }}>{inc.title}</div>
                <StatusBadge status={inc.severity} />
              </div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>{inc.location}</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{inc.district}, {inc.state}</div>
              <div style={{ marginTop: 5, display: "flex", gap: 5 }}>
                {inc.affectedRoutes.map((r) => <span key={r} style={{ fontSize: 9, background: "#fef2f2", color: "#dc2626", padding: "1px 5px", borderRadius: 3, fontWeight: 600 }}>{r}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map area */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column" }}>
        {/* Map toolbar */}
        <div style={{ height: 44, background: "#fff", borderBottom: "1px solid #e4e7ec", display: "flex", alignItems: "center", padding: "0 14px", gap: 8, flexShrink: 0 }}>
          <button onClick={() => setShowLayerPanel((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", fontSize: 12, fontWeight: 500, border: "1px solid #e4e7ec", borderRadius: 4, background: showLayerPanel ? "#eff6ff" : "#fff", color: showLayerPanel ? "#1a56db" : "#374151", cursor: "pointer" }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Layers
          </button>
          <div style={{ height: 20, width: 1, background: "#e4e7ec" }}/>
          {(Object.keys(layers) as LayerKey[]).map((key) => (
            <button key={key} onClick={() => toggleLayer(key)} style={{ padding: "4px 10px", fontSize: 11, border: "1px solid", borderColor: layers[key] ? "#1a56db" : "#e4e7ec", borderRadius: 4, background: layers[key] ? "#eff6ff" : "#fff", color: layers[key] ? "#1a56db" : "#9ca3af", cursor: "pointer", fontWeight: 500, textTransform: "capitalize" }}>
              {key.replace(/([A-Z])/g, " $1")}
            </button>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 11, color: "#9ca3af", fontFamily: "JetBrains Mono, monospace" }}>
            NE India · 8 States · OSM-based
          </div>
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: "relative" }}>
          <NEIndiaMap
            vehicles={matchingVehicles}
            incidents={filteredIncidents}
            showVehicles={layers.vehicles}
            showIncidents={layers.incidents}
            showRoutes={layers.routes}
            selectedVehicle={selectedVehicle?.id}
            onVehicleClick={(v) => { setSelectedVehicle(v); setSelectedIncident(null); }}
            onIncidentClick={(i) => { setSelectedIncident(i); setSelectedVehicle(null); }}
          />
        </div>
      </div>

      {/* Detail panel (right) */}
      {(selectedVehicle || selectedIncident) && (
        <div className="fade-in" style={{ width: 300, background: "#fff", borderLeft: "1px solid #e4e7ec", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #f0f2f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#111827" }}>
              {selectedVehicle ? "Vehicle Detail" : "Incident Detail"}
            </div>
            <button onClick={() => { setSelectedVehicle(null); setSelectedIncident(null); }} style={{ width: 24, height: 24, background: "#f3f4f6", border: "none", borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>

          <div style={{ padding: "14px", overflowY: "auto", flex: 1 }}>
            {selectedVehicle && (
              <VehicleDetail v={selectedVehicle} />
            )}
            {selectedIncident && !selectedVehicle && (
              <IncidentDetail inc={selectedIncident} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function VehicleDetail({ v }: { v: Vehicle }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "Manrope, sans-serif", color: "#111827" }}>{v.id}</div>
          <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "JetBrains Mono, monospace" }}>{v.regNo}</div>
        </div>
        <StatusBadge status={v.status} size="md"/>
      </div>

      {[
        { label: "Driver", val: v.driver },
        { label: "Phone", val: v.phone },
        { label: "From", val: v.from },
        { label: "To", val: v.to },
        { label: "Current Location", val: v.currentLocation },
        { label: "Cargo", val: v.cargo },
        { label: "ETA", val: v.eta },
        { label: "Speed", val: `${v.speed} km/h` },
        { label: "Fuel", val: `${v.fuel}%` },
      ].map(({ label, val }) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f3f4f6", fontSize: 12 }}>
          <span style={{ color: "#9ca3af", fontWeight: 500 }}>{label}</span>
          <span style={{ color: "#1f2937", fontWeight: 500, textAlign: "right", maxWidth: "60%", wordBreak: "break-word" }}>{val}</span>
        </div>
      ))}

      {/* Progress bar */}
      <div style={{ marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b7280", marginBottom: 4 }}>
          <span>Route progress</span>
          <span style={{ fontWeight: 700 }}>{v.progress}%</span>
        </div>
        <div style={{ height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${v.progress}%`, height: "100%", background: v.status === "delayed" ? "#f97316" : v.status === "stopped" ? "#dc2626" : "#1a56db", borderRadius: 3 }}/>
        </div>
      </div>

      {v.delay > 0 && (
        <div style={{ marginTop: 10, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 5, padding: "8px 10px", fontSize: 11 }}>
          <div style={{ fontWeight: 600, color: "#c2410c" }}>⚠ {v.delay} min delay reported</div>
          <div style={{ color: "#92400e", marginTop: 2 }}>Check incident reports for affected routes</div>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <StatusBadge status={v.risk} />
        <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 6 }}>risk level</span>
      </div>

      <div style={{ marginTop: 12, fontSize: 10, color: "#9ca3af" }}>Last updated: {v.lastUpdate}</div>
    </div>
  );
}

function IncidentDetail({ inc }: { inc: Incident }) {
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <StatusBadge status={inc.severity} size="md"/>
        <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "Manrope, sans-serif", color: "#111827", marginTop: 6, lineHeight: 1.3 }}>{inc.title}</div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>{inc.id}</div>
      </div>

      {[
        { label: "Location", val: inc.location },
        { label: "District", val: inc.district },
        { label: "State", val: inc.state },
        { label: "Type", val: inc.type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) },
        { label: "Status", val: <StatusBadge status={inc.status}/> },
        { label: "Reported By", val: inc.reportedBy },
        { label: "Reported At", val: new Date(inc.reportedAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) },
      ].map(({ label, val }) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f3f4f6", fontSize: 12 }}>
          <span style={{ color: "#9ca3af", fontWeight: 500 }}>{label}</span>
          <span style={{ color: "#1f2937", fontWeight: 500, textAlign: "right", maxWidth: "65%" }}>{val}</span>
        </div>
      ))}

      <div style={{ marginTop: 12, fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{inc.description}</div>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>Affected Routes</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {inc.affectedRoutes.map((r) => <span key={r} style={{ fontSize: 11, background: "#fef2f2", color: "#dc2626", padding: "2px 8px", borderRadius: 3, fontWeight: 600 }}>{r}</span>)}
        </div>
      </div>
    </div>
  );
}

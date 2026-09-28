import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import NEIndiaMap from "../components/NEIndiaMap";
import { type Vehicle } from "../data/mockData";
import { api } from "../api";

const statusColor: Record<string, string> = {
  en_route: "#1a56db",
  delayed: "#f97316",
  stopped: "#dc2626",
  delivered: "#10b981",
  maintenance: "#8b5cf6",
};

function fuelColor(f: number) {
  if (f < 25) return "#dc2626";
  if (f < 50) return "#f59e0b";
  return "#10b981";
}

export default function VehicleTracking() {
  const [vehicleRows, setVehicleRows] = useState<Vehicle[]>([]);
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [sortCol, setSortCol] = useState<"id" | "status" | "delay" | "risk">("id");
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    api.vehicles().then(setVehicleRows).catch((error) => console.error("Could not load vehicles", error));
  }, []);

  const filtered = vehicleRows.filter((v) => {
    if (filterStatus !== "all" && v.status !== filterStatus) return false;
    if (filterRisk !== "all" && v.risk !== filterRisk) return false;
    return true;
  }).sort((a, b) => {
    if (sortCol === "delay") return b.delay - a.delay;
    if (sortCol === "status") return a.status.localeCompare(b.status);
    if (sortCol === "risk") {
      const r = ["critical","high","medium","low"];
      return r.indexOf(a.risk) - r.indexOf(b.risk);
    }
    return a.id.localeCompare(b.id);
  });

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Toolbar */}
        <div style={{ padding: "12px 20px", background: "#fff", borderBottom: "1px solid #e4e7ec", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
          {/* Status filter */}
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>Status:</span>
            {["all", "en_route", "delayed", "stopped", "delivered", "maintenance"].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: "3px 9px", fontSize: 10.5, border: "1px solid", borderColor: filterStatus === s ? "#1a56db" : "#e4e7ec", borderRadius: 4, background: filterStatus === s ? "#eff6ff" : "#fff", color: filterStatus === s ? "#1a56db" : "#6b7280", cursor: "pointer", fontWeight: 500, textTransform: s === "all" ? "capitalize" : undefined, letterSpacing: "0.02em" }}>
                {s === "all" ? "All" : s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
          <div style={{ height: 20, width: 1, background: "#e4e7ec" }}/>
          {/* Risk filter */}
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>Risk:</span>
            {["all", "critical", "high", "medium", "low"].map((r) => (
              <button key={r} onClick={() => setFilterRisk(r)} style={{ padding: "3px 9px", fontSize: 10.5, border: "1px solid", borderColor: filterRisk === r ? "#1a56db" : "#e4e7ec", borderRadius: 4, background: filterRisk === r ? "#eff6ff" : "#fff", color: filterRisk === r ? "#1a56db" : "#6b7280", cursor: "pointer", fontWeight: 500, textTransform: "capitalize" }}>
                {r}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button onClick={() => setShowMap(!showMap)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", fontSize: 12, border: "1px solid #e4e7ec", borderRadius: 4, background: showMap ? "#eff6ff" : "#fff", color: showMap ? "#1a56db" : "#374151", cursor: "pointer", fontWeight: 500 }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 3C12 3 8 8 8 12s4 9 4 9M12 3c0 0 4 5 4 9s-4 9-4 9M3 12h18" stroke="currentColor" strokeWidth="1.5"/></svg>
              {showMap ? "Hide Map" : "Show Map"}
            </button>
            <span style={{ fontSize: 11, color: "#9ca3af", alignSelf: "center" }}>{filtered.length} vehicles</span>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Table */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e4e7ec", position: "sticky", top: 0, zIndex: 2 }}>
                  {[
                    { key: "id", label: "Vehicle ID" },
                    { key: null, label: "Driver" },
                    { key: "status", label: "Status" },
                    { key: null, label: "Route" },
                    { key: null, label: "Current Location" },
                    { key: null, label: "Cargo" },
                    { key: null, label: "ETA" },
                    { key: "delay", label: "Delay" },
                    { key: null, label: "Fuel" },
                    { key: "risk", label: "Risk" },
                    { key: null, label: "" },
                  ].map(({ key, label }) => (
                    <th key={label || Math.random()} onClick={() => key && setSortCol(key as typeof sortCol)} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap", cursor: key ? "pointer" : "default", userSelect: "none", background: "#f9fafb" }}>
                      {label} {key && sortCol === key && "↑"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => {
                  const isSelected = selected?.id === v.id;
                  return (
                    <tr
                      key={v.id}
                      onClick={() => setSelected(isSelected ? null : v)}
                      className="table-row-hover"
                      style={{ borderBottom: "1px solid #f3f4f6", cursor: "pointer", background: isSelected ? "#eff6ff" : undefined, transition: "background 100ms" }}
                    >
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: "#1a56db", fontSize: 12 }}>{v.id}</div>
                        <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>{v.regNo}</div>
                      </td>
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: 500, color: "#1f2937" }}>{v.driver}</div>
                        <div style={{ fontSize: 10, color: "#9ca3af" }}>{v.phone}</div>
                      </td>
                      <td style={{ padding: "10px 14px" }}><StatusBadge status={v.status}/></td>
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <div style={{ color: "#374151", fontWeight: 500 }}>{v.from}</div>
                        <div style={{ fontSize: 10, color: "#9ca3af" }}>→ {v.to}</div>
                      </td>
                      <td style={{ padding: "10px 14px", maxWidth: 160, color: "#6b7280" }}>{v.currentLocation}</td>
                      <td style={{ padding: "10px 14px", maxWidth: 140, color: "#6b7280" }}>{v.cargo}</td>
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap", color: v.status === "delivered" ? "#10b981" : "#374151", fontWeight: 500 }}>{v.eta}</td>
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        {v.delay > 0 ? (
                          <span style={{ color: v.delay > 60 ? "#dc2626" : "#f97316", fontWeight: 700 }}>+{v.delay}m</span>
                        ) : (
                          <span style={{ color: "#10b981", fontWeight: 600 }}>On time</span>
                        )}
                      </td>
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 40, height: 4, background: "#f3f4f6", borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ width: `${v.fuel}%`, height: "100%", background: fuelColor(v.fuel), borderRadius: 2 }}/>
                          </div>
                          <span style={{ fontSize: 11, color: fuelColor(v.fuel), fontWeight: 600 }}>{v.fuel}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 14px" }}><StatusBadge status={v.risk}/></td>
                      <td style={{ padding: "10px 14px" }}>
                        <button onClick={(e) => { e.stopPropagation(); setSelected(v); }} style={{ fontSize: 11, color: "#1a56db", background: "none", border: "1px solid #dbeafe", borderRadius: 4, padding: "3px 8px", cursor: "pointer", fontWeight: 500 }}>Detail</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mini map */}
          {showMap && (
            <div style={{ width: 320, borderLeft: "1px solid #e4e7ec", flexShrink: 0 }}>
              <NEIndiaMap vehicles={vehicleRows} showVehicles showIncidents={false} compact={true} selectedVehicle={selected?.id} onVehicleClick={(v) => setSelected(v)}/>
            </div>
          )}
        </div>
      </div>

      {/* Detail side panel */}
      {selected && (
        <div className="fade-in" style={{ width: 320, background: "#fff", borderLeft: "1px solid #e4e7ec", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #f0f2f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#111827" }}>Vehicle Detail</div>
            <button onClick={() => setSelected(null)} style={{ width: 24, height: 24, background: "#f3f4f6", border: "none", borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>
            {/* Vehicle header */}
            <div style={{ background: `${statusColor[selected.status]}12`, border: `1px solid ${statusColor[selected.status]}40`, borderRadius: 6, padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "Manrope, sans-serif", color: "#111827" }}>{selected.id}</div>
                <StatusBadge status={selected.status} size="md"/>
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", fontFamily: "JetBrains Mono, monospace" }}>{selected.regNo}</div>
              <div style={{ fontSize: 12, color: "#374151", marginTop: 4, fontWeight: 500 }}>{selected.driver}</div>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                <span style={{ color: "#9ca3af" }}>{selected.from}</span>
                <span style={{ color: "#9ca3af" }}>{selected.to}</span>
              </div>
              <div style={{ height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${selected.progress}%`, height: "100%", background: statusColor[selected.status], borderRadius: 4, transition: "width 0.3s" }}/>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9ca3af", marginTop: 3 }}>
                <span>{selected.progress}% complete</span>
                <span>{100 - selected.progress}% remaining</span>
              </div>
            </div>

            {/* Key metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                { label: "Speed", val: `${selected.speed} km/h`, accent: selected.speed === 0 ? "#9ca3af" : "#1a56db" },
                { label: "Fuel", val: `${selected.fuel}%`, accent: fuelColor(selected.fuel) },
                { label: "Delay", val: selected.delay > 0 ? `+${selected.delay}m` : "On time", accent: selected.delay > 60 ? "#dc2626" : selected.delay > 0 ? "#f97316" : "#10b981" },
                { label: "Risk Level", val: selected.risk.charAt(0).toUpperCase() + selected.risk.slice(1), accent: selected.risk === "critical" ? "#dc2626" : selected.risk === "high" ? "#f97316" : selected.risk === "medium" ? "#f59e0b" : "#10b981" },
              ].map(({ label, val, accent }) => (
                <div key={label} style={{ background: "#f9fafb", borderRadius: 5, padding: "8px 10px", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, fontFamily: "Manrope, sans-serif", color: accent }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Details */}
            {[
              { label: "Current Location", val: selected.currentLocation },
              { label: "Cargo", val: selected.cargo },
              { label: "ETA", val: selected.eta },
              { label: "Last Update", val: selected.lastUpdate },
              { label: "Vehicle Type", val: selected.type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f3f4f6", fontSize: 11.5 }}>
                <span style={{ color: "#9ca3af", fontWeight: 500 }}>{label}</span>
                <span style={{ color: "#1f2937", fontWeight: 500, textAlign: "right", maxWidth: "55%" }}>{val}</span>
              </div>
            ))}

            {/* Timeline */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Route Timeline</div>
              {[
                { time: "08:30", event: `Departed ${selected.from}`, done: true },
                { time: "11:15", event: "Checkpoint A — cleared", done: selected.progress > 25 },
                { time: "13:20", event: selected.status === "delayed" ? "Delay recorded — congestion" : "Midpoint checkpoint", done: selected.progress > 50, warn: selected.status === "delayed" },
                { time: selected.eta, event: `Estimated arrival ${selected.to}`, done: selected.status === "delivered" },
              ].map(({ time, event, done, warn }, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: done ? "#10b981" : warn ? "#f97316" : "#e5e7eb", border: "2px solid", borderColor: done ? "#10b981" : warn ? "#f97316" : "#d1d5db", marginTop: 1 }}/>
                    {i < 3 && <div style={{ width: 1.5, flex: 1, background: done ? "#10b981" : "#e5e7eb", minHeight: 16, marginTop: 2 }}/>}
                  </div>
                  <div style={{ paddingBottom: 8 }}>
                    <div style={{ fontSize: 10, color: "#9ca3af", fontFamily: "JetBrains Mono, monospace" }}>{time}</div>
                    <div style={{ fontSize: 11.5, color: warn ? "#f97316" : done ? "#374151" : "#9ca3af", fontWeight: done ? 500 : 400 }}>{event}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button style={{ flex: 1, padding: "7px", fontSize: 11.5, background: "#1a56db", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontWeight: 600 }}>Contact Driver</button>
              <button style={{ flex: 1, padding: "7px", fontSize: 11.5, background: "#fff", color: "#374151", border: "1px solid #e4e7ec", borderRadius: 5, cursor: "pointer", fontWeight: 500 }}>Reroute</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

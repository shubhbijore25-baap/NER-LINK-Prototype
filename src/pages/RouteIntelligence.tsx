import { useEffect, useState } from "react";
import NEIndiaMap from "../components/NEIndiaMap";
import StatusBadge from "../components/StatusBadge";
import { type Route, type Incident } from "../data/mockData";
import { api } from "../api";

const ORIGINS = ["Guwahati", "Silchar", "Dimapur", "Imphal", "Shillong", "Agartala", "Itanagar", "Gangtok", "Aizawl", "Dibrugarh"];
const DESTS = ["Imphal", "Aizawl", "Kohima", "Shillong", "Agartala", "Itanagar", "Dibrugarh", "Gangtok", "Guwahati", "Silchar"];

function riskColor(score: number) {
  if (score >= 70) return "#dc2626";
  if (score >= 45) return "#f97316";
  if (score >= 25) return "#f59e0b";
  return "#10b981";
}

function riskLabel(score: number) {
  if (score >= 70) return "critical";
  if (score >= 45) return "high";
  if (score >= 25) return "medium";
  return "low";
}

function fmtEta(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function RouteIntelligence() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [incidentRows, setIncidentRows] = useState<Incident[]>([]);
  const [origin, setOrigin] = useState("Guwahati");
  const [dest, setDest] = useState("Imphal");
  const [vehicleType, setVehicleType] = useState("truck");
  const [analysed, setAnalysed] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.incidents().then(setIncidentRows).catch((error) => console.error("Could not load route incidents", error));
    api.analyseRoutes("Guwahati", "Imphal", "truck").then((rows) => {
      setRoutes(rows);
      if (rows.length) setSelectedRoute(rows[1]?.id ?? rows[0].id);
    }).catch((error) => console.error("Could not load routes", error));
  }, []);

  const handleAnalyse = () => {
    setLoading(true);
    api.analyseRoutes(origin, dest, vehicleType).then((rows) => {
      setRoutes(rows);
      setAnalysed(true);
      if (rows.length) setSelectedRoute(rows.find((r) => r.type === "recommended")?.id ?? rows[0].id);
    }).catch((error) => {
      console.error("Route analysis failed", error);
      window.alert("Route analysis failed. Check that the backend is running and try again.");
    }).finally(() => setLoading(false));
  };

  const sel = routes.find((r) => r.id === selectedRoute);

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Left panel — inputs + route results */}
      <div style={{ width: 340, background: "#fff", borderRight: "1px solid #e4e7ec", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Inputs */}
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #f0f2f5" }}>
          <div style={{ fontWeight: 700, fontFamily: "Manrope, sans-serif", fontSize: 14, color: "#111827", marginBottom: 12 }}>Route Planning</div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Origin</label>
            <select value={origin} onChange={(e) => setOrigin(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: "1px solid #e4e7ec", borderRadius: 5, outline: "none", fontFamily: "Inter, sans-serif", color: "#374151", cursor: "pointer" }}>
              {ORIGINS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
            <button onClick={() => { const tmp = origin; setOrigin(dest); setDest(tmp); }} style={{ width: 28, height: 28, border: "1px solid #e4e7ec", borderRadius: "50%", background: "#f9fafb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Destination</label>
            <select value={dest} onChange={(e) => setDest(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12, border: "1px solid #e4e7ec", borderRadius: 5, outline: "none", fontFamily: "Inter, sans-serif", color: "#374151", cursor: "pointer" }}>
              {DESTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Vehicle Type</label>
            <div style={{ display: "flex", gap: 6 }}>
              {["truck", "van", "ambulance"].map((t) => (
                <button key={t} onClick={() => setVehicleType(t)} style={{ flex: 1, padding: "5px 0", fontSize: 11, border: "1px solid", borderColor: vehicleType === t ? "#1a56db" : "#e4e7ec", borderRadius: 4, background: vehicleType === t ? "#eff6ff" : "#fff", color: vehicleType === t ? "#1a56db" : "#6b7280", cursor: "pointer", fontWeight: 500, textTransform: "capitalize" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleAnalyse}
            disabled={loading}
            style={{ width: "100%", padding: "9px", background: loading ? "#6b7280" : "#1a56db", color: "#fff", border: "none", borderRadius: 5, fontSize: 13, fontWeight: 700, cursor: loading ? "default" : "pointer", fontFamily: "Manrope, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            {loading ? (
              <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }}/>Analysing Routes…</>
            ) : (
              <><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>Analyse Routes</>
            )}
          </button>
        </div>

        {/* Route Results */}
        {analysed && !loading && (
          <div style={{ flex: 1, overflowY: "auto" }}>
            <div style={{ padding: "10px 16px 6px", fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {origin} → {dest} · {routes.length} routes found
            </div>
            {routes.map((route) => {
              const isSelected = selectedRoute === route.id;
              const isRec = route.type === "recommended";
              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRoute(route.id)}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f9fafb",
                    cursor: "pointer",
                    background: isSelected ? "#eff6ff" : "#fff",
                    borderLeft: `3px solid ${isSelected ? "#1a56db" : "transparent"}`,
                    position: "relative",
                  }}
                  onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = "#f9fafb"; }}
                  onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = "#fff"; }}
                >
                  {isRec && (
                    <span style={{ position: "absolute", top: 10, right: 14, fontSize: 9, background: "#ecfdf5", color: "#057a55", padding: "1px 6px", borderRadius: 3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>★ Recommended</span>
                  )}
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1f2937", marginBottom: 5, paddingRight: isRec ? 80 : 0 }}>{route.name}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", fontSize: 11 }}>
                    <div style={{ color: "#6b7280" }}>Distance: <strong style={{ color: "#374151" }}>{route.distance} km</strong></div>
                    <div style={{ color: "#6b7280" }}>ETA: <strong style={{ color: "#374151" }}>{fmtEta(route.eta)}</strong></div>
                    <div style={{ color: "#6b7280" }}>Delay: <strong style={{ color: route.delay > 60 ? "#dc2626" : route.delay > 20 ? "#f97316" : "#374151" }}>+{route.delay}m</strong></div>
                    <div style={{ color: "#6b7280" }}>Incidents: <strong style={{ color: route.incidents > 0 ? "#dc2626" : "#374151" }}>{route.incidents}</strong></div>
                  </div>
                  {/* Risk score bar */}
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9ca3af", marginBottom: 3 }}>
                      <span>Risk Score</span>
                      <span style={{ fontWeight: 700, color: riskColor(route.riskScore) }}>{route.riskScore}/100</span>
                    </div>
                    <div style={{ height: 4, background: "#f3f4f6", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${route.riskScore}%`, height: "100%", background: riskColor(route.riskScore), borderRadius: 2 }}/>
                    </div>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <StatusBadge status={route.condition}/>
                    <span style={{ marginLeft: 6 }}><StatusBadge status={riskLabel(route.riskScore)}/></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Map */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        {/* Route detail bar */}
        {sel && (
          <div className="fade-in" style={{ background: "#fff", borderBottom: "1px solid #e4e7ec", padding: "10px 16px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Selected Route</div>
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "Manrope, sans-serif", color: "#1f2937" }}>{sel.name}</div>
            </div>
            <div style={{ height: 28, width: 1, background: "#e4e7ec" }}/>
            {[
              { label: "Distance", val: `${sel.distance} km` },
              { label: "Est. Time", val: fmtEta(sel.eta) },
              { label: "Delay", val: `+${sel.delay} min` },
              { label: "Risk", val: <StatusBadge status={riskLabel(sel.riskScore)}/> },
              { label: "Road Condition", val: <StatusBadge status={sel.condition}/> },
              { label: "Incidents", val: String(sel.incidents) },
            ].map(({ label, val }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1f2937" }}>{val}</div>
              </div>
            ))}
            <button style={{ marginLeft: "auto", padding: "6px 14px", background: "#1a56db", color: "#fff", border: "none", borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Assign to Vehicle
            </button>
          </div>
        )}

        <div style={{ flex: 1 }}>
          <NEIndiaMap vehicles={[]} incidents={incidentRows} showVehicles={false} showIncidents showRoutes={sel?.type === "recommended"} />
        </div>

        {/* Affected incidents overlay */}
        {sel && incidentRows.filter((i) => i.severity === "critical" || i.severity === "high").length > 0 && (
          <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(220,38,38,0.95)", color: "#fff", padding: "8px 16px", borderRadius: 5, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, maxWidth: 400, zIndex: 10 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="1.5"/><line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            NH-39 partially blocked due to landslide near Mao Gate — delay expected
          </div>
        )}
      </div>

      {/* Route description panel */}
      {sel && (
        <div style={{ width: 280, background: "#fff", borderLeft: "1px solid #e4e7ec", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #f0f2f5" }}>
            <div style={{ fontWeight: 700, fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#111827" }}>Route Details</div>
          </div>
          <div style={{ padding: "14px", overflowY: "auto", flex: 1 }}>
            <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6, marginBottom: 14 }}>{sel.description}</div>

            <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Conditions</div>
            {[
              { label: "Weather", val: "Moderate rain expected", icon: "🌧", color: "#f59e0b" },
              { label: "Road Surface", val: sel.condition === "good" ? "Well maintained" : sel.condition === "fair" ? "Minor damage in sections" : "Heavy damage reported", icon: "🛣", color: sel.condition === "poor" ? "#dc2626" : "#374151" },
              { label: "Active Disruptions", val: `${sel.incidents} on this route`, icon: "⚠", color: sel.incidents > 0 ? "#dc2626" : "#10b981" },
              { label: "Last Verified", val: "14:09 IST Today", icon: "✓", color: "#10b981" },
            ].map(({ label, val, icon, color }) => (
              <div key={label} style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: 12 }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                <div>
                  <div style={{ color: "#9ca3af", fontSize: 10.5, fontWeight: 600 }}>{label}</div>
                  <div style={{ color, fontWeight: 500 }}>{val}</div>
                </div>
              </div>
            ))}

            <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, marginTop: 6 }}>Via Waypoints</div>
            {(sel.name.includes("NH-37") ? ["Guwahati", "Kaziranga", "Jorhat", "Dimapur", "Kohima", "Imphal"] :
              sel.name.includes("Jiribam") ? ["Guwahati", "Silchar", "Jiribam", "Imphal"] :
              ["Guwahati", "Shillong", "Silchar", "Imphal"]).map((wp, i) => (
              <div key={wp} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: i === 0 || i > 4 ? "#1a56db" : "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: i === 0 || i > 4 ? "#fff" : "#6b7280", flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontSize: 12, color: "#374151" }}>{wp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

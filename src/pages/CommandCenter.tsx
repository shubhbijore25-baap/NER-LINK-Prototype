import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import KPICard from "../components/KPICard";
import StatusBadge from "../components/StatusBadge";
import NEIndiaMap from "../components/NEIndiaMap";
import { api, type DashboardSummary } from "../api";
import type { Alert, Incident, Vehicle } from "../data/mockData";

interface CommandCenterProps {
  onNavigate: (page: string) => void;
}

function timeAgo(ts: string) {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000 / 60;
  if (diff < 1) return "Just now";
  if (diff < 60) return `${Math.round(diff)}m ago`;
  return `${Math.round(diff / 60)}h ago`;
}

export default function CommandCenter({ onNavigate }: CommandCenterProps) {
  const [summary, setSummary] = useState<DashboardSummary>({ activeVehicles: 0, activeDeliveries: 0, blockedRoads: 0, criticalIncidents: 0, highRiskRoutes: 0, totalVehicles: 0, onTimeDeliveries: 0, avgDelay: 0, vehicleStatusCounts: {}, deliveryTrendData: [], incidentsByType: [], unreadAlerts: 0 });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    api.dashboard().then(setSummary).catch((error) => console.error("Could not load dashboard summary", error));
    api.alerts().then(setAlerts).catch((error) => console.error("Could not load dashboard alerts", error));
    api.incidents().then(setIncidents).catch((error) => console.error("Could not load dashboard incidents", error));
    api.vehicles().then(setVehicles).catch((error) => console.error("Could not load dashboard vehicles", error));
  }, []);

  const criticalAlerts = alerts.filter((a) => a.severity === "critical" || a.severity === "high").slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%", overflowY: "auto" }}>
      <div style={{ padding: "20px 24px 0" }}>
        {/* Sub-header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>
              <span style={{ color: "#10b981" }}>●</span> Live operational data · Auto-refreshing every 30s
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => onNavigate("liveGIS")}
              style={{ padding: "6px 14px", background: "#1a56db", color: "#fff", border: "none", borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 3C12 3 8 8 8 12s4 9 4 9M12 3c0 0 4 5 4 9s-4 9-4 9M3 12h18" stroke="currentColor" strokeWidth="1.6"/></svg>
              View Live GIS
            </button>
            <button style={{ padding: "6px 14px", background: "#fff", color: "#374151", border: "1px solid #e4e7ec", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
              Export Report
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
          <KPICard
            label="Active Vehicles"
            value={summary.activeVehicles}
            sub={`of ${summary.totalVehicles} total`}
            icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8"/><circle cx="7" cy="17" r="1.5" fill="currentColor"/><circle cx="17" cy="17" r="1.5" fill="currentColor"/></svg>}
            accent="blue"
            trend={{ value: "+2 since yesterday", positive: true }}
            onClick={() => onNavigate("vehicleTracking")}
          />
          <KPICard
            label="Active Deliveries"
            value={summary.activeDeliveries}
            sub={`${summary.onTimeDeliveries}% on-time`}
            icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>}
            accent="green"
            trend={{ value: "78% on-time rate", positive: true }}
            onClick={() => onNavigate("vehicleTracking")}
          />
          <KPICard
            label="Blocked Roads"
            value={summary.blockedRoads}
            sub="Active road blocks"
            icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
            accent="amber"
            trend={{ value: "+1 since 06:00 IST", positive: false }}
            onClick={() => onNavigate("liveGIS")}
          />
          <KPICard
            label="Critical Incidents"
            value={summary.criticalIncidents}
            sub="Requiring immediate action"
            icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
            accent="red"
            trend={{ value: "2 new today", positive: false }}
            onClick={() => onNavigate("fieldReports")}
          />
          <KPICard
            label="High-Risk Routes"
            value={summary.highRiskRoutes}
            sub="Risk score ≥ 60"
            icon={<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M4 7h16M4 12h10M4 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18 15l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            accent="purple"
            trend={{ value: "NH-39 critical", positive: false }}
            onClick={() => onNavigate("routeIntelligence")}
          />
        </div>
      </div>

      {/* Main content grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, padding: "0 24px 24px", flex: 1 }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          {/* Regional Map */}
          <div style={{ background: "#fff", border: "1px solid #e4e7ec", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0f2f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700, fontFamily: "Manrope, sans-serif", fontSize: 14, color: "#111827" }}>Regional Summary — Northeast India</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>8 states · Live vehicle & incident overlay</div>
              </div>
              <button onClick={() => onNavigate("liveGIS")} style={{ fontSize: 11, color: "#1a56db", background: "none", border: "1px solid #dbeafe", borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>
                Open Full GIS →
              </button>
            </div>
            <div style={{ height: 340 }}>
              <NEIndiaMap vehicles={vehicles} incidents={incidents} showVehicles showIncidents compact={false} />
            </div>
          </div>

          {/* Charts row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 16 }}>
            {/* Delivery trend chart */}
            <div style={{ background: "#fff", border: "1px solid #e4e7ec", borderRadius: 6, padding: "14px 16px" }}>
              <div style={{ fontWeight: 700, fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#111827", marginBottom: 12 }}>Delivery Status — Last 7 Days</div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={summary.deliveryTrendData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" vertical={false}/>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 5, border: "1px solid #e4e7ec" }}/>
                  <Bar dataKey="onTime" name="On Time" fill="#10b981" radius={[2, 2, 0, 0]}/>
                  <Bar dataKey="delayed" name="Delayed" fill="#f59e0b" radius={[2, 2, 0, 0]}/>
                  <Bar dataKey="blocked" name="Blocked" fill="#ef4444" radius={[2, 2, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Incident type pie */}
            <div style={{ background: "#fff", border: "1px solid #e4e7ec", borderRadius: 6, padding: "14px 16px" }}>
              <div style={{ fontWeight: 700, fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#111827", marginBottom: 8 }}>Incidents by Type</div>
              <ResponsiveContainer width="100%" height={100}>
                <PieChart>
                  <Pie data={summary.incidentsByType} dataKey="count" cx="50%" cy="50%" outerRadius={44} innerRadius={20}>
                    {summary.incidentsByType.map((entry, i) => <Cell key={i} fill={entry.fill}/>)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 4, border: "1px solid #e4e7ec" }}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 6 }}>
                {summary.incidentsByType.map((item) => (
                  <div key={item.type} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, color: "#6b7280", marginBottom: 3 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: item.fill, flexShrink: 0 }}/>
                    {item.type} <span style={{ marginLeft: "auto", fontWeight: 600, color: "#374151" }}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Critical Alerts */}
          <div style={{ background: "#fff", border: "1px solid #e4e7ec", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid #f0f2f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#111827", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#dc2626" }} />
                Critical Alerts
              </div>
              <span style={{ fontSize: 10, background: "#fef2f2", color: "#dc2626", padding: "1px 6px", borderRadius: 8, fontWeight: 700 }}>{criticalAlerts.filter((a) => !a.read).length} new</span>
            </div>
            <div>
              {criticalAlerts.map((a) => (
                <div key={a.id} style={{ padding: "10px 14px", borderBottom: "1px solid #f9fafb", borderLeft: `3px solid ${a.severity === "critical" ? "#dc2626" : "#f97316"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: "#1f2937", lineHeight: 1.4, flex: 1 }}>{a.title}</div>
                    {!a.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1a56db", flexShrink: 0, marginTop: 3, marginLeft: 4 }}/>}
                  </div>
                  <div style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 2 }}>{timeAgo(a.timestamp)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Incidents */}
          <div style={{ background: "#fff", border: "1px solid #e4e7ec", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid #f0f2f5", fontWeight: 700, fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#111827" }}>
              Recent Incidents
            </div>
            <div>
              {incidents.slice(0, 5).map((inc) => (
                <div key={inc.id} style={{ padding: "10px 14px", borderBottom: "1px solid #f9fafb", display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: inc.severity === "critical" ? "#dc2626" : inc.severity === "high" ? "#f97316" : "#f59e0b", marginTop: 4, flexShrink: 0 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: "#1f2937", lineHeight: 1.3 }}>{inc.title}</div>
                    <div style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 2 }}>{inc.district}, {inc.state}</div>
                  </div>
                  <StatusBadge status={inc.severity} />
                </div>
              ))}
              <div style={{ padding: "8px 14px" }}>
                <button onClick={() => onNavigate("fieldReports")} style={{ fontSize: 11, color: "#1a56db", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>View all reports →</button>
              </div>
            </div>
          </div>

          {/* Vehicle Status Summary */}
          <div style={{ background: "#fff", border: "1px solid #e4e7ec", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontWeight: 700, fontFamily: "Manrope, sans-serif", fontSize: 13, color: "#111827", marginBottom: 10 }}>Vehicle Status</div>
            {[
              { label: "En Route", count: vehicles.filter((v) => v.status === "en_route").length, color: "#1a56db" },
              { label: "Delayed", count: vehicles.filter((v) => v.status === "delayed").length, color: "#f97316" },
              { label: "Stopped", count: vehicles.filter((v) => v.status === "stopped").length, color: "#dc2626" },
              { label: "Delivered", count: vehicles.filter((v) => v.status === "delivered").length, color: "#10b981" },
              { label: "Maintenance", count: vehicles.filter((v) => v.status === "maintenance").length, color: "#8b5cf6" },
            ].map(({ label, count, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }}/>
                <span style={{ fontSize: 12, color: "#374151", flex: 1 }}>{label}</span>
                <div style={{ flex: 2, height: 5, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${(count / vehicles.length) * 100}%`, height: "100%", background: color, borderRadius: 3 }}/>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", width: 16, textAlign: "right" }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

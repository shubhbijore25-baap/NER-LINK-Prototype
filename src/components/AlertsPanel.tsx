import { useEffect, useState } from "react";
import { type Alert, type Severity } from "../data/mockData";
import { api } from "../api";

interface AlertsPanelProps {
  open: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

const severityConfig: Record<Severity, { label: string; bg: string; text: string; border: string }> = {
  critical: { label: "Critical", bg: "#fef2f2", text: "#b91c1c", border: "#fca5a5" },
  high:     { label: "High",     bg: "#fff7ed", text: "#c2410c", border: "#fdba74" },
  medium:   { label: "Medium",   bg: "#fffbeb", text: "#92400e", border: "#fcd34d" },
  low:      { label: "Low",      bg: "#eff6ff", text: "#1d4ed8", border: "#93c5fd" },
};

function timeAgo(ts: string) {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000 / 60;
  if (diff < 1) return "Just now";
  if (diff < 60) return `${Math.round(diff)}m ago`;
  return `${Math.round(diff / 60)}h ago`;
}

export default function AlertsPanel({ open, onClose }: AlertsPanelProps) {
  const [filter, setFilter] = useState<Severity | "all">("all");
  const [localAlerts, setLocalAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (!open) return;
    api.alerts().then(setLocalAlerts).catch((error) => console.error("Could not load alerts", error));
  }, [open]);

  const filtered = filter === "all" ? localAlerts : localAlerts.filter((a) => a.severity === filter);
  const unread = localAlerts.filter((a) => !a.read).length;

  const markAllRead = async () => {
    const unreadAlerts = localAlerts.filter((alert) => !alert.read);
    const updates = await Promise.allSettled(unreadAlerts.map((alert) => api.updateAlert(alert.id, true)));
    const updated = new Map<string, Alert>();
    updates.forEach((result) => { if (result.status === "fulfilled") updated.set(result.value.id, result.value); });
    setLocalAlerts((prev) => prev.map((alert) => updated.get(alert.id) ?? alert));
  };
  const markRead = async (id: string) => {
    try {
      const updated = await api.updateAlert(id, true);
      setLocalAlerts((prev) => prev.map((alert) => alert.id === id ? updated : alert));
    } catch (error) {
      console.error("Could not mark alert as read", error);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 49 }} />
      {/* Panel */}
      <div className="fade-in" style={{ position: "fixed", top: 56, right: 0, width: 420, height: "calc(100vh - 56px)", background: "#fff", borderLeft: "1px solid #e4e7ec", zIndex: 50, display: "flex", flexDirection: "column", boxShadow: "-4px 0 24px rgba(0,0,0,0.10)" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e4e7ec", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 700, fontFamily: "Manrope, sans-serif", fontSize: 15, color: "#111827" }}>
              Alerts & Notifications
              {unread > 0 && <span style={{ marginLeft: 8, background: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10 }}>{unread}</span>}
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{localAlerts.length} alerts · {unread} unread</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={markAllRead} style={{ fontSize: 11, color: "#1a56db", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>Mark all read</button>
            <button onClick={onClose} style={{ width: 28, height: 28, background: "#f3f4f6", border: "none", borderRadius: 5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 0, padding: "8px 16px", borderBottom: "1px solid #f0f2f5" }}>
          {(["all", "critical", "high", "medium", "low"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 600,
                border: "none",
                background: filter === f ? (f === "all" ? "#1a56db" : severityConfig[f]?.bg ?? "#e5e7eb") : "transparent",
                color: filter === f ? (f === "all" ? "#fff" : severityConfig[f]?.text ?? "#374151") : "#6b7280",
                borderRadius: 4,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                transition: "all 120ms",
              }}
            >
              {f === "all" ? `All (${localAlerts.length})` : f}
            </button>
          ))}
        </div>

        {/* Alerts list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {filtered.length === 0 && (
            <div style={{ padding: 32, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No alerts to show</div>
          )}
          {filtered.map((alert) => {
            const cfg = severityConfig[alert.severity];
            return (
              <div
                key={alert.id}
                onClick={() => markRead(alert.id)}
                style={{
                  padding: "12px 20px",
                  borderLeft: `4px solid ${cfg.border}`,
                  marginBottom: 1,
                  background: alert.read ? "#fff" : "#fafbff",
                  cursor: "pointer",
                  transition: "background 120ms",
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = "#f8fafc"}
                onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = alert.read ? "#fff" : "#fafbff"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ background: cfg.bg, color: cfg.text, fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{cfg.label}</span>
                    {!alert.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1a56db", flexShrink: 0, display: "inline-block" }} />}
                  </div>
                  <span style={{ fontSize: 10, color: "#9ca3af", whiteSpace: "nowrap", marginLeft: 8 }}>{timeAgo(alert.timestamp)}</span>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1f2937", marginBottom: 3, lineHeight: 1.4 }}>{alert.title}</div>
                <div style={{ fontSize: 11.5, color: "#6b7280", lineHeight: 1.5 }}>{alert.message}</div>
                {alert.entityType !== "system" && (
                  <div style={{ marginTop: 6, fontSize: 10.5, color: "#1a56db", fontWeight: 500 }}>
                    {alert.entityId ? `View ${alert.entityType} ${alert.entityId} →` : `View ${alert.entityType} →`}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: "10px 20px", borderTop: "1px solid #e4e7ec", fontSize: 11, color: "#9ca3af", textAlign: "center" }}>
          Auto-refreshing every 30 seconds · Last update 14:09:32 IST
        </div>
      </div>
    </>
  );
}

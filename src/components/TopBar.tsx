import { useEffect, useState } from "react";
import { api } from "../api";

interface TopBarProps {
  title: string;
  subtitle?: string;
  onAlertsClick: () => void;
}

export default function TopBar({ title, subtitle, onAlertsClick }: TopBarProps) {
  const [search, setSearch] = useState("");
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api.alerts().then((rows) => setUnread(rows.filter((alert) => !alert.read).length)).catch((error) => console.error("Could not load unread alert count", error));
  }, []);

  return (
    <header style={{ height: 56, background: "#fff", borderBottom: "1px solid #e4e7ec", display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0, zIndex: 30 }}>
      {/* Title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <h1 style={{ fontSize: 15, fontWeight: 700, fontFamily: "Manrope, sans-serif", color: "#111827", margin: 0, whiteSpace: "nowrap" }}>{title}</h1>
          {subtitle && <span style={{ fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>{subtitle}</span>}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative", width: 260 }}>
        <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vehicles, routes, incidents…"
          style={{ width: "100%", padding: "7px 12px 7px 30px", fontSize: 13, border: "1px solid #e4e7ec", borderRadius: 5, outline: "none", background: "#f9fafb", color: "#374151", fontFamily: "Inter, sans-serif" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#1a56db"; e.currentTarget.style.background = "#fff"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e7ec"; e.currentTarget.style.background = "#f9fafb"; }}
        />
      </div>

      {/* Current time */}
      <div style={{ fontSize: 11, color: "#6b7280", fontFamily: "JetBrains Mono, monospace", whiteSpace: "nowrap" }}>
        30 Aug 2026 · 14:12 IST
      </div>

      {/* Alerts bell */}
      <button
        onClick={onAlertsClick}
        style={{ position: "relative", width: 36, height: 36, background: "none", border: "1px solid #e4e7ec", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", transition: "border-color 120ms, color 120ms" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1a56db"; (e.currentTarget as HTMLButtonElement).style.color = "#1a56db"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e4e7ec"; (e.currentTarget as HTMLButtonElement).style.color = "#6b7280"; }}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        {unread > 0 && (
          <span style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, background: "#dc2626", borderRadius: "50%", fontSize: 9, color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
            {unread}
          </span>
        )}
      </button>

      {/* User profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "4px 8px", borderRadius: 6, transition: "background 120ms" }}
        onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = "#f3f4f6"}
        onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
      >
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#1a2f55", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#a3c4f3", fontWeight: 700, fontFamily: "Manrope, sans-serif" }}>AK</div>
        <div style={{ lineHeight: 1.3 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>A. Kumar</div>
          <div style={{ fontSize: 10, color: "#9ca3af" }}>Ops Controller</div>
        </div>
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </header>
  );
}

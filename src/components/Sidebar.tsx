import type React from "react";

type Page = "commandCenter" | "liveGIS" | "routeIntelligence" | "vehicleTracking" | "fieldReports";

interface SidebarProps {
  current: Page;
  onNavigate: (page: Page) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: { id: Page; label: string; icon?: string }[] = [
  { id: "commandCenter", label: "Command Center", icon: "⬡" },
  { id: "liveGIS", label: "Live GIS", icon: "⊕" },
  { id: "routeIntelligence", label: "Route Intelligence", icon: "⇌" },
  { id: "vehicleTracking", label: "Vehicle & Delivery", icon: "◉" },
  { id: "fieldReports", label: "Field Reports", icon: "⊞" },
];

const iconSVGs: Record<string, React.ReactElement> = {
  commandCenter: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8"/></svg>
  ),
  liveGIS: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 3C12 3 8 8 8 12s4 9 4 9M12 3c0 0 4 5 4 9s-4 9-4 9M3 12h18M3.6 8h16.8M3.6 16h16.8" stroke="currentColor" strokeWidth="1.4"/></svg>
  ),
  routeIntelligence: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M4 7h16M4 12h10M4 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18 15l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  vehicleTracking: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8"/><circle cx="7" cy="17" r="1.5" fill="currentColor"/><circle cx="17" cy="17" r="1.5" fill="currentColor"/></svg>
  ),
  fieldReports: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8"/><line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="8" y1="17" x2="12" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
  ),
};

export default function Sidebar({ current, onNavigate, collapsed, onToggle }: SidebarProps) {
  const w = collapsed ? 64 : 230;
  return (
    <aside style={{
      width: w,
      minWidth: w,
      background: "#0d1526",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid #1a2744",
      transition: "width 220ms cubic-bezier(0.4,0,0.2,1), min-width 220ms cubic-bezier(0.4,0,0.2,1)",
      overflow: "hidden",
      zIndex: 40,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "16px 0", borderBottom: "1px solid #1a2744", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", paddingLeft: collapsed ? 0 : 18, gap: 10, minHeight: 64 }}>
        <div style={{ width: 32, height: 32, background: "#1a56db", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8"/><path d="M12 3C12 3 8 8 8 12s4 9 4 9M12 3c0 0 4 5 4 9s-4 9-4 9M3 12h18" stroke="white" strokeWidth="1.4"/></svg>
        </div>
        {!collapsed && (
          <div>
            <div style={{ color: "#ffffff", fontSize: 13, fontWeight: 700, fontFamily: "Manrope, sans-serif", lineHeight: 1.2, letterSpacing: "-0.01em" }}>NELI Platform</div>
            <div style={{ color: "#4b6cb7", fontSize: 9.5, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>NE India Logistics Intel</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 0", overflowY: "auto", overflowX: "hidden" }}>
        {!collapsed && <div style={{ padding: "10px 18px 6px", fontSize: 9, fontWeight: 700, color: "#334d7a", letterSpacing: "0.1em", textTransform: "uppercase" }}>Operations</div>}
        {navItems.map((item) => {
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                width: "100%",
                padding: collapsed ? "11px 0" : "10px 18px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: active ? "#1a2f55" : "transparent",
                borderLeft: active ? "3px solid #1a56db" : "3px solid transparent",
                color: active ? "#ffffff" : "#7d94bb",
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                border: "none",
                borderRadius: 0,
                textAlign: "left",
                transition: "background 120ms, color 120ms",
                whiteSpace: "nowrap",
                overflow: "hidden",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "#121f3a"; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <span style={{ color: active ? "#6ba3ff" : "#556d95", flexShrink: 0 }}>{iconSVGs[item.id]}</span>
              {!collapsed && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom info */}
      {!collapsed && (
        <div style={{ padding: "12px 18px", borderTop: "1px solid #1a2744" }}>
          <div style={{ fontSize: 10, color: "#334d7a", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>System Status</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#4b6cb7" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
            All systems operational
          </div>
          <div style={{ fontSize: 10, color: "#334d7a", marginTop: 3 }}>Last sync: 14:09:32 IST</div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        style={{
          padding: "12px 0",
          background: "transparent",
          border: "none",
          borderTop: "1px solid #1a2744",
          color: "#4b6cb7",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          transition: "color 120ms",
        }}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ) : (
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </button>
    </aside>
  );
}

import type { ReactNode } from "react";

interface KPICardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  accent: "blue" | "green" | "amber" | "red" | "purple";
  trend?: { value: string; positive: boolean };
  onClick?: () => void;
}

const accentMap = {
  blue:   { bg: "#eff6ff", icon: "#1a56db", bar: "#1a56db" },
  green:  { bg: "#ecfdf5", icon: "#057a55", bar: "#10b981" },
  amber:  { bg: "#fffbeb", icon: "#b45309", bar: "#f59e0b" },
  red:    { bg: "#fef2f2", icon: "#dc2626", bar: "#dc2626" },
  purple: { bg: "#f5f3ff", icon: "#7c3aed", bar: "#8b5cf6" },
};

export default function KPICard({ label, value, sub, icon, accent, trend, onClick }: KPICardProps) {
  const a = accentMap[accent];
  return (
    <div
      className="kpi-card"
      onClick={onClick}
      style={{
        background: "#fff",
        border: "1px solid #e4e7ec",
        borderRadius: 6,
        padding: "18px 20px",
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: a.bar, borderRadius: "6px 6px 0 0" }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 30, fontWeight: 700, fontFamily: "Manrope, sans-serif", color: "#111827", lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{sub}</div>}
          {trend && (
            <div style={{ fontSize: 11, color: trend.positive ? "#057a55" : "#dc2626", marginTop: 6, fontWeight: 500 }}>
              {trend.positive ? "▲" : "▼"} {trend.value}
            </div>
          )}
        </div>
        <div style={{ width: 38, height: 38, background: a.bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: a.icon, flexShrink: 0 }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

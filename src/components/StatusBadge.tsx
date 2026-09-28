import type { Severity, VehicleStatus } from "../data/mockData";

interface StatusBadgeProps {
  status: Severity | VehicleStatus | string;
  size?: "sm" | "md";
}

const configs: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  critical: { label: "Critical", bg: "#fef2f2", text: "#b91c1c", dot: "#dc2626" },
  high:     { label: "High",     bg: "#fff7ed", text: "#c2410c", dot: "#f97316" },
  medium:   { label: "Medium",   bg: "#fffbeb", text: "#92400e", dot: "#f59e0b" },
  low:      { label: "Low",      bg: "#f0fdf4", text: "#166534", dot: "#22c55e" },
  en_route: { label: "En Route", bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6" },
  delayed:  { label: "Delayed",  bg: "#fff7ed", text: "#c2410c", dot: "#f97316" },
  stopped:  { label: "Stopped",  bg: "#fef2f2", text: "#b91c1c", dot: "#dc2626" },
  delivered: { label: "Delivered", bg: "#f0fdf4", text: "#166534", dot: "#22c55e" },
  maintenance: { label: "Maintenance", bg: "#f5f3ff", text: "#6d28d9", dot: "#8b5cf6" },
  active:   { label: "Active",   bg: "#fef2f2", text: "#b91c1c", dot: "#dc2626" },
  monitoring: { label: "Monitoring", bg: "#fffbeb", text: "#92400e", dot: "#f59e0b" },
  resolved: { label: "Resolved", bg: "#f0fdf4", text: "#166534", dot: "#22c55e" },
  open:     { label: "Open",     bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6" },
  acknowledged: { label: "Acknowledged", bg: "#f5f3ff", text: "#6d28d9", dot: "#8b5cf6" },
  under_review: { label: "Under Review", bg: "#fffbeb", text: "#92400e", dot: "#f59e0b" },
  good:     { label: "Good",     bg: "#f0fdf4", text: "#166534", dot: "#22c55e" },
  fair:     { label: "Fair",     bg: "#fffbeb", text: "#92400e", dot: "#f59e0b" },
  poor:     { label: "Poor",     bg: "#fff7ed", text: "#c2410c", dot: "#f97316" },
  blocked:  { label: "Blocked",  bg: "#fef2f2", text: "#b91c1c", dot: "#dc2626" },
  recommended: { label: "Recommended", bg: "#f0fdf4", text: "#166534", dot: "#22c55e" },
  alternative: { label: "Alternative", bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6" },
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const cfg = configs[status] ?? { label: status, bg: "#f3f4f6", text: "#374151", dot: "#9ca3af" };
  const pad = size === "md" ? "3px 10px" : "2px 7px";
  const fs = size === "md" ? "12px" : "10.5px";
  return (
    <span style={{ background: cfg.bg, color: cfg.text, padding: pad, fontSize: fs, borderRadius: 3, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "Inter, sans-serif" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

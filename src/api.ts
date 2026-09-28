import type { Alert, Incident, Route, Vehicle } from "./data/mockData";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");

export interface FieldReport {
  id: string;
  type: string;
  location: string;
  district: string;
  state: string;
  severity: "critical" | "high" | "medium" | "low";
  submittedBy: string;
  submittedAt: string;
  description: string;
  hasImage: boolean;
  imageUrl: string | null;
  lat: number | null;
  lng: number | null;
  status: string;
}

export interface DashboardSummary {
  activeVehicles: number;
  activeDeliveries: number;
  blockedRoads: number;
  criticalIncidents: number;
  highRiskRoutes: number;
  totalVehicles: number;
  onTimeDeliveries: number;
  avgDelay: number;
  vehicleStatusCounts: Record<string, number>;
  deliveryTrendData: { day: string; onTime: number; delayed: number; blocked: number }[];
  incidentsByType: { type: string; count: number; fill: string }[];
  unreadAlerts: number;
}

export type FieldReportCreatePayload = Pick<FieldReport, "type" | "location" | "district" | "state" | "severity" | "description"> & {
  submittedBy?: string;
  imageUrl?: string | null;
  lat?: number | null;
  lng?: number | null;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || `API request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  dashboard: () => request<DashboardSummary>("/dashboard/summary"),
  vehicles: () => request<Vehicle[]>("/vehicles"),
  incidents: () => request<Incident[]>("/incidents"),
  alerts: () => request<Alert[]>("/alerts"),
  updateAlert: (id: string, read: boolean) =>
    request<Alert>(`/alerts/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ read }) }),
  fieldReports: (severity = "all") => request<FieldReport[]>(`/field-reports?severity=${encodeURIComponent(severity)}`),
  createFieldReport: (payload: FieldReportCreatePayload) =>
    request<FieldReport>("/field-reports", { method: "POST", body: JSON.stringify(payload) }),
  updateFieldReportStatus: (id: string, status: string) =>
    request<FieldReport>(`/field-reports/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  analyseRoutes: (origin: string, destination: string, vehicleType: string) =>
    request<Route[]>("/routes/analyse", { method: "POST", body: JSON.stringify({ origin, destination, vehicleType }) }),
};

export function reportToApiPayload(report: { type: string; location: string; district: string; state: string; severity: string; description: string }) {
  return {
    type: report.type,
    location: report.location,
    district: report.district,
    state: report.state,
    severity: report.severity.toLowerCase() as FieldReport["severity"],
    description: report.description,
    submittedBy: "Field Unit",
  };
}

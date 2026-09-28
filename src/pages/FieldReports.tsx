import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { type Severity } from "../data/mockData";
import { api, reportToApiPayload, type FieldReport } from "../api";

const INCIDENT_TYPES = ["Landslide", "Flood", "Road Block", "Accident", "Infrastructure", "Conflict", "Other"];
const STATES_NE = ["Assam", "Arunachal Pradesh", "Nagaland", "Manipur", "Meghalaya", "Mizoram", "Tripura", "Sikkim"];

interface FormState {
  type: string;
  location: string;
  district: string;
  state: string;
  severity: Severity;
  description: string;
  imageFile: string;
  submitted: boolean;
  submitting: boolean;
}

export default function FieldReports() {
  const [reports, setReports] = useState<FieldReport[]>([]);
  const [activeTab, setActiveTab] = useState<"list" | "submit">("list");
  const [selectedReport, setSelectedReport] = useState<FieldReport | null>(null);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [form, setForm] = useState<FormState>({
    type: "Landslide",
    location: "",
    district: "",
    state: "Assam",
    severity: "medium",
    description: "",
    imageFile: "",
    submitted: false,
    submitting: false,
  });

  const filtered = filterSeverity === "all" ? reports : reports.filter((r) => r.severity === filterSeverity);

  useEffect(() => {
    api.fieldReports().then((rows) => setReports(rows)).catch((error) => console.error("Could not load field reports", error));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForm((f) => ({ ...f, submitting: true }));
    api.createFieldReport(reportToApiPayload(form)).then((created) => {
      setReports((rows) => [created, ...rows]);
      setSelectedReport(created);
      setForm((f) => ({ ...f, submitting: false, submitted: true }));
    }).catch((error) => {
      console.error("Could not submit field report", error);
      setForm((f) => ({ ...f, submitting: false }));
      window.alert("The report could not be submitted. Check that the backend is running and try again.");
    });
  };

  const advanceReportStatus = () => {
    if (!selectedReport) return;
    const nextStatus: Record<string, string> = { open: "under_review", under_review: "acknowledged", acknowledged: "resolved", resolved: "under_review" };
    api.updateFieldReportStatus(selectedReport.id, nextStatus[selectedReport.status] || "under_review").then((updated) => {
      setSelectedReport(updated);
      setReports((rows) => rows.map((row) => row.id === updated.id ? updated : row));
    }).catch((error) => {
      console.error("Could not update report status", error);
      window.alert("The report status could not be updated. Check that the backend is running and try again.");
    });
  };

  const severityBars: Record<Severity, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  reports.forEach((r) => severityBars[r.severity]++);

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Left sidebar */}
      <div style={{ width: 320, background: "#fff", borderRight: "1px solid #e4e7ec", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #e4e7ec" }}>
          {(["list", "submit"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: "11px 0", fontSize: 12.5, fontWeight: 600, border: "none", background: "none", borderBottom: `2px solid ${activeTab === t ? "#1a56db" : "transparent"}`, color: activeTab === t ? "#1a56db" : "#6b7280", cursor: "pointer" }}>
              {t === "list" ? `Reports (${reports.length})` : "Submit New"}
            </button>
          ))}
        </div>

        {activeTab === "list" && (
          <>
            {/* Stats row */}
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f0f2f5", display: "flex", gap: 12 }}>
              {(["critical", "high", "medium", "low"] as Severity[]).map((s) => (
                <div key={s} style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "Manrope, sans-serif", color: s === "critical" ? "#dc2626" : s === "high" ? "#f97316" : s === "medium" ? "#f59e0b" : "#10b981" }}>{severityBars[s]}</div>
                  <div style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>{s}</div>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div style={{ padding: "8px 14px", borderBottom: "1px solid #f0f2f5", display: "flex", gap: 4 }}>
              {["all", "critical", "high", "medium", "low"].map((s) => (
                <button key={s} onClick={() => setFilterSeverity(s)} style={{ padding: "2px 7px", fontSize: 10, fontWeight: 600, border: "1px solid", borderColor: filterSeverity === s ? "#1a56db" : "#e4e7ec", borderRadius: 3, background: filterSeverity === s ? "#eff6ff" : "#fff", color: filterSeverity === s ? "#1a56db" : "#6b7280", cursor: "pointer", textTransform: "capitalize", letterSpacing: "0.03em" }}>
                  {s}
                </button>
              ))}
            </div>

            {/* Reports list */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filtered.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  style={{
                    padding: "11px 14px",
                    borderBottom: "1px solid #f9fafb",
                    cursor: "pointer",
                    background: selectedReport?.id === r.id ? "#eff6ff" : "#fff",
                    borderLeft: `3px solid ${selectedReport?.id === r.id ? "#1a56db" : "transparent"}`,
                  }}
                  onMouseEnter={(e) => { if (selectedReport?.id !== r.id) (e.currentTarget as HTMLDivElement).style.background = "#f9fafb"; }}
                  onMouseLeave={(e) => { if (selectedReport?.id !== r.id) (e.currentTarget as HTMLDivElement).style.background = "#fff"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#6b7280" }}>{r.id}</span>
                    <StatusBadge status={r.severity}/>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1f2937", marginBottom: 3, lineHeight: 1.3 }}>{r.type} — {r.location}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{r.district}, {r.state}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 5, alignItems: "center" }}>
                    <StatusBadge status={r.status}/>
                    <span style={{ fontSize: 10, color: "#9ca3af" }}>{new Date(r.submittedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
                    {r.hasImage && <span style={{ fontSize: 10, color: "#6b7280" }}>📎 Image</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "submit" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>
            {form.submitted ? (
              <div className="fade-in" style={{ textAlign: "center", padding: "32px 16px" }}>
                <div style={{ width: 48, height: 48, background: "#ecfdf5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "Manrope, sans-serif", color: "#111827", marginBottom: 6 }}>Report Submitted</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>Your field report has been received and is under review by the operations team.</div>
                <button onClick={() => setForm((f) => ({ ...f, submitted: false, location: "", description: "", district: "" }))} style={{ padding: "7px 16px", background: "#1a56db", color: "#fff", border: "none", borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <FormField label="Incident Type" required>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} style={selectStyle}>
                    {INCIDENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </FormField>

                <FormField label="Location" required>
                  <input required value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="e.g. NH-39, Mao Gate section" style={inputStyle}/>
                </FormField>

                <FormField label="District">
                  <input value={form.district} onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))} placeholder="e.g. Senapati" style={inputStyle}/>
                </FormField>

                <FormField label="State" required>
                  <select value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} style={selectStyle}>
                    {STATES_NE.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </FormField>

                <FormField label="Severity" required>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["low", "medium", "high", "critical"] as Severity[]).map((s) => (
                      <button type="button" key={s} onClick={() => setForm((f) => ({ ...f, severity: s }))} style={{ flex: 1, padding: "5px 0", fontSize: 10.5, border: "1px solid", borderColor: form.severity === s ? (s === "critical" ? "#dc2626" : s === "high" ? "#f97316" : s === "medium" ? "#f59e0b" : "#10b981") : "#e4e7ec", borderRadius: 4, background: form.severity === s ? (s === "critical" ? "#fef2f2" : s === "high" ? "#fff7ed" : s === "medium" ? "#fffbeb" : "#f0fdf4") : "#fff", color: form.severity === s ? (s === "critical" ? "#dc2626" : s === "high" ? "#f97316" : s === "medium" ? "#f59e0b" : "#10b981") : "#9ca3af", cursor: "pointer", fontWeight: 600, textTransform: "capitalize" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </FormField>

                <FormField label="Description" required>
                  <textarea
                    required
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the incident, road conditions, affected vehicles, and any immediate actions taken…"
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" } as React.CSSProperties}
                  />
                </FormField>

                <FormField label="Image Upload">
                  <div style={{ border: "1.5px dashed #d1d5db", borderRadius: 5, padding: "16px", textAlign: "center", background: "#f9fafb", cursor: "pointer" }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ margin: "0 auto 6px", color: "#9ca3af", display: "block" }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>Click to upload or drag & drop</div>
                    <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>JPG, PNG, HEIC up to 10MB</div>
                  </div>
                </FormField>

                <div style={{ fontSize: 10.5, color: "#9ca3af", marginBottom: 12 }}>
                  Date & Time: <strong style={{ color: "#374151" }}>30 Aug 2026, 14:12 IST</strong> (auto-captured)
                </div>

                <button type="submit" disabled={form.submitting} style={{ width: "100%", padding: "9px", background: form.submitting ? "#6b7280" : "#1a56db", color: "#fff", border: "none", borderRadius: 5, fontSize: 13, fontWeight: 700, cursor: form.submitting ? "default" : "pointer", fontFamily: "Manrope, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {form.submitting ? (
                    <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }}/>Submitting…</>
                  ) : "Submit Field Report"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Report detail */}
      <div style={{ flex: 1, background: "#f0f2f5", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {selectedReport ? (
          <div className="fade-in" style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {/* Header */}
            <div style={{ background: "#fff", border: "1px solid #e4e7ec", borderRadius: 6, padding: "16px 20px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#9ca3af" }}>{selectedReport.id}</span>
                  <StatusBadge status={selectedReport.severity} size="md"/>
                  <StatusBadge status={selectedReport.status} size="md"/>
                </div>
                <h2 style={{ fontSize: 17, fontWeight: 800, fontFamily: "Manrope, sans-serif", color: "#111827", margin: 0, lineHeight: 1.3 }}>
                  {selectedReport.type} — {selectedReport.location}
                </h2>
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{selectedReport.district}, {selectedReport.state}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ padding: "6px 12px", fontSize: 11.5, background: "#fff", color: "#374151", border: "1px solid #e4e7ec", borderRadius: 5, cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 3C12 3 8 8 8 12s4 9 4 9M12 3c0 0 4 5 4 9s-4 9-4 9M3 12h18" stroke="currentColor" strokeWidth="1.6"/></svg>
                  View on Map
                </button>
                <button onClick={advanceReportStatus} style={{ padding: "6px 12px", fontSize: 11.5, background: "#1a56db", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontWeight: 600 }}>
                  Update Status
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
              {/* Main details */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Description */}
                <div style={{ background: "#fff", border: "1px solid #e4e7ec", borderRadius: 6, padding: "14px 16px" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Incident Description</div>
                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{selectedReport.description}</div>
                </div>

                {/* Image placeholder */}
                {selectedReport.hasImage && (
                  <div style={{ background: "#fff", border: "1px solid #e4e7ec", borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ padding: "10px 14px", borderBottom: "1px solid #f0f2f5", fontSize: 10.5, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Field Image</div>
                    <div style={{ height: 180, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ textAlign: "center", color: "#9ca3af" }}>
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" style={{ margin: "0 auto 8px", display: "block" }}><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <div style={{ fontSize: 12 }}>Field image attached</div>
                        <div style={{ fontSize: 10, marginTop: 2 }}>1 photo · Uploaded by {selectedReport.submittedBy}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Meta panel */}
              <div style={{ background: "#fff", border: "1px solid #e4e7ec", borderRadius: 6, padding: "14px 16px", height: "fit-content" }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Report Metadata</div>
                {[
                  { label: "Report ID", val: selectedReport.id },
                  { label: "Type", val: selectedReport.type },
                  { label: "Submitted By", val: selectedReport.submittedBy },
                  { label: "Submitted At", val: new Date(selectedReport.submittedAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) },
                  { label: "Location", val: selectedReport.location },
                  { label: "District", val: selectedReport.district },
                  { label: "State", val: selectedReport.state },
                  { label: "Coordinates", val: `${selectedReport.lat}°N, ${selectedReport.lng}°E` },
                  { label: "Has Attachment", val: selectedReport.hasImage ? "Yes (1 image)" : "No" },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f3f4f6", fontSize: 11.5 }}>
                    <span style={{ color: "#9ca3af", fontWeight: 500 }}>{label}</span>
                    <span style={{ color: "#1f2937", fontWeight: 500, textAlign: "right", maxWidth: "55%", fontSize: 11 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
            <div style={{ textAlign: "center" }}>
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" style={{ margin: "0 auto 10px", display: "block", color: "#d1d5db" }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5"/><line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="17" x2="12" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>Select a report to view details</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Or submit a new field report</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "7px 10px",
  fontSize: 12,
  border: "1px solid #e4e7ec",
  borderRadius: 5,
  outline: "none",
  fontFamily: "Inter, sans-serif",
  color: "#374151",
  background: "#fff",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
};

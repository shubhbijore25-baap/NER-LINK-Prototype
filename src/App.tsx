import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import AlertsPanel from "./components/AlertsPanel";
import CommandCenter from "./pages/CommandCenter";
import LiveGIS from "./pages/LiveGIS";
import RouteIntelligence from "./pages/RouteIntelligence";
import VehicleTracking from "./pages/VehicleTracking";
import FieldReports from "./pages/FieldReports";

type Page = "commandCenter" | "liveGIS" | "routeIntelligence" | "vehicleTracking" | "fieldReports";

const pageTitles: Record<Page, string> = {
  commandCenter: "Command Center",
  liveGIS: "Live GIS",
  routeIntelligence: "Route Intelligence",
  vehicleTracking: "Vehicle & Delivery",
  fieldReports: "Field Reports",
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("commandCenter");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);

  const navigate = (page: string) => {
    if (page in pageTitles) setCurrentPage(page as Page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "liveGIS": return <LiveGIS />;
      case "routeIntelligence": return <RouteIntelligence />;
      case "vehicleTracking": return <VehicleTracking />;
      case "fieldReports": return <FieldReports />;
      default: return <CommandCenter onNavigate={navigate} />;
    }
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", overflow: "hidden", background: "#f5f7fa", fontFamily: "Inter, sans-serif" }}>
      <Sidebar
        current={currentPage}
        onNavigate={setCurrentPage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />
      <div style={{ display: "flex", flex: 1, minWidth: 0, minHeight: 0, flexDirection: "column", overflow: "hidden" }}>
        <TopBar title={pageTitles[currentPage]} onAlertsClick={() => setAlertsOpen(true)} />
        <main style={{ position: "relative", flex: 1, minWidth: 0, minHeight: 0, overflow: "hidden" }}>
          {renderPage()}
        </main>
      </div>
      <AlertsPanel open={alertsOpen} onClose={() => setAlertsOpen(false)} onNavigate={navigate} />
    </div>
  );
}

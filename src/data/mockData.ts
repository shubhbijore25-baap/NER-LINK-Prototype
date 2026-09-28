export type Severity = "critical" | "high" | "medium" | "low";
export type VehicleStatus = "en_route" | "delayed" | "stopped" | "delivered" | "maintenance";
export type IncidentType = "road_block" | "flood" | "landslide" | "accident" | "conflict" | "infrastructure";

export interface Vehicle {
  id: string;
  regNo: string;
  driver: string;
  phone: string;
  type: "truck" | "van" | "ambulance" | "supply_truck";
  status: VehicleStatus;
  from: string;
  to: string;
  currentLocation: string;
  lat: number;
  lng: number;
  cargo: string;
  eta: string;
  delay: number; // minutes
  risk: Severity;
  speed: number; // kmph
  fuel: number; // percent
  progress: number; // percent
  lastUpdate: string;
}

export interface Incident {
  id: string;
  type: IncidentType;
  title: string;
  location: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  severity: Severity;
  reportedAt: string;
  reportedBy: string;
  description: string;
  affectedRoutes: string[];
  status: "active" | "monitoring" | "resolved";
}

export interface Alert {
  id: string;
  severity: Severity;
  title: string;
  message: string;
  timestamp: string;
  entityType: "vehicle" | "route" | "incident" | "system";
  entityId?: string;
  read: boolean;
}

export interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: number;
  eta: number; // minutes
  riskScore: number; // 0-100
  condition: "good" | "fair" | "poor" | "blocked";
  incidents: number;
  type: "recommended" | "alternative" | "blocked";
  delay: number; // minutes
  description: string;
}

// NE India state data for SVG map
export interface NESstate {
  id: string;
  name: string;
  fill: string;
  capital: string;
  capitalLat: number;
  capitalLng: number;
  path: string;
}

export const neStates: NESstate[] = [
  {
    id: "sikkim",
    name: "Sikkim",
    fill: "#dbeafe",
    capital: "Gangtok",
    capitalLat: 27.33,
    capitalLng: 88.61,
    path: "M 28,136 L 70,128 L 107,146 L 101,188 L 62,215 L 28,195 Z",
  },
  {
    id: "arunachal",
    name: "Arunachal Pradesh",
    fill: "#e0f2fe",
    capital: "Itanagar",
    capitalLat: 27.1,
    capitalLng: 93.62,
    path: "M 332,28 L 450,18 L 553,28 L 685,45 L 812,84 L 812,150 L 769,192 L 725,210 L 638,218 L 576,235 L 507,243 L 446,243 L 393,218 L 358,210 L 332,218 Z",
  },
  {
    id: "assam",
    name: "Assam",
    fill: "#dcfce7",
    capital: "Dispur",
    capitalLat: 26.14,
    capitalLng: 91.77,
    path: "M 177,318 L 228,275 L 263,267 L 307,235 L 332,218 L 393,218 L 446,243 L 507,243 L 576,235 L 638,218 L 700,168 L 725,178 L 725,235 L 682,275 L 663,318 L 638,360 L 603,335 L 560,343 L 516,351 L 490,335 L 463,360 L 446,376 L 420,401 L 377,384 L 332,360 L 289,343 L 246,335 L 211,318 Z",
  },
  {
    id: "nagaland",
    name: "Nagaland",
    fill: "#fef9c3",
    capital: "Kohima",
    capitalLat: 25.67,
    capitalLng: 94.11,
    path: "M 490,252 L 576,235 L 638,218 L 663,260 L 663,318 L 638,360 L 603,335 L 560,343 L 516,351 L 490,335 Z",
  },
  {
    id: "manipur",
    name: "Manipur",
    fill: "#fce7f3",
    capital: "Imphal",
    capitalLat: 24.82,
    capitalLng: 93.94,
    path: "M 516,351 L 560,343 L 603,335 L 638,360 L 638,443 L 603,501 L 542,501 L 490,468 L 473,418 L 473,376 L 490,335 Z",
  },
  {
    id: "meghalaya",
    name: "Meghalaya",
    fill: "#fef3c7",
    capital: "Shillong",
    capitalLat: 25.57,
    capitalLng: 91.88,
    path: "M 185,335 L 246,335 L 289,343 L 332,360 L 377,384 L 420,401 L 446,376 L 446,426 L 420,443 L 377,443 L 332,443 L 289,426 L 246,409 L 202,401 L 185,376 Z",
  },
  {
    id: "mizoram",
    name: "Mizoram",
    fill: "#f3e8ff",
    capital: "Aizawl",
    capitalLat: 23.73,
    capitalLng: 92.72,
    path: "M 394,443 L 446,426 L 490,468 L 499,527 L 464,609 L 420,651 L 377,651 L 359,626 L 377,568 L 377,485 Z",
  },
  {
    id: "tripura",
    name: "Tripura",
    fill: "#ffe4e6",
    capital: "Agartala",
    capitalLat: 23.83,
    capitalLng: 91.28,
    path: "M 298,443 L 377,443 L 394,443 L 377,485 L 377,568 L 332,568 L 298,568 L 289,527 L 289,485 Z",
  },
];

// City coordinates (SVG space): x=(lon-87.7)*87, y=(29.8-lat)*83
export const cities = [
  { name: "Guwahati", state: "Assam", x: 352, y: 301, lat: 26.18, lng: 91.74, isCapital: true, size: "major" },
  { name: "Dibrugarh", state: "Assam", x: 635, y: 193, lat: 27.47, lng: 95.01, isCapital: false, size: "city" },
  { name: "Jorhat", state: "Assam", x: 567, y: 255, lat: 26.75, lng: 94.22, isCapital: false, size: "town" },
  { name: "Silchar", state: "Assam", x: 443, y: 418, lat: 24.82, lng: 92.79, isCapital: false, size: "city" },
  { name: "Tezpur", state: "Assam", x: 450, y: 260, lat: 26.63, lng: 92.8, isCapital: false, size: "town" },
  { name: "Itanagar", state: "Arunachal Pradesh", x: 514, y: 226, lat: 27.1, lng: 93.62, isCapital: true, size: "city" },
  { name: "Naharlagun", state: "Arunachal Pradesh", x: 510, y: 234, lat: 27.1, lng: 93.6, isCapital: false, size: "town" },
  { name: "Kohima", state: "Nagaland", x: 560, y: 343, lat: 25.67, lng: 94.11, isCapital: true, size: "city" },
  { name: "Dimapur", state: "Nagaland", x: 522, y: 325, lat: 25.91, lng: 93.73, isCapital: false, size: "city" },
  { name: "Imphal", state: "Manipur", x: 540, y: 418, lat: 24.82, lng: 93.94, isCapital: true, size: "city" },
  { name: "Shillong", state: "Meghalaya", x: 367, y: 352, lat: 25.57, lng: 91.88, isCapital: true, size: "city" },
  { name: "Tura", state: "Meghalaya", x: 270, y: 380, lat: 25.52, lng: 90.22, isCapital: false, size: "town" },
  { name: "Aizawl", state: "Mizoram", x: 436, y: 507, lat: 23.73, lng: 92.72, isCapital: true, size: "city" },
  { name: "Agartala", state: "Tripura", x: 311, y: 498, lat: 23.83, lng: 91.28, isCapital: true, size: "city" },
  { name: "Gangtok", state: "Sikkim", x: 79, y: 207, lat: 27.33, lng: 88.61, isCapital: true, size: "city" },
];

export const vehicles: Vehicle[] = [
  {
    id: "V001",
    regNo: "AS-01-AC-4812",
    driver: "Rajesh Borah",
    phone: "+91 94350 12345",
    type: "truck",
    status: "en_route",
    from: "Guwahati",
    to: "Kohima",
    currentLocation: "Dimapur, Nagaland",
    lat: 25.91,
    lng: 93.73,
    cargo: "Medical Supplies (Class A)",
    eta: "16:45 IST",
    delay: 0,
    risk: "medium",
    speed: 48,
    fuel: 68,
    progress: 72,
    lastUpdate: "2 min ago",
  },
  {
    id: "V002",
    regNo: "AS-01-BC-2247",
    driver: "Priya Hazarika",
    phone: "+91 94351 23456",
    type: "supply_truck",
    status: "delayed",
    from: "Guwahati",
    to: "Imphal",
    currentLocation: "NH-39, Assam-Nagaland Border",
    lat: 25.55,
    lng: 93.45,
    cargo: "Relief Materials",
    eta: "19:30 IST",
    delay: 95,
    risk: "high",
    speed: 12,
    fuel: 45,
    progress: 41,
    lastUpdate: "5 min ago",
  },
  {
    id: "V003",
    regNo: "ML-05-DA-8831",
    driver: "K. Malsawma",
    phone: "+91 94352 34567",
    type: "van",
    status: "en_route",
    from: "Silchar",
    to: "Aizawl",
    currentLocation: "Lawngtlai District, Mizoram",
    lat: 22.53,
    lng: 92.82,
    cargo: "Electronics & Equipment",
    eta: "18:20 IST",
    delay: 30,
    risk: "low",
    speed: 36,
    fuel: 82,
    progress: 85,
    lastUpdate: "1 min ago",
  },
  {
    id: "V004",
    regNo: "TR-01-AA-1193",
    driver: "Subhadra Debbarma",
    phone: "+91 94353 45678",
    type: "truck",
    status: "stopped",
    from: "Agartala",
    to: "Shillong",
    currentLocation: "Near Jampui Hills, Tripura",
    lat: 24.08,
    lng: 91.95,
    cargo: "Food Grains (PDS)",
    eta: "N/A",
    delay: 180,
    risk: "critical",
    speed: 0,
    fuel: 28,
    progress: 28,
    lastUpdate: "12 min ago",
  },
  {
    id: "V005",
    regNo: "SK-01-BA-7714",
    driver: "Tenzin Lepcha",
    phone: "+91 94354 56789",
    type: "ambulance",
    status: "en_route",
    from: "Gangtok",
    to: "Siliguri Medical Hub",
    currentLocation: "South Sikkim",
    lat: 27.05,
    lng: 88.52,
    cargo: "Emergency Patient Transport",
    eta: "17:00 IST",
    delay: 15,
    risk: "high",
    speed: 62,
    fuel: 91,
    progress: 55,
    lastUpdate: "30 sec ago",
  },
  {
    id: "V006",
    regNo: "NL-03-CA-5502",
    driver: "Zuchamo Yanthan",
    phone: "+91 94355 67890",
    type: "supply_truck",
    status: "delivered",
    from: "Dimapur",
    to: "Kohima",
    currentLocation: "Kohima Depot",
    lat: 25.67,
    lng: 94.11,
    cargo: "Construction Materials",
    eta: "Delivered 14:20 IST",
    delay: 0,
    risk: "low",
    speed: 0,
    fuel: 55,
    progress: 100,
    lastUpdate: "1 hr ago",
  },
  {
    id: "V007",
    regNo: "MN-02-AB-9034",
    driver: "Moirangthem Singh",
    phone: "+91 94356 78901",
    type: "truck",
    status: "en_route",
    from: "Imphal",
    to: "Dimapur",
    currentLocation: "Senapati District, Manipur",
    lat: 25.27,
    lng: 94.01,
    cargo: "Agricultural Produce",
    eta: "17:45 IST",
    delay: 20,
    risk: "medium",
    speed: 42,
    fuel: 63,
    progress: 38,
    lastUpdate: "3 min ago",
  },
  {
    id: "V008",
    regNo: "AR-01-DC-3367",
    driver: "Tai Meyir",
    phone: "+91 94357 89012",
    type: "supply_truck",
    status: "maintenance",
    from: "Itanagar",
    to: "Along",
    currentLocation: "Itanagar Service Centre",
    lat: 27.1,
    lng: 93.62,
    cargo: "N/A - Under Maintenance",
    eta: "Est. 09:00 IST Tomorrow",
    delay: 0,
    risk: "low",
    speed: 0,
    fuel: 40,
    progress: 0,
    lastUpdate: "2 hr ago",
  },
];

export const incidents: Incident[] = [
  {
    id: "INC-001",
    type: "landslide",
    title: "Major Landslide on NH-39",
    location: "Mao Gate – Karong Section",
    district: "Senapati",
    state: "Manipur",
    lat: 25.35,
    lng: 93.97,
    severity: "critical",
    reportedAt: "2026-08-30T09:42:00",
    reportedBy: "NHIDCL Field Team",
    description: "Large landslide blocking both carriageways on NH-39 near Mao Gate. Approximately 40m road section damaged. Heavy machinery dispatched but clearance expected to take 18-24 hours.",
    affectedRoutes: ["NH-39", "Guwahati–Imphal Corridor"],
    status: "active",
  },
  {
    id: "INC-002",
    type: "flood",
    title: "Flash Flood – Brahmaputra Tributary",
    location: "Kaziranga Bypass, NH-37",
    district: "Golaghat",
    state: "Assam",
    lat: 26.58,
    lng: 93.38,
    severity: "high",
    reportedAt: "2026-08-30T07:15:00",
    reportedBy: "Assam Disaster Management Authority",
    description: "Seasonal flooding from Dhansiri river overflow affecting NH-37 near Kaziranga. Road passable with extreme caution for vehicles under 10T. Water level rising.",
    affectedRoutes: ["NH-37", "Guwahati–Dibrugarh Expressway"],
    status: "active",
  },
  {
    id: "INC-003",
    type: "road_block",
    title: "Protest Blockade – NH-44",
    location: "Mawlai Checkpoint, Shillong",
    district: "East Khasi Hills",
    state: "Meghalaya",
    lat: 25.62,
    lng: 91.89,
    severity: "high",
    reportedAt: "2026-08-30T11:00:00",
    reportedBy: "Meghalaya Traffic Police",
    description: "Civil demonstration blocking NH-44 at Shillong bypass. Alternate route via Nongpoh recommended. Police deployed for traffic management.",
    affectedRoutes: ["NH-44", "Shillong Bypass"],
    status: "monitoring",
  },
  {
    id: "INC-004",
    type: "accident",
    title: "Multi-Vehicle Collision",
    location: "Dimapur–Kohima NH-29",
    district: "Dimapur",
    state: "Nagaland",
    lat: 25.78,
    lng: 93.92,
    severity: "medium",
    reportedAt: "2026-08-30T13:20:00",
    reportedBy: "Nagaland Traffic Authority",
    description: "Two-truck collision causing single-lane restriction. Police and ambulance on scene. Expected clearance within 2 hours.",
    affectedRoutes: ["NH-29"],
    status: "active",
  },
  {
    id: "INC-005",
    type: "infrastructure",
    title: "Bridge Load Restriction – Barak Valley",
    location: "Jiribam–Silchar Bridge",
    district: "Hailakandi",
    state: "Assam",
    lat: 24.61,
    lng: 92.71,
    severity: "medium",
    reportedAt: "2026-08-29T16:30:00",
    reportedBy: "PWD Inspection Team",
    description: "Structural inspection reveals load capacity reduced to 16T. Heavy vehicles must use Sonai diversion. Inspection report submitted to ministry.",
    affectedRoutes: ["NH-306", "Silchar–Imphal route"],
    status: "monitoring",
  },
  {
    id: "INC-006",
    type: "flood",
    title: "Road Inundation – Tripura Plains",
    location: "Udaipur–Sabroom Highway",
    district: "Gomati",
    state: "Tripura",
    lat: 23.53,
    lng: 91.48,
    severity: "low",
    reportedAt: "2026-08-30T08:50:00",
    reportedBy: "Tripura PWD",
    description: "Minor inundation on state highway. Passable for light vehicles. Situation being monitored.",
    affectedRoutes: ["SH-4"],
    status: "monitoring",
  },
];

export const alerts: Alert[] = [
  {
    id: "ALT-001",
    severity: "critical",
    title: "Vehicle V004 – Engine Failure Alert",
    message: "Vehicle AS-01-AA-1193 has stopped on NH-8 near Jampui Hills with critical engine failure. Driver Subhadra Debbarma requires assistance. Cargo: PDS Food Grains.",
    timestamp: "2026-08-30T13:45:00",
    entityType: "vehicle",
    entityId: "V004",
    read: false,
  },
  {
    id: "ALT-002",
    severity: "critical",
    title: "Landslide on NH-39 – Route Blocked",
    message: "Complete blockage on NH-39 at Mao Gate section. All active vehicles on Guwahati–Imphal corridor must be rerouted immediately. Estimated clearance: 18-24 hours.",
    timestamp: "2026-08-30T09:48:00",
    entityType: "incident",
    entityId: "INC-001",
    read: false,
  },
  {
    id: "ALT-003",
    severity: "high",
    title: "Vehicle V002 – Significant Delay",
    message: "V002 reporting 95-minute delay on NH-39. Reason: Traffic congestion due to landslide rerouting. Driver contacted, safety confirmed. Reroute via Jiribam corridor recommended.",
    timestamp: "2026-08-30T13:30:00",
    entityType: "vehicle",
    entityId: "V002",
    read: false,
  },
  {
    id: "ALT-004",
    severity: "high",
    title: "Flood Alert – NH-37 Kaziranga Section",
    message: "Flash flood warning for NH-37 near Golaghat. Water level rising. Vehicles over 10T should avoid this section. Diversion via Bokajan highway active.",
    timestamp: "2026-08-30T07:22:00",
    entityType: "incident",
    entityId: "INC-002",
    read: true,
  },
  {
    id: "ALT-005",
    severity: "high",
    title: "V005 – Ambulance on Priority Corridor",
    message: "Ambulance SK-01-BA-7714 on emergency medical transport. Green corridor requested on NH-10 (Gangtok–Siliguri). Contact district authorities for clearance.",
    timestamp: "2026-08-30T14:02:00",
    entityType: "vehicle",
    entityId: "V005",
    read: false,
  },
  {
    id: "ALT-006",
    severity: "medium",
    title: "NH-44 Blocked – Shillong Bypass",
    message: "Protest blockade at Mawlai Checkpoint. Vehicles on Guwahati–Shillong route advised to use alternate NH-6 via Nongpoh. Estimated delay: 45 minutes.",
    timestamp: "2026-08-30T11:05:00",
    entityType: "incident",
    entityId: "INC-003",
    read: true,
  },
  {
    id: "ALT-007",
    severity: "medium",
    title: "Multi-vehicle Accident – NH-29",
    message: "Accident causing lane restriction near Dimapur-Kohima highway. Vehicle V001 on NH-29 route — estimated 20-min additional delay. Monitor.",
    timestamp: "2026-08-30T13:22:00",
    entityType: "incident",
    entityId: "INC-004",
    read: false,
  },
  {
    id: "ALT-008",
    severity: "low",
    title: "Bridge Load Restriction – Barak Valley",
    message: "Jiribam–Silchar bridge load limit reduced to 16T. Heavy cargo vehicles must use Sonai diversion. Update route assignments for affected vehicles.",
    timestamp: "2026-08-29T16:35:00",
    entityType: "route",
    read: true,
  },
  {
    id: "ALT-009",
    severity: "low",
    title: "Scheduled System Maintenance – 02:00 IST",
    message: "Planned maintenance window for GIS tile server tonight at 02:00–04:00 IST. Live map updates will be intermittent. Field units to use offline maps during this period.",
    timestamp: "2026-08-30T10:00:00",
    entityType: "system",
    read: true,
  },
];

export const kpiData = {
  activeVehicles: 8,
  activeDeliveries: 6,
  blockedRoads: 3,
  criticalIncidents: 2,
  highRiskRoutes: 4,
  totalVehicles: 12,
  onTimeDeliveries: 78,
  avgDelay: 42,
};

export const routeOptions: Route[] = [
  {
    id: "R001",
    name: "Via NH-37 + NH-39",
    from: "Guwahati",
    to: "Imphal",
    distance: 498,
    eta: 780,
    riskScore: 72,
    condition: "poor",
    incidents: 2,
    type: "alternative",
    delay: 95,
    description: "Standard NH-39 corridor affected by landslide near Mao Gate. High risk.",
  },
  {
    id: "R002",
    name: "Via NH-37 + Jiribam Corridor",
    from: "Guwahati",
    to: "Imphal",
    distance: 547,
    eta: 660,
    riskScore: 38,
    condition: "fair",
    incidents: 0,
    type: "recommended",
    delay: 25,
    description: "Longer but currently safest route via Jiribam–Imphal rail corridor road. Recommended.",
  },
  {
    id: "R003",
    name: "Direct NH-44 + NH-102",
    from: "Guwahati",
    to: "Imphal",
    distance: 512,
    eta: 720,
    riskScore: 55,
    condition: "fair",
    incidents: 1,
    type: "alternative",
    delay: 45,
    description: "Via Shillong, moderately affected by Mawlai blockade. Use if NH-37 is congested.",
  },
];

export const deliveryTrendData = [
  { day: "Mon", onTime: 18, delayed: 3, blocked: 1 },
  { day: "Tue", onTime: 22, delayed: 5, blocked: 0 },
  { day: "Wed", onTime: 19, delayed: 7, blocked: 2 },
  { day: "Thu", onTime: 25, delayed: 4, blocked: 1 },
  { day: "Fri", onTime: 21, delayed: 6, blocked: 2 },
  { day: "Sat", onTime: 16, delayed: 8, blocked: 3 },
  { day: "Today", onTime: 12, delayed: 4, blocked: 2 },
];

export const incidentsByType = [
  { type: "Landslide", count: 8, fill: "#dc2626" },
  { type: "Flood", count: 12, fill: "#f97316" },
  { type: "Road Block", count: 5, fill: "#f59e0b" },
  { type: "Accident", count: 6, fill: "#3b82f6" },
  { type: "Infrastructure", count: 3, fill: "#8b5cf6" },
];

export const fieldReports = [
  {
    id: "FR-001",
    type: "Landslide",
    location: "Mao Gate, NH-39",
    district: "Senapati",
    state: "Manipur",
    severity: "critical" as Severity,
    submittedBy: "NHIDCL Field Eng. R. Gogoi",
    submittedAt: "2026-08-30T09:42:00",
    description: "Large debris flow blocking entire NH-39 carriageway. Two trucks stuck. No casualties reported. NHIDCL machinery dispatched. Estimated clearance 18h.",
    hasImage: true,
    lat: 25.35,
    lng: 93.97,
    status: "under_review",
  },
  {
    id: "FR-002",
    type: "Flood",
    location: "Kaziranga, NH-37",
    district: "Golaghat",
    state: "Assam",
    severity: "high" as Severity,
    submittedBy: "SDRF Team, Golaghat",
    submittedAt: "2026-08-30T07:15:00",
    description: "Dhansiri river overflow causing inundation on NH-37. Water level at 0.4m. Road passable for light vehicles. Situation monitored hourly.",
    hasImage: true,
    lat: 26.58,
    lng: 93.38,
    status: "acknowledged",
  },
  {
    id: "FR-003",
    type: "Road Block",
    location: "Mawlai, Shillong",
    district: "East Khasi Hills",
    state: "Meghalaya",
    severity: "high" as Severity,
    submittedBy: "Meghalaya Traffic Police",
    submittedAt: "2026-08-30T11:00:00",
    description: "Civil demonstration blocking NH-44 at Mawlai checkpoint. No violence reported. Alternate route via Nongpoh advised. Police in control.",
    hasImage: false,
    lat: 25.62,
    lng: 91.89,
    status: "acknowledged",
  },
  {
    id: "FR-004",
    type: "Accident",
    location: "NH-29, Dimapur–Kohima",
    district: "Dimapur",
    state: "Nagaland",
    severity: "medium" as Severity,
    submittedBy: "Nagaland Traffic Authority",
    submittedAt: "2026-08-30T13:20:00",
    description: "Two trucks rear-ended causing lane restriction. Drivers received first aid. Vehicle recovery in progress. Police on scene.",
    hasImage: true,
    lat: 25.78,
    lng: 93.92,
    status: "open",
  },
  {
    id: "FR-005",
    type: "Infrastructure",
    location: "Jiribam–Silchar Bridge",
    district: "Hailakandi",
    state: "Assam",
    severity: "medium" as Severity,
    submittedBy: "PWD Inspection Team",
    submittedAt: "2026-08-29T16:30:00",
    description: "Bridge inspection complete. Load capacity reduced from 25T to 16T. Structural cracks documented. Ministry notified. Repair timeline: 3 months.",
    hasImage: true,
    lat: 24.61,
    lng: 92.71,
    status: "resolved",
  },
];

# 🛰️ NER-LINK

### North Eastern Region Link — Logistics & Accessibility Intelligence

> **A risk-aware logistics intelligence platform for safer and more informed movement across the North Eastern Region of India.**

[![Status](https://img.shields.io/badge/Status-Prototype-orange)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)](#)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-green)](#)
[![Database](https://img.shields.io/badge/Database-SQLite-lightgrey)](#)
[![Maps](https://img.shields.io/badge/Maps-Leaflet%20%2B%20OpenStreetMap-brightgreen)](#)

---

## 🔗 Project Links

| Resource             | Link                                                                           |
| -------------------- | ------------------------------------------------------------------------------ |
| 📦 GitHub Repository | [NER-LINK-Prototype](https://github.com/shubhbijore25-baap/NER-LINK-Prototype) |



---

## 🚨 Problem Statement

Logistics across the North Eastern Region of India can be heavily affected by rapidly changing road and environmental conditions.

Events such as:

* 🌧️ Heavy rainfall
* 🌊 Flooding
* ⛰️ Landslides
* 🚧 Road blockages
* 🌉 Bridge damage
* 🚑 Accidents
* 🚦 Traffic disruptions

can make an otherwise usable route unsafe or inaccessible.

Traditional route planning primarily focuses on distance and travel time. However, for critical logistics, **the shortest route is not always the most usable route**.

The challenge is therefore to continuously understand:

> **What is happening on the road, how does it affect route risk, and what should the logistics operator do next?**

---

# 💡 Our Solution

**NER-LINK (North Eastern Region Link)** is a logistics and accessibility intelligence platform designed to connect field-level information with route-level decision support.

The system brings together:

**Field Reports → Risk Assessment → Route Intelligence → Operational Decision**

Instead of simply displaying a map, NER-LINK helps an operator understand:

* Which corridors are accessible
* Which sections are becoming risky
* Why a route is risky
* Whether a route should be used or avoided
* When a road should be treated as closed
* What alternative operational action can be considered

---

# 🎯 Core Objective

NER-LINK aims to help logistics operators make safer and more informed decisions when road conditions change.

The platform focuses on **route-level intelligence**, particularly for remote and difficult-to-monitor areas where conditions may differ significantly from nearby cities.

---

# ✨ Key Features

## 🗺️ 1. Command Center

A centralized operational dashboard providing an overview of the logistics network.

The Command Center displays:

* Active vehicles
* Deliveries in progress
* Critical deliveries
* Accessible corridors
* High-risk corridors
* Blocked corridors
* Road incidents
* Current route conditions

The map provides a visual representation of the network and its current risk state.

### Route status

| Status       | Meaning                                  |
| ------------ | ---------------------------------------- |
| 🟢 Safe      | Corridor currently considered accessible |
| 🟡 Watch     | Conditions require monitoring            |
| 🟠 High Risk | Significant risk factors detected        |
| 🔴 Closed    | Route should not be used                 |

---

# 🚚 2. Critical Delivery Monitoring

NER-LINK supports monitoring of priority deliveries such as:

* Essential medicines
* Emergency supplies
* Relief materials
* High-priority logistics

A delivery can be associated with a priority level so that route decisions can consider the importance of the cargo.

For example:

> **NER-104 — Essential Medicines — Guwahati → Aizawl**

The system can evaluate available corridors and provide route-level decision support.

---

# 🧭 3. Route Intelligence

The Route Intelligence module compares available corridors based on their current risk conditions.

A route can be evaluated using factors such as:

* Incident severity
* Rainfall/weather-related risk
* Terrain
* Road condition
* Road blockage
* Bridge condition
* Historical risk information
* Travel characteristics

The objective is not simply to find the shortest route.

Instead, NER-LINK evaluates whether a route is **usable and sufficiently safe for the current logistics situation**.

---

# ⚠️ 4. Field Reports

Field teams can report road conditions directly through the platform.

Supported incident categories include:

* Landslide
* Flood
* Road Blockage
* Accident
* Heavy Rain
* Bridge Damage
* Traffic
* Blackout

A field report can include:

* Incident type
* Location
* Severity
* Description/details
* Supporting information

These reports become inputs to the route-risk assessment process.

---

# 🧠 5. Risk Assessment

NER-LINK combines multiple risk factors into a route-level assessment.

A simplified conceptual flow is:

```text
Incident Information
        +
Weather / Environmental Factors
        +
Road Conditions
        +
Route Characteristics
        ↓
   Risk Assessment
        ↓
Route Status / Recommendation
```

This allows the platform to move from raw incident information toward an operational interpretation.

---

# 🚧 6. Closure Rule

A numerical risk score alone is not sufficient when a road is physically unusable.

NER-LINK therefore supports explicit closure conditions.

For example:

```text
Road Blockage
      ↓
Severity = Critical
      ↓
Road Impassable
      ↓
CLOSURE RULE
      ↓
Route = CLOSED
```

This prevents a route from appearing usable simply because its numerical score remains below a threshold.

---

# 🔄 7. Dynamic Route Reassessment

Road conditions can change after a route has already been selected.

NER-LINK therefore follows a continuous decision flow:

```text
Field Report
     ↓
Hazard Recorded
     ↓
Risk Recalculated
     ↓
Route Reassessed
     ↓
Route Status Updated
     ↓
Operational Decision
```

For example:

```text
NH-6
Landslide detected
       ↓
Risk increases
       ↓
Road becomes impassable
       ↓
NH-6 → CLOSED
       ↓
Evaluate alternative corridor
```

---

# 🚁 8. Alternative Logistics Actions

When a safe road corridor is unavailable, the system can support alternative operational decisions.

Depending on the situation, these may include:

* Hold cargo at a hub
* Wait for road clearance
* Use an alternate corridor
* Relay cargo through another depot
* Consider air transport for critical supplies

For critical deliveries, the decision may therefore move from:

> **“Which road should we use?”**

to:

> **“Is road transport currently feasible, and what alternative action should be considered?”**

---

# 🛠️ 9. Road Clearance & Damage Control

NER-LINK also provides a workflow for road incidents and clearance.

Operators can track information such as:

* Incident location
* Incident severity
* Responsible authority
* Clearance status
* Incident details
* Clearance request
* Clearance tracking

Once a road is cleared, its status can be reassessed and the route can become eligible for evaluation again.

---

# 🛰️ 10. Road-Following Map Routes

The map uses road-network geometry rather than simply connecting two cities with a straight line.

This allows routes to visually follow the underlying road network and makes the map more representative of actual logistics corridors.

The prototype also supports route visualization and vehicle movement along route geometry.

---

# 🏗️ System Architecture

```text
                    NER-LINK
                       │
          ┌────────────┴────────────┐
          │                         │
     Field Reports              Data Inputs
          │                         │
          │                  Weather / Road Data
          │                         │
          └────────────┬────────────┘
                       ↓
                FastAPI Backend
                       ↓
                Risk Assessment
                       ↓
                Route Intelligence
                       ↓
             ┌─────────┴─────────┐
             │                   │
        Route Status        Operational Action
             │                   │
             ↓                   ↓
        Map / Dashboard    Reroute / Hold /
                           Clearance / Alternative
```

---

# 🔄 End-to-End Workflow

The core NER-LINK workflow is:

```text
┌──────────────────┐
│   Field Report   │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Backend receives │
│     report       │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Risk Assessment  │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Route Intelligence│
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Route Status /   │
│ Recommendation   │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Logistics Action │
└──────────────────┘
```

---

# 🧪 Example Scenario

### Guwahati → Aizawl Critical Delivery

Consider a critical delivery carrying essential medicines.

### Initial state

The system evaluates available corridors.

```text
Guwahati
    ↓
Available corridors
    ↓
Risk assessment
    ↓
Select an appropriate open corridor
```

### New incident

A field team reports:

```text
Incident: Landslide
Severity: Critical
Location: NH-6
```

NER-LINK processes the report.

```text
Field Report
     ↓
Hazard Recorded
     ↓
Risk Recalculated
     ↓
NH-6 → CLOSED
```

The system then evaluates the alternative corridor.

If the alternative route is also affected by a major incident:

```text
NH-6  → CLOSED
NH-27 → CLOSED
```

NER-LINK identifies that there is currently **no safe road corridor available**.

For critical cargo, the system can then present alternatives such as:

```text
Hold Cargo
     OR
Request Road Clearance
     OR
Consider Alternative Transport
```

This demonstrates the core concept of NER-LINK:

> **From field intelligence to logistics action.**

---

# 🧰 Technology Stack

## Frontend

* React
* Vite
* JavaScript / TypeScript
* Leaflet
* HTML / CSS

## Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy

## Database

* SQLite

## Mapping

* Leaflet
* OpenStreetMap-compatible map data
* Road-network routing geometry

## Development

* Git
* GitHub
* VS Code

---

# 📁 Project Structure

```text
NER-LINK-Prototype/
│
├── .figma/
│   └── make/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── seed.py
│   └── ...
│
├── dist/
│
├── src/
│   └── ...
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Node.js
* npm
* Python 3.9+
* Git

---

## 1. Clone the repository

```bash
git clone https://github.com/shubhbijore25-baap/NER-LINK-Prototype.git
cd NER-LINK-Prototype
```

---

# 2. Install frontend dependencies

```bash
npm install
```

---

# 3. Start the frontend

```bash
npm run dev
```

The Vite development server will provide a local URL.

The current prototype has been configured to use port `8443`, depending on the project configuration.

Open the URL shown in the terminal.

---

# 4. Start the FastAPI backend

Open a second terminal:

```bash
cd backend
```

If a virtual environment is being used:

### Windows

```powershell
.\venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Then start FastAPI:

```bash
uvicorn main:app --reload
```

The API is normally available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🔌 API Health Check

NER-LINK exposes a backend health endpoint:

```text
GET /api/health
```

For a local backend:

```text
http://127.0.0.1:8000/api/health
```

This can be used to verify whether the backend is available.

---

# 📊 Data & Risk Considerations

NER-LINK is designed around the principle that **city-level conditions should not automatically be treated as exact road-level measurements**.

Weather and environmental data can represent estimates or forecasts, while actual road conditions may differ significantly along a route.

Therefore, route-level decision support should combine multiple sources where available, including:

* Field reports
* Road-condition information
* Weather/environmental information
* Official alerts
* Route/road-network information

The system should communicate data freshness and uncertainty where applicable.

---

# 🔐 Security & Configuration

Do not commit secrets, passwords, API keys, or private credentials to the repository.

Use environment variables or local configuration files for sensitive values.

Before deployment, review:

```text
.env
API keys
database credentials
external service credentials
```

and ensure they are excluded from Git.

---

# 📸 Screenshots

Add screenshots of the working prototype here.

Recommended screenshots:

### Command Center

```text
screenshots/command-center.png
```

### Route Intelligence

```text
screenshots/route-intelligence.png
```

### Field Report

```text
screenshots/field-report.png
```

### Road Clearance

```text
screenshots/road-clearance.png
```

> **Tip:** Add screenshots to a `screenshots/` folder and reference them with relative paths so they continue to work when the repository is cloned. GitHub supports relative image paths in README files.

Example:

```markdown
![NER-LINK Command Center](screenshots/command-center.png)
```

---

# 🎥 Demo Flow

The recommended demonstration flow is:

```text
1. Command Center
        ↓
2. Critical Delivery
        ↓
3. Route Intelligence
        ↓
4. Simulate Field Incident
        ↓
5. Risk Recalculation
        ↓
6. Route Closure
        ↓
7. Alternative Route Evaluation
        ↓
8. No Safe Road Scenario
        ↓
9. Alternative Logistics Action
        ↓
10. Road Clearance / Recovery
```

---

# 🎯 Target Use Cases

NER-LINK can support logistics scenarios involving:

* 🚑 Emergency medical supplies
* 💊 Essential medicines
* 🥫 Relief materials
* 🚚 Critical deliveries
* 🏥 Healthcare logistics
* 🆘 Disaster-response logistics
* 📦 Regional supply chains
* 🚧 Road accessibility monitoring

---

# 🌏 Why the North Eastern Region?

The North Eastern Region has geographically challenging terrain and logistics corridors that can be affected by environmental and road disruptions.

NER-LINK focuses on **connectivity and accessibility**, rather than treating cities as isolated points.

The objective is to understand what happens **along the route** and how that affects movement.

---

# 🔮 Future Scope

Potential future extensions include:

* 📡 Live GPS vehicle tracking
* 🌦️ Route-segment weather sampling
* 🚦 Traffic-aware routing
* 🛰️ Integration of additional GIS/reference layers
* 🔔 Real-time alerts
* 📱 Mobile field-reporting application
* 🔄 WebSocket-based live updates
* 🗄️ PostgreSQL/PostGIS for larger deployments
* 📈 Historical route-risk analytics
* 🤖 More advanced risk-assessment models
* 🧭 Multi-route optimization
* 📍 Improved remote-area coverage

---

# 🏆 Hackathon Prototype

NER-LINK is developed as a prototype demonstrating how **field intelligence, risk assessment and route intelligence can be combined into a logistics decision-support workflow**.

The current implementation focuses on demonstrating the core concept through an interactive web interface and backend services.

---

# 👥 Team

**Project:** NER-LINK — North Eastern Region Link

### Team Contributions

| Area               | Responsibility                                   |
| ------------------ | ------------------------------------------------ |
| Frontend & UI      | Interactive dashboard, maps, route visualization |
| Backend            | FastAPI services and API integration             |
| Risk & Route Logic | Route-risk assessment and decision logic         |
| Data / GIS         | Geographic data, incidents and route information |

---

# 📄 License

This project is currently a hackathon prototype.

A formal open-source license can be added if the project is intended for public redistribution or further open-source development.

---

# 🔗 Repository

**GitHub:**
https://github.com/shubhbijore25-baap/NER-LINK-Prototype

---

## NER-LINK

> **From field intelligence to safer logistics decisions across the North Eastern Region.** 🛰️

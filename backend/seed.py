import json

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from models import Alert, Delivery, FieldReport, Incident, Route, Vehicle, utcnow


VEHICLES = [
    dict(id="V001", reg_no="AS-01-AC-4812", driver="Rajesh Borah", phone="+91 94350 12345", type="truck", status="en_route", origin="Guwahati", destination="Kohima", current_location="Dimapur, Nagaland", lat=25.91, lng=93.73, cargo="Medical Supplies (Class A)", eta="16:45 IST", delay=0, risk="medium", speed=48, fuel=68, progress=72, last_update="2 min ago"),
    dict(id="V002", reg_no="AS-01-BC-2247", driver="Priya Hazarika", phone="+91 94351 23456", type="supply_truck", status="delayed", origin="Guwahati", destination="Imphal", current_location="NH-39, Assam-Nagaland Border", lat=25.55, lng=93.45, cargo="Relief Materials", eta="19:30 IST", delay=95, risk="high", speed=12, fuel=45, progress=41, last_update="5 min ago"),
    dict(id="V003", reg_no="ML-05-DA-8831", driver="K. Malsawma", phone="+91 94352 34567", type="van", status="en_route", origin="Silchar", destination="Aizawl", current_location="Lawngtlai District, Mizoram", lat=22.53, lng=92.82, cargo="Electronics & Equipment", eta="18:20 IST", delay=30, risk="low", speed=36, fuel=82, progress=85, last_update="1 min ago"),
    dict(id="V004", reg_no="TR-01-AA-1193", driver="Subhadra Debbarma", phone="+91 94353 45678", type="truck", status="stopped", origin="Agartala", destination="Shillong", current_location="Near Jampui Hills, Tripura", lat=24.08, lng=91.95, cargo="Food Grains (PDS)", eta="N/A", delay=180, risk="critical", speed=0, fuel=28, progress=28, last_update="12 min ago"),
    dict(id="V005", reg_no="SK-01-BA-7714", driver="Tenzin Lepcha", phone="+91 94354 56789", type="ambulance", status="en_route", origin="Gangtok", destination="Siliguri Medical Hub", current_location="South Sikkim", lat=27.05, lng=88.52, cargo="Emergency Patient Transport", eta="17:00 IST", delay=15, risk="high", speed=62, fuel=91, progress=55, last_update="30 sec ago"),
    dict(id="V006", reg_no="NL-03-CA-5502", driver="Zuchamo Yanthan", phone="+91 94355 67890", type="supply_truck", status="delivered", origin="Dimapur", destination="Kohima", current_location="Kohima Depot", lat=25.67, lng=94.11, cargo="Construction Materials", eta="Delivered 14:20 IST", delay=0, risk="low", speed=0, fuel=55, progress=100, last_update="1 hr ago"),
    dict(id="V007", reg_no="MN-02-AB-9034", driver="Moirangthem Singh", phone="+91 94356 78901", type="truck", status="en_route", origin="Imphal", destination="Dimapur", current_location="Senapati District, Manipur", lat=25.27, lng=94.01, cargo="Agricultural Produce", eta="17:45 IST", delay=20, risk="medium", speed=42, fuel=63, progress=38, last_update="3 min ago"),
    dict(id="V008", reg_no="AR-01-DC-3367", driver="Tai Meyir", phone="+91 94357 89012", type="supply_truck", status="maintenance", origin="Itanagar", destination="Along", current_location="Itanagar Service Centre", lat=27.1, lng=93.62, cargo="N/A - Under Maintenance", eta="Est. 09:00 IST Tomorrow", delay=0, risk="low", speed=0, fuel=40, progress=0, last_update="2 hr ago"),
]

INCIDENTS = [
    dict(id="INC-001", type="landslide", title="Major Landslide on NH-39", location="Mao Gate – Karong Section", district="Senapati", state="Manipur", lat=25.35, lng=93.97, severity="critical", reported_by="NHIDCL Field Team", description="Large landslide blocking both carriageways on NH-39 near Mao Gate. Heavy machinery dispatched; clearance is expected to take 18–24 hours.", affected_routes=["NH-39", "Guwahati–Imphal Corridor"], status="active"),
    dict(id="INC-002", type="flood", title="Flash Flood – Brahmaputra Tributary", location="Kaziranga Bypass, NH-37", district="Golaghat", state="Assam", lat=26.58, lng=93.38, severity="high", reported_by="Assam Disaster Management Authority", description="Seasonal flooding from Dhansiri river overflow affects NH-37. Road is passable with extreme caution for vehicles under 10T.", affected_routes=["NH-37", "Guwahati–Dibrugarh Expressway"], status="active"),
    dict(id="INC-003", type="road_block", title="Protest Blockade – NH-44", location="Mawlai Checkpoint, Shillong", district="East Khasi Hills", state="Meghalaya", lat=25.62, lng=91.89, severity="high", reported_by="Meghalaya Traffic Police", description="Civil demonstration blocks NH-44 at Shillong bypass. Alternate route via Nongpoh recommended.", affected_routes=["NH-44", "Shillong Bypass"], status="monitoring"),
    dict(id="INC-004", type="accident", title="Multi-Vehicle Collision", location="Dimapur–Kohima NH-29", district="Dimapur", state="Nagaland", lat=25.78, lng=93.92, severity="medium", reported_by="Nagaland Traffic Authority", description="Two-truck collision causes a single-lane restriction. Expected clearance within 2 hours.", affected_routes=["NH-29"], status="active"),
    dict(id="INC-005", type="infrastructure", title="Bridge Load Restriction – Barak Valley", location="Jiribam–Silchar Bridge", district="Hailakandi", state="Assam", lat=24.61, lng=92.71, severity="medium", reported_by="PWD Inspection Team", description="Bridge load capacity reduced to 16T. Heavy vehicles must use Sonai diversion.", affected_routes=["NH-306", "Silchar–Imphal route"], status="monitoring"),
    dict(id="INC-006", type="flood", title="Road Inundation – Tripura Plains", location="Udaipur–Sabroom Highway", district="Gomati", state="Tripura", lat=23.53, lng=91.48, severity="low", reported_by="Tripura PWD", description="Minor inundation on state highway. Passable for light vehicles; situation is being monitored.", affected_routes=["SH-4"], status="monitoring"),
]

ALERTS = [
    dict(id="ALT-001", severity="critical", title="Vehicle V004 – Engine Failure Alert", message="Vehicle TR-01-AA-1193 has stopped near Jampui Hills. Driver assistance is required.", entity_type="vehicle", entity_id="V004", read=False),
    dict(id="ALT-002", severity="critical", title="Landslide on NH-39 – Route Blocked", message="Complete blockage on NH-39 at Mao Gate. Reroute vehicles on the Guwahati–Imphal corridor.", entity_type="incident", entity_id="INC-001", read=False),
    dict(id="ALT-003", severity="high", title="Vehicle V002 – Significant Delay", message="V002 reports a 95-minute delay on NH-39. Rerouting via Jiribam is recommended.", entity_type="vehicle", entity_id="V002", read=False),
    dict(id="ALT-004", severity="high", title="Flood Alert – NH-37 Kaziranga Section", message="Water levels are rising near Golaghat. Vehicles over 10T should avoid this section.", entity_type="incident", entity_id="INC-002", read=True),
    dict(id="ALT-005", severity="high", title="V005 – Ambulance on Priority Corridor", message="Ambulance SK-01-BA-7714 is on emergency medical transport via NH-10.", entity_type="vehicle", entity_id="V005", read=False),
    dict(id="ALT-006", severity="medium", title="NH-44 Blocked – Shillong Bypass", message="Use alternate NH-6 via Nongpoh; estimated delay is 45 minutes.", entity_type="incident", entity_id="INC-003", read=True),
]

ROUTES = [
    dict(id="R001", name="Via NH-37 + NH-39", origin="Guwahati", destination="Imphal", distance=498, eta=780, risk_score=72, condition="poor", incident_count=2, type="alternative", delay=95, description="Standard NH-39 corridor affected by landslide near Mao Gate. High risk."),
    dict(id="R002", name="Via NH-37 + Jiribam Corridor", origin="Guwahati", destination="Imphal", distance=547, eta=660, risk_score=38, condition="fair", incident_count=0, type="recommended", delay=25, description="Longer but currently safer route via the Jiribam–Imphal corridor. Recommended."),
    dict(id="R003", name="Direct NH-44 + NH-102", origin="Guwahati", destination="Imphal", distance=512, eta=720, risk_score=55, condition="fair", incident_count=1, type="alternative", delay=45, description="Via Shillong; moderately affected by the Mawlai blockade."),
]

DELIVERIES = [
    dict(day="Mon", on_time=18, delayed=3, blocked=1), dict(day="Tue", on_time=22, delayed=5, blocked=0),
    dict(day="Wed", on_time=19, delayed=7, blocked=2), dict(day="Thu", on_time=25, delayed=4, blocked=1),
    dict(day="Fri", on_time=21, delayed=6, blocked=2), dict(day="Sat", on_time=16, delayed=8, blocked=3),
    dict(day="Today", on_time=12, delayed=4, blocked=2),
]

REPORTS = [
    dict(id="FR-001", type="Landslide", location="Mao Gate, NH-39", district="Senapati", state="Manipur", severity="critical", submitted_by="NHIDCL Field Eng. R. Gogoi", description="Large debris flow blocking entire NH-39 carriageway. Two trucks stuck. Machinery dispatched.", has_image=True, lat=25.35, lng=93.97, status="under_review"),
    dict(id="FR-002", type="Flood", location="Kaziranga, NH-37", district="Golaghat", state="Assam", severity="high", submitted_by="SDRF Team, Golaghat", description="Dhansiri river overflow causing inundation on NH-37. Situation monitored hourly.", has_image=True, lat=26.58, lng=93.38, status="acknowledged"),
    dict(id="FR-003", type="Road Block", location="Mawlai, Shillong", district="East Khasi Hills", state="Meghalaya", severity="high", submitted_by="Meghalaya Traffic Police", description="Civil demonstration blocking NH-44 at Mawlai checkpoint. Alternate route advised.", lat=25.62, lng=91.89, status="acknowledged"),
    dict(id="FR-004", type="Accident", location="NH-29, Dimapur–Kohima", district="Dimapur", state="Nagaland", severity="medium", submitted_by="Nagaland Traffic Authority", description="Two trucks collided causing a lane restriction. Vehicle recovery in progress.", has_image=True, lat=25.78, lng=93.92, status="open"),
    dict(id="FR-005", type="Infrastructure", location="Jiribam–Silchar Bridge", district="Hailakandi", state="Assam", severity="medium", submitted_by="PWD Inspection Team", description="Bridge load capacity reduced to 16T. Ministry notified.", has_image=True, lat=24.61, lng=92.71, status="resolved"),
]


def seed_database(db: Session) -> None:
    if db.scalar(select(func.count()).select_from(Vehicle)) == 0:
        db.add_all(Vehicle(**row) for row in VEHICLES)
    if db.scalar(select(func.count()).select_from(Incident)) == 0:
        db.add_all(Incident(**{**row, "reported_at": utcnow(), "affected_routes": json.dumps(row["affected_routes"])}) for row in INCIDENTS)
    if db.scalar(select(func.count()).select_from(Alert)) == 0:
        db.add_all(Alert(**{**row, "timestamp": utcnow()}) for row in ALERTS)
    if db.scalar(select(func.count()).select_from(Route)) == 0:
        db.add_all(Route(**row) for row in ROUTES)
    if db.scalar(select(func.count()).select_from(Delivery)) == 0:
        db.add_all(Delivery(**row) for row in DELIVERIES)
    if db.scalar(select(func.count()).select_from(FieldReport)) == 0:
        db.add_all(FieldReport(**{**row, "submitted_at": utcnow()}) for row in REPORTS)
    db.commit()

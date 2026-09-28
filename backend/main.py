import json
from collections import Counter
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, inspect, select, text
from sqlalchemy.orm import Session

from database import Base, SessionLocal, engine, get_db
from models import Alert, Delivery, FieldReport, Incident, Route, Vehicle
from schemas import (
    AlertOut, AlertUpdate, DashboardSummary, FieldReportCreate, FieldReportOut,
    FieldReportStatusUpdate, GisOverview, IncidentOut, IncidentTypeCount, RouteAnalysisRequest,
    RouteOut, VehicleOut,
)
from seed import seed_database


def prepare_database() -> None:
    # The initial prototype used an incompatible field_reports table. Preserve it
    # under a legacy name so the new schema can be created without dropping data.
    existing = inspect(engine)
    if "field_reports" in existing.get_table_names():
        columns = {column["name"] for column in existing.get_columns("field_reports")}
        if "type" not in columns and "incident_type" in columns:
            with engine.begin() as connection:
                legacy_name = f"field_reports_legacy_{datetime.utcnow():%Y%m%d%H%M%S}"
                connection.execute(text(f"ALTER TABLE field_reports RENAME TO {legacy_name}"))
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_database(db)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    prepare_database()
    yield


app = FastAPI(
    title="NER-LINK API",
    description="Logistics and accessibility intelligence for Northeast India",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
@app.get("/api/v1/health")
def health_check():
    return {"status": "online", "service": "NER-LINK API"}


@app.get("/api/v1/vehicles", response_model=list[VehicleOut])
def list_vehicles(
    status: str | None = None,
    risk: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    query = select(Vehicle)
    if status and status != "all":
        query = query.where(Vehicle.status == status)
    if risk and risk != "all":
        query = query.where(Vehicle.risk == risk)
    if search:
        term = f"%{search.strip()}%"
        query = query.where((Vehicle.id.ilike(term)) | (Vehicle.reg_no.ilike(term)) | (Vehicle.driver.ilike(term)) | (Vehicle.current_location.ilike(term)))
    return db.scalars(query.order_by(Vehicle.id)).all()


@app.get("/api/v1/incidents", response_model=list[IncidentOut])
def list_incidents(
    severity: str | None = None,
    status: str | None = None,
    type: str | None = None,
    state: str | None = None,
    db: Session = Depends(get_db),
):
    query = select(Incident)
    if severity and severity != "all":
        query = query.where(Incident.severity == severity)
    if status and status != "all":
        query = query.where(Incident.status == status)
    if type:
        query = query.where(Incident.type == type)
    if state:
        query = query.where(Incident.state.ilike(f"%{state}%"))
    rows = db.scalars(query.order_by(Incident.reported_at.desc())).all()
    return [{**{key: getattr(row, key) for key in ("id", "type", "title", "location", "district", "state", "lat", "lng", "severity", "reported_at", "reported_by", "description", "status")}, "affected_routes": json.loads(row.affected_routes)} for row in rows]


@app.get("/api/v1/alerts", response_model=list[AlertOut])
def list_alerts(severity: str | None = None, read: bool | None = None, db: Session = Depends(get_db)):
    query = select(Alert)
    if severity and severity != "all":
        query = query.where(Alert.severity == severity)
    if read is not None:
        query = query.where(Alert.read.is_(read))
    return db.scalars(query.order_by(Alert.timestamp.desc())).all()


@app.patch("/api/v1/alerts/{alert_id}", response_model=AlertOut)
def update_alert(alert_id: str, payload: AlertUpdate, db: Session = Depends(get_db)):
    alert = db.get(Alert, alert_id)
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.read = payload.read
    db.commit()
    db.refresh(alert)
    return alert


@app.get("/api/v1/field-reports", response_model=list[FieldReportOut])
def list_field_reports(
    severity: str | None = None,
    status: str | None = None,
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    query = select(FieldReport)
    if severity and severity != "all":
        query = query.where(FieldReport.severity == severity)
    if status and status != "all":
        query = query.where(FieldReport.status == status)
    rows = db.scalars(query.order_by(FieldReport.submitted_at.desc()).offset(offset).limit(limit)).all()
    return [_field_report_out(row) for row in rows]


@app.get("/api/v1/field-reports/{report_id}", response_model=FieldReportOut)
def get_field_report(report_id: str, db: Session = Depends(get_db)):
    row = db.get(FieldReport, report_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Field report not found")
    return _field_report_out(row)


def _field_report_out(row: FieldReport) -> dict:
    return {"id": row.id, "type": row.type, "location": row.location, "district": row.district, "state": row.state, "severity": row.severity, "submitted_by": row.submitted_by, "submitted_at": row.submitted_at, "description": row.description, "has_image": row.has_image or bool(row.image_url), "image_url": row.image_url, "lat": row.lat, "lng": row.lng, "status": row.status}


@app.post("/api/v1/field-reports", response_model=FieldReportOut, status_code=201)
def create_field_report(payload: FieldReportCreate, db: Session = Depends(get_db)):
    row = FieldReport(id=f"FR-{datetime.utcnow():%y%m%d%H%M%S%f}", **payload.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return _field_report_out(row)


@app.patch("/api/v1/field-reports/{report_id}", response_model=FieldReportOut)
def update_field_report(report_id: str, payload: FieldReportStatusUpdate, db: Session = Depends(get_db)):
    row = db.get(FieldReport, report_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Field report not found")
    row.status = payload.status
    db.commit()
    db.refresh(row)
    return _field_report_out(row)


@app.delete("/api/v1/field-reports/{report_id}", status_code=204)
def delete_field_report(report_id: str, db: Session = Depends(get_db)):
    row = db.get(FieldReport, report_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Field report not found")
    db.delete(row)
    db.commit()
    return Response(status_code=204)


@app.get("/api/v1/routes", response_model=list[RouteOut])
def list_routes(origin: str | None = None, destination: str | None = None, db: Session = Depends(get_db)):
    query = select(Route)
    if origin:
        query = query.where(Route.origin.ilike(origin))
    if destination:
        query = query.where(Route.destination.ilike(destination))
    return db.scalars(query.order_by(Route.risk_score)).all()


@app.post("/api/v1/routes/analyse", response_model=list[RouteOut])
def analyse_routes(payload: RouteAnalysisRequest, db: Session = Depends(get_db)):
    query = select(Route).where(Route.origin.ilike(payload.origin), Route.destination.ilike(payload.destination))
    matches = db.scalars(query.order_by(Route.risk_score)).all()
    if not matches:
        # The demo seed contains sample routes for Guwahati–Imphal. Return those
        # route profiles for other requests while reflecting the requested pair.
        matches = db.scalars(select(Route).order_by(Route.risk_score)).all()
        return [{"id": route.id, "name": route.name, "origin": payload.origin, "destination": payload.destination, "distance": route.distance, "eta": route.eta, "risk_score": route.risk_score, "condition": route.condition, "incident_count": route.incident_count, "type": route.type, "delay": route.delay, "description": route.description} for route in matches]
    return matches


@app.get("/api/v1/dashboard/summary", response_model=DashboardSummary)
def dashboard_summary(db: Session = Depends(get_db)):
    vehicles = db.scalars(select(Vehicle)).all()
    incidents = db.scalars(select(Incident)).all()
    routes = db.scalars(select(Route)).all()
    deliveries = db.scalars(select(Delivery).order_by(Delivery.id)).all()
    alerts = db.scalars(select(Alert)).all()
    statuses = Counter(vehicle.status for vehicle in vehicles)
    active = [vehicle for vehicle in vehicles if vehicle.status in ("en_route", "delayed", "stopped")]
    completed = sum(row.on_time for row in deliveries)
    total_delivery_count = completed + sum(row.delayed + row.blocked for row in deliveries)
    type_labels = {"landslide": ("Landslide", "#dc2626"), "flood": ("Flood", "#f97316"), "road_block": ("Road Block", "#f59e0b"), "accident": ("Accident", "#3b82f6"), "infrastructure": ("Infrastructure", "#8b5cf6"), "conflict": ("Conflict", "#64748b")}
    incident_counts = Counter(row.type for row in incidents)
    incident_types = [IncidentTypeCount(type=type_labels[k][0], count=count, fill=type_labels[k][1]) for k, count in incident_counts.items() if k in type_labels]
    return DashboardSummary(
        active_vehicles=len(active), active_deliveries=len(active), blocked_roads=sum(1 for i in incidents if i.status != "resolved" and i.type in ("road_block", "landslide", "flood")),
        critical_incidents=sum(1 for i in incidents if i.severity == "critical" and i.status != "resolved"),
        high_risk_routes=sum(1 for r in routes if r.risk_score >= 60), total_vehicles=len(vehicles),
        on_time_deliveries=round(completed * 100 / total_delivery_count) if total_delivery_count else 0,
        avg_delay=round(sum(vehicle.delay for vehicle in active) / len(active)) if active else 0,
        vehicle_status_counts=dict(statuses), delivery_trend_data=deliveries, incidents_by_type=incident_types,
        unread_alerts=sum(1 for alert in alerts if not alert.read),
    )


@app.get("/api/v1/dashboard/gis-overview", response_model=GisOverview)
def gis_overview(db: Session = Depends(get_db)):
    vehicles = db.scalars(select(Vehicle)).all()
    incidents = list_incidents(db=db)
    return {"vehicles": vehicles, "incidents": incidents}

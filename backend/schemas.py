import re
from datetime import datetime
from typing import Literal

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


def to_camel(value: str) -> str:
    return re.sub(r"_([a-z])", lambda match: match.group(1).upper(), value)


class ApiModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


Severity = Literal["critical", "high", "medium", "low"]


class VehicleOut(ApiModel):
    id: str
    reg_no: str
    driver: str
    phone: str
    type: str
    status: str
    from_: str = Field(validation_alias=AliasChoices("origin", "from"), serialization_alias="from")
    to: str = Field(validation_alias=AliasChoices("destination", "to"))
    current_location: str
    lat: float
    lng: float
    cargo: str
    eta: str
    delay: int
    risk: Severity
    speed: int
    fuel: int
    progress: int
    last_update: str


class IncidentOut(ApiModel):
    id: str
    type: str
    title: str
    location: str
    district: str
    state: str
    lat: float
    lng: float
    severity: Severity
    reported_at: datetime
    reported_by: str
    description: str
    affected_routes: list[str]
    status: str


class AlertOut(ApiModel):
    id: str
    severity: Severity
    title: str
    message: str
    timestamp: datetime
    entity_type: str
    entity_id: str | None
    read: bool


class AlertUpdate(ApiModel):
    read: bool


class RouteOut(ApiModel):
    id: str
    name: str
    from_: str = Field(validation_alias=AliasChoices("origin", "from"), serialization_alias="from")
    to: str = Field(validation_alias=AliasChoices("destination", "to"))
    distance: int
    eta: int
    risk_score: int
    condition: str
    incidents: int = Field(validation_alias=AliasChoices("incident_count", "incidents"))
    type: str
    delay: int
    description: str


class RouteAnalysisRequest(ApiModel):
    origin: str = Field(min_length=1, max_length=100)
    destination: str = Field(min_length=1, max_length=100)
    vehicle_type: str = Field(default="truck", max_length=32)


class FieldReportCreate(ApiModel):
    type: str = Field(min_length=1, max_length=48)
    location: str = Field(min_length=1, max_length=180)
    district: str = Field(default="", max_length=100)
    state: str = Field(min_length=1, max_length=100)
    severity: Severity
    description: str = Field(min_length=1, max_length=5000)
    submitted_by: str = Field(default="Field Unit", max_length=120)
    image_url: str | None = Field(default=None, max_length=500)
    lat: float | None = Field(default=None, ge=-90, le=90)
    lng: float | None = Field(default=None, ge=-180, le=180)


class FieldReportOut(ApiModel):
    id: str
    type: str
    location: str
    district: str
    state: str
    severity: Severity
    submitted_by: str
    submitted_at: datetime
    description: str
    has_image: bool
    image_url: str | None
    lat: float | None
    lng: float | None
    status: str


class FieldReportStatusUpdate(ApiModel):
    status: Literal["open", "under_review", "acknowledged", "resolved"]


class GisOverview(ApiModel):
    vehicles: list[VehicleOut]
    incidents: list[IncidentOut]


class DeliveryTrend(ApiModel):
    day: str
    on_time: int
    delayed: int
    blocked: int


class IncidentTypeCount(ApiModel):
    type: str
    count: int
    fill: str


class DashboardSummary(ApiModel):
    active_vehicles: int
    active_deliveries: int
    blocked_roads: int
    critical_incidents: int
    high_risk_routes: int
    total_vehicles: int
    on_time_deliveries: int
    avg_delay: int
    vehicle_status_counts: dict[str, int]
    delivery_trend_data: list[DeliveryTrend]
    incidents_by_type: list[IncidentTypeCount]
    unread_alerts: int

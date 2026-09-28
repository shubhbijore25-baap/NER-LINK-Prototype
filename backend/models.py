from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[str] = mapped_column(String(24), primary_key=True)
    reg_no: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    driver: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str] = mapped_column(String(32), default="", nullable=False)
    type: Mapped[str] = mapped_column(String(32), nullable=False)
    status: Mapped[str] = mapped_column(String(24), nullable=False, index=True)
    origin: Mapped[str] = mapped_column(String(100), nullable=False)
    destination: Mapped[str] = mapped_column(String(100), nullable=False)
    current_location: Mapped[str] = mapped_column(String(160), nullable=False)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lng: Mapped[float] = mapped_column(Float, nullable=False)
    cargo: Mapped[str] = mapped_column(String(160), nullable=False)
    eta: Mapped[str] = mapped_column(String(64), nullable=False)
    delay: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    risk: Mapped[str] = mapped_column(String(16), nullable=False, index=True)
    speed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    fuel: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    progress: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_update: Mapped[str] = mapped_column(String(32), nullable=False)


class Incident(Base):
    __tablename__ = "incidents"

    id: Mapped[str] = mapped_column(String(24), primary_key=True)
    type: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    location: Mapped[str] = mapped_column(String(180), nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lng: Mapped[float] = mapped_column(Float, nullable=False)
    severity: Mapped[str] = mapped_column(String(16), nullable=False, index=True)
    reported_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, nullable=False)
    reported_by: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    affected_routes: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    status: Mapped[str] = mapped_column(String(24), default="active", nullable=False, index=True)


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[str] = mapped_column(String(24), primary_key=True)
    severity: Mapped[str] = mapped_column(String(16), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=utcnow, nullable=False)
    entity_type: Mapped[str] = mapped_column(String(24), nullable=False)
    entity_id: Mapped[str | None] = mapped_column(String(24))
    read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class Route(Base):
    __tablename__ = "routes"

    id: Mapped[str] = mapped_column(String(24), primary_key=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    origin: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    destination: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    distance: Mapped[int] = mapped_column(Integer, nullable=False)
    eta: Mapped[int] = mapped_column(Integer, nullable=False)
    risk_score: Mapped[int] = mapped_column(Integer, nullable=False)
    condition: Mapped[str] = mapped_column(String(24), nullable=False)
    incident_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    type: Mapped[str] = mapped_column(String(24), nullable=False)
    delay: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)


class Delivery(Base):
    __tablename__ = "deliveries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    day: Mapped[str] = mapped_column(String(16), nullable=False)
    on_time: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    delayed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    blocked: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class FieldReport(Base):
    __tablename__ = "field_reports"

    id: Mapped[str] = mapped_column(String(24), primary_key=True)
    type: Mapped[str] = mapped_column(String(48), nullable=False)
    location: Mapped[str] = mapped_column(String(180), nullable=False)
    district: Mapped[str] = mapped_column(String(100), default="", nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    severity: Mapped[str] = mapped_column(String(16), nullable=False, index=True)
    submitted_by: Mapped[str] = mapped_column(String(120), default="Field Unit", nullable=False)
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    has_image: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(500))
    lat: Mapped[float | None] = mapped_column(Float)
    lng: Mapped[float | None] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(24), default="open", nullable=False, index=True)

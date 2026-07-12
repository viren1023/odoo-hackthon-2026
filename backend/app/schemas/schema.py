from typing import Literal, Optional
from pydantic import BaseModel

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    role: Literal["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst", "fleet_manager", "dispatcher", "safety_officer", "financial_analyst"]

class VehicleData(BaseModel):
    uid: int
    Vname: str
    license_plate: str
    type: str
    capacity: int
    odometer: float
    acquisition_cost: float
    status: str


class UpdateVehicleStatus(BaseModel):
    license_plate: str
    status: str


class DriverData(BaseModel):
    uid: int
    name: str
    category: str
    license_number: str
    license_expiry_date: str
    contact: str

class UpdateDriverStatus(BaseModel):
    license_number: str
    status: str

class TripData(BaseModel):
    uid: int
    source: Optional[str] = None
    destination: Optional[str] = None
    vehicle_id: Optional[int] = None
    driver_id: Optional[int] = None
    cargo_weight: Optional[float] = None
    distance: Optional[float] = None
    status: Optional[str] = "Draft"

class UpdateTripStatus(BaseModel):
    trip_id: int
    status: str


class MaintenanceData(BaseModel):
    license_plate: str
    service_name: str
    cost: float
    service_date: str


class UpdateMaintenanceStatus(BaseModel):
    id: int
    status: str
from typing import Literal
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
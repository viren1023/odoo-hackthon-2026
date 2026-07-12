from pydantic import BaseModel

class UserData(BaseModel):
    email: str
    password: str
    role: str

class VehicleData(BaseModel):
    uid: int
    Vname: str
    license_plate: str
    type: str
    capacity: int
    status: str


class UpdateVehicleStatus(BaseModel):
    license_plate: str
    status: str
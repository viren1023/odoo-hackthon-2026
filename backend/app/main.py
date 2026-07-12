
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.schemas.schema import DriverData, MaintenanceData, TripData, UpdateDriverStatus, UpdateMaintenanceStatus, UserId, UserLogin, UserRegister, VehicleData,UpdateVehicleStatus, UpdateTripStatus
from app.api.routes import router as api_router
from app.core.config import settings
from app.api.auth import auth_regst,auth_login
from app.api.vehicle import get_all_vehicles, register_vehicle,update_vehicle_status
from app.api.driver import add_driver, get_all_drivers, update_driver_status
from app.api.trip import create_trip, get_available_drivers, get_available_vehicles, get_all_trips, update_trip_status
from app.api.maintenance import get_all_maintenance, register_maintenance, update_maintenance_status

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.post("/register")
async def register(response: Response, data: UserRegister):
    return await auth_regst(response, data)


@app.post("/login")
async def login_user(data: UserLogin, response: Response):
    return await auth_login(response, data)


@app.post("/vehicle_register")
async def vehicle_register(data: VehicleData, response: Response):
    return await register_vehicle(response, data)


@app.put("/vehicle_status")
async def vehicle_status(data: UpdateVehicleStatus, response: Response):
    return await update_vehicle_status(response, data)


@app.post("/vehicles")
async def vehicles(data: UserId, response: Response):
    return await get_all_vehicles(response, data)

@app.post("/driver_add")
async def driver(data: DriverData, response: Response):
    return await add_driver(response, data)

@app.put("/driver_status")
async def driver_status(data: UpdateDriverStatus, response: Response):
    return await update_driver_status(response, data)

@app.post("/drivers")
async def drivers(data: UserId, response: Response):
    return await get_all_drivers(response, data)

@app.post("/trip")
async def save_trip(data: TripData, response: Response):
    return await create_trip(response, data)


@app.get("/vehicles_available")
async def available_vehicles(response: Response):
    return await get_available_vehicles(response)


@app.get("/drivers_available")
async def available_drivers(response: Response):
    return await get_available_drivers(response)


@app.post("/get_trips")
async def get_trips(data: UserId, response: Response):
    return await get_all_trips(response, data)


@app.put("/trip_status")
async def trip_status(data: UpdateTripStatus, response: Response):
    return await update_trip_status(response, data)


@app.post("/maintenance/register")
async def maintenance_register(data: MaintenanceData, response: Response):
    return await register_maintenance(response, data)


@app.put("/maintenance/status")
async def maintenance_status(data: UpdateMaintenanceStatus, response: Response):
    return await update_maintenance_status(response, data)


@app.post("/maintenance")
async def maintenance(data: UserId, response: Response):
    return await get_all_maintenance(response, data)
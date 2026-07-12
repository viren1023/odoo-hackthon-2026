
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.schemas.schema import UserData,VehicleData,UpdateVehicleStatus
from app.api.routes import router as api_router
from app.core.config import settings
from app.api.auth import auth_regst,auth_login
from app.api.vehicle import register_vehicle,update_vehicle_status

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
async def register(response: Response, data: UserData):
    return await auth_regst(response, data)


@app.post("/login")
async def login_user(data: UserData, response: Response):
    return await auth_login(response, data)


@app.post("/vehicle_register")
async def vehicle_register(data: VehicleData, response: Response):
    return await register_vehicle(response, data)


@app.put("/vehicle_status")
async def vehicle_status(data: UpdateVehicleStatus, response: Response):
    return await update_vehicle_status(response, data)
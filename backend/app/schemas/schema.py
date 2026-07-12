from typing import Literal
from pydantic import BaseModel

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    role: Literal["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst", "fleet_manager", "dispatcher", "safety_officer", "financial_analyst"]
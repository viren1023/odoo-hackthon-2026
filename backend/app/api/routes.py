from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter()

@router.get("/health")
def check_health():
    """
    Health check endpoint.
    """
    return {
        "status": "healthy",
        "message": "Backend is running",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

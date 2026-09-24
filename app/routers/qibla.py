"""
Qibla Router for API_ISLAM.
Provides precise Qibla direction, compass bearing, and distance to Makkah.
"""
from fastapi import APIRouter, HTTPException, Query
from app.services.qibla_calculator import QiblaCalculator

router = APIRouter(prefix="/api/v1/qibla", tags=["Qibla Direction"])

@router.get("/calculate", summary="Calculate exact Qibla direction and distance to the Kaaba")
def calculate_qibla(
    latitude: float = Query(..., ge=-90, le=90, description="User Latitude (e.g. 36.8065 for Tunis)"),
    longitude: float = Query(..., ge=-180, le=180, description="User Longitude (e.g. 10.1815 for Tunis)")
):
    try:
        data = QiblaCalculator.calculate(lat=latitude, lng=longitude)
        return {
            "status": "success",
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Qibla calculation failed: {str(e)}")

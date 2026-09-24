"""
Prayer Times Router for API_ISLAM.
Provides calculation endpoints and available methods list.
"""
import os
import json
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from app.services.prayer_calculator import PrayerCalculator

router = APIRouter(prefix="/api/v1/prayer-times", tags=["Prayer Times"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "prayer_times")

@router.get("/methods", summary="Get all prayer calculation conventions")
def get_calculation_methods():
    methods_file = os.path.join(DATA_DIR, "methods.json")
    if os.path.exists(methods_file):
        with open(methods_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"methods": []}

@router.get("/calculate", summary="Calculate prayer times for given GPS coordinates and date")
def calculate_prayer_times(
    latitude: float = Query(..., ge=-90, le=90, description="Latitude (e.g. 36.8065 for Tunis)"),
    longitude: float = Query(..., ge=-180, le=180, description="Longitude (e.g. 10.1815 for Tunis)"),
    date: Optional[str] = Query(None, description="Date in YYYY-MM-DD format (defaults to today)"),
    timezone: Optional[float] = Query(1.0, description="Timezone offset from UTC in hours (e.g. 1 for GMT+1)"),
    method: Optional[str] = Query("EGYPT", description="Calculation method (MWL, ISNA, EGYPT, MAKKAH, KARACHI, TEHRAN, GULF)"),
    school: Optional[str] = Query("Shafi", description="Asr calculation school (Shafi / Hanafi)")
):
    try:
        result = PrayerCalculator.calculate(
            lat=latitude,
            lng=longitude,
            target_date=date,
            timezone_offset=timezone,
            method=method,
            asr_school=school
        )
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Calculation error: {str(e)}")

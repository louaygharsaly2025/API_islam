"""
Hijri Calendar and Islamic Occasions Router for API_ISLAM.
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from app.services.hijri_calendar import HijriCalendarService

router = APIRouter(prefix="/api/v1/hijri", tags=["Hijri Calendar & Events"])

@router.get("/today", summary="Get today's date in Gregorian and Hijri calendars")
def get_today_hijri(
    adjustment: Optional[int] = Query(0, description="Hijri adjustment in days (-2 to +2 for local moon sighting)")
):
    try:
        data = HijriCalendarService.convert_gregorian(adjustment_days=adjustment)
        return {
            "status": "success",
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/convert", summary="Convert any Gregorian date (YYYY-MM-DD) to Hijri")
def convert_date_to_hijri(
    date_str: str = Query(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Gregorian date in YYYY-MM-DD format"),
    adjustment: Optional[int] = Query(0, description="Hijri adjustment in days (-2 to +2)")
):
    try:
        data = HijriCalendarService.convert_gregorian(target_date=date_str, adjustment_days=adjustment)
        return {
            "status": "success",
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Conversion error: {str(e)}")

@router.get("/events", summary="Get Islamic events and holidays calendar for a given Hijri year")
def get_islamic_events(
    year: Optional[int] = Query(None, description="Hijri year (e.g. 1448). Defaults to current year.")
):
    try:
        data = HijriCalendarService.get_islamic_events(hijri_year=year)
        return {
            "status": "success",
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

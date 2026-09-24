"""
Live Quran Radios Router for API_ISLAM.
"""
import os
import json
from typing import Optional
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/api/v1/radios", tags=["Live Quran Radios"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "radios")

def load_json(filepath):
    if not os.path.exists(filepath):
        return None
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("", summary="Get all live Islamic and Quran streaming radio stations")
def get_radios(category: Optional[str] = Query(None, description="Filter: live_station, reciter, adhkar, educational")):
    radios_file = os.path.join(DATA_DIR, "radios.json")
    data = load_json(radios_file)
    if not data:
        raise HTTPException(status_code=500, detail="Radio streams data not found")
    
    radios = data.get("radios", [])
    if category:
        radios = [r for r in radios if r.get("category", "").lower() == category.lower()]
        
    return {
        "status": "success",
        "count": len(radios),
        "data": radios
    }

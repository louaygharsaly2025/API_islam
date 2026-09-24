"""
Asmaul Husna (99 Names of Allah) Router for API_ISLAM.
"""
import os
import json
import random
from typing import Optional
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/api/v1/asmaul-husna", tags=["99 Names of Allah"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "names_of_allah")

def load_json(filepath):
    if not os.path.exists(filepath):
        return None
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("", summary="Get all 99 Names of Allah with meanings and translations")
def get_all_names():
    data = load_json(os.path.join(DATA_DIR, "names.json"))
    if not data:
        raise HTTPException(status_code=500, detail="Names data not found")
    return {
        "status": "success",
        "count": len(data.get("names", [])),
        "data": data.get("names", [])
    }

@router.get("/random", summary="Get a random Name of Allah for daily reflection")
def get_random_name():
    data = load_json(os.path.join(DATA_DIR, "names.json")) or {}
    names = data.get("names", [])
    if not names:
        raise HTTPException(status_code=404, detail="No names available")
    return {
        "status": "success",
        "data": random.choice(names)
    }

@router.get("/{name_id}", summary="Get a specific Name of Allah by ID (1-99)")
def get_name_by_id(name_id: int):
    if name_id < 1 or name_id > 99:
        raise HTTPException(status_code=400, detail="Name ID must be between 1 and 99")
    
    data = load_json(os.path.join(DATA_DIR, "names.json")) or {}
    names = data.get("names", [])
    found = next((n for n in names if n["id"] == name_id), None)
    
    if not found:
        raise HTTPException(status_code=404, detail="Name not found")
        
    return {
        "status": "success",
        "data": found
    }

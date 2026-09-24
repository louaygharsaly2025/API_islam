"""
Duas and Ruqyah Router for API_ISLAM.
"""
import os
import json
import random
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/v1/duas", tags=["Duas & Ruqyah"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "duas")

def load_json(filepath):
    if not os.path.exists(filepath):
        return None
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/rabbana", summary="Get the 40 Rabbana Duas from the Holy Quran")
def get_rabbana_duas():
    data = load_json(os.path.join(DATA_DIR, "rabbana.json"))
    if not data:
        raise HTTPException(status_code=500, detail="Rabbana duas not found")
    return {
        "status": "success",
        "count": len(data.get("rabbana_duas", [])),
        "data": data.get("rabbana_duas", [])
    }

@router.get("/ruqyah", summary="Get Ruqyah Shariah verses and prophetic supplications")
def get_ruqyah():
    data = load_json(os.path.join(DATA_DIR, "ruqyah.json"))
    if not data:
        raise HTTPException(status_code=500, detail="Ruqyah data not found")
    return {
        "status": "success",
        "count": len(data.get("ruqyah", [])),
        "data": data.get("ruqyah", [])
    }

@router.get("/random", summary="Get a random Quranic Dua")
def get_random_dua():
    data = load_json(os.path.join(DATA_DIR, "rabbana.json")) or {}
    duas = data.get("rabbana_duas", [])
    if not duas:
        raise HTTPException(status_code=404, detail="No duas available")
    return {
        "status": "success",
        "data": random.choice(duas)
    }

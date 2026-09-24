"""
Quran Router for API_ISLAM.
Provides endpoints to access Surahs list, single Surah, Ayahs search, reciters.
"""
import os
import json
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/api/v1/quran", tags=["Quran"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "quran")

def load_json(filepath):
    if not os.path.exists(filepath):
        return None
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/surahs", summary="Get list of all 114 Surahs")
def get_surahs(revelation_type: Optional[str] = Query(None, description="Filter by Meccan or Medinan")):
    surahs = load_json(os.path.join(DATA_DIR, "surahs_info.json"))
    if not surahs:
        raise HTTPException(status_code=500, detail="Surahs metadata not found")
    if revelation_type:
        surahs = [s for s in surahs if s.get("revelation_type", "").lower() == revelation_type.lower()]
    return {
        "status": "success",
        "count": len(surahs),
        "data": surahs
    }

@router.get("/surah/{surah_id}", summary="Get complete Surah by ID/Number (1-114)")
def get_surah(surah_id: int):
    if surah_id < 1 or surah_id > 114:
        raise HTTPException(status_code=400, detail="Surah number must be between 1 and 114")
    
    surah_file = os.path.join(DATA_DIR, "surahs", f"{surah_id}.json")
    surah_data = load_json(surah_file)
    
    if not surah_data:
        # Fallback to info metadata if full text not downloaded yet
        all_info = load_json(os.path.join(DATA_DIR, "surahs_info.json")) or []
        found = next((s for s in all_info if s["number"] == surah_id), None)
        if found:
            return {
                "status": "partial_data",
                "message": "Full ayat data can be synced via scripts/download_quran.py",
                "data": found
            }
        raise HTTPException(status_code=404, detail="Surah data not found")
        
    return {
        "status": "success",
        "data": surah_data
    }

@router.get("/search", summary="Search in Quran verses")
def search_verses(q: str = Query(..., min_length=2, description="Search query in Arabic or English")):
    results = []
    surahs_dir = os.path.join(DATA_DIR, "surahs")
    if os.path.exists(surahs_dir):
        for file in os.listdir(surahs_dir):
            if file.endswith(".json"):
                surah = load_json(os.path.join(surahs_dir, file))
                if surah and "verses" in surah:
                    for ayah in surah["verses"]:
                        match_ar = q in ayah.get("text_uthmani", "") or q in ayah.get("text_simple", "")
                        match_en = q.lower() in ayah.get("translation_en", "").lower()
                        if match_ar or match_en:
                            results.append({
                                "surah_number": surah["number"],
                                "surah_name": surah["name_arabic"],
                                "surah_english": surah["name_english"],
                                "ayah": ayah
                            })
    return {
        "status": "success",
        "query": q,
        "count": len(results),
        "results": results
    }

@router.get("/reciters", summary="Get list of available Quran Reciters & audio formats")
def get_reciters():
    reciters_file = os.path.join(DATA_DIR, "audio", "reciters.json")
    reciters = load_json(reciters_file) or []
    return {
        "status": "success",
        "count": len(reciters),
        "data": reciters
    }

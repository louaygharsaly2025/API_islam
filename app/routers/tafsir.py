"""
Tafsir Router for API_ISLAM.
Provides Tafsir books catalog and Ayah/Surah explanations.
"""
import os
import json
from typing import Optional
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/api/v1/tafsir", tags=["Quran Tafsir"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "tafsir")

def load_json(filepath):
    if not os.path.exists(filepath):
        return None
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/books", summary="List all available Tafsir books")
def get_tafsir_books():
    books_file = os.path.join(DATA_DIR, "books.json")
    data = load_json(books_file)
    if not data:
        raise HTTPException(status_code=500, detail="Tafsir catalog not found")
    return {
        "status": "success",
        "count": len(data.get("tafsir_books", [])),
        "data": data.get("tafsir_books", [])
    }

@router.get("/{tafsir_id}/surah/{surah_number}", summary="Get Tafsir for an entire Surah")
def get_surah_tafsir(tafsir_id: str, surah_number: int):
    if surah_number < 1 or surah_number > 114:
        raise HTTPException(status_code=400, detail="Surah number must be between 1 and 114")
    
    surah_file = os.path.join(DATA_DIR, tafsir_id.lower(), f"{surah_number}.json")
    data = load_json(surah_file)
    
    if not data:
        raise HTTPException(
            status_code=404, 
            detail=f"Tafsir '{tafsir_id}' for Surah {surah_number} is not cached locally. Run scripts/download_tafsir.py to sync."
        )
    return {
        "status": "success",
        "data": data
    }

@router.get("/{tafsir_id}/ayah/{surah_number}/{ayah_number}", summary="Get Tafsir for a specific Ayah")
def get_ayah_tafsir(tafsir_id: str, surah_number: int, ayah_number: int):
    surah_file = os.path.join(DATA_DIR, tafsir_id.lower(), f"{surah_number}.json")
    data = load_json(surah_file)
    
    if not data:
        raise HTTPException(status_code=404, detail=f"Tafsir data not available for Surah {surah_number}")
    
    ayahs = data.get("ayahs", [])
    found = next((a for a in ayahs if a.get("ayah_number") == ayah_number), None)
    
    if not found:
        raise HTTPException(status_code=404, detail=f"Ayah {ayah_number} not found in Tafsir")
        
    return {
        "status": "success",
        "tafsir_id": tafsir_id,
        "surah_number": surah_number,
        "ayah_number": ayah_number,
        "tafsir_text": found.get("text")
    }

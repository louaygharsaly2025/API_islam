"""
Hadith Router for API_ISLAM.
Provides endpoints for collections, individual hadiths, and search.
"""
import os
import json
import random
from typing import Optional
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/api/v1/hadith", tags=["Hadith"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "hadith")

def load_json(filepath):
    if not os.path.exists(filepath):
        return None
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/collections", summary="Get list of available Hadith collections")
def get_collections():
    collections = [
        {"id": "nawawi40", "name_ar": "الأربعون النووية", "name_en": "An-Nawawi 40 Hadiths", "author": "Imam An-Nawawi"},
        {"id": "bukhari", "name_ar": "صحيح البخاري", "name_en": "Sahih al-Bukhari", "author": "Imam Al-Bukhari"},
        {"id": "muslim", "name_ar": "صحيح مسلم", "name_en": "Sahih Muslim", "author": "Imam Muslim"},
        {"id": "riyad_salihin", "name_ar": "رياض الصالحين", "name_en": "Riyad as-Salihin", "author": "Imam An-Nawawi"}
    ]
    return {
        "status": "success",
        "count": len(collections),
        "data": collections
    }

@router.get("/collection/{collection_id}", summary="Get Hadiths by collection ID (e.g. nawawi40)")
def get_collection(collection_id: str):
    file_path = os.path.join(DATA_DIR, f"{collection_id.lower()}.json")
    data = load_json(file_path)
    if not data:
        raise HTTPException(status_code=404, detail=f"Collection '{collection_id}' not found in local datasets")
    return {
        "status": "success",
        "data": data
    }

@router.get("/random", summary="Get a random Hadith")
def get_random_hadith():
    all_hadiths = []
    if os.path.exists(DATA_DIR):
        for file in os.listdir(DATA_DIR):
            if file.endswith(".json"):
                col = load_json(os.path.join(DATA_DIR, file))
                if col and "hadiths" in col:
                    for h in col["hadiths"]:
                        h_copy = dict(h)
                        h_copy["collection"] = col.get("title_ar")
                        all_hadiths.append(h_copy)
    if not all_hadiths:
        raise HTTPException(status_code=404, detail="No hadiths available")
    
    return {
        "status": "success",
        "data": random.choice(all_hadiths)
    }

@router.get("/search", summary="Search in Hadith texts")
def search_hadiths(q: str = Query(..., min_length=2, description="Keywords in Arabic or English")):
    matches = []
    if os.path.exists(DATA_DIR):
        for file in os.listdir(DATA_DIR):
            if file.endswith(".json"):
                col = load_json(os.path.join(DATA_DIR, file))
                if col and "hadiths" in col:
                    for h in col["hadiths"]:
                        ar_match = q in h.get("arabic_text", "") or q in h.get("narrator", "")
                        en_match = q.lower() in h.get("english_text", "").lower()
                        if ar_match or en_match:
                            matches.append({
                                "collection_id": col.get("collection_id"),
                                "collection_title": col.get("title_ar"),
                                "hadith": h
                            })
    return {
        "status": "success",
        "query": q,
        "count": len(matches),
        "results": matches
    }

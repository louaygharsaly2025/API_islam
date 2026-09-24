"""
Adhkar Router for API_ISLAM.
Provides endpoints for morning, evening, sleep, and post-prayer adhkar, plus random daily dhikr.
"""
import os
import json
import random
from typing import Optional
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/v1/adhkar", tags=["Adhkar"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "adhkar")

def load_json(filepath):
    if not os.path.exists(filepath):
        return None
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/categories", summary="Get all available Adhkar categories")
def get_categories():
    categories_file = os.path.join(DATA_DIR, "categories.json")
    categories = load_json(categories_file) or []
    return {
        "status": "success",
        "count": len(categories),
        "data": categories
    }

@router.get("/category/{category_id}", summary="Get Adhkar by category ID (morning, evening, sleep, after_prayer)")
def get_adhkar_by_category(category_id: str):
    file_path = os.path.join(DATA_DIR, f"{category_id.lower()}.json")
    data = load_json(file_path)
    if not data:
        raise HTTPException(status_code=404, detail=f"Adhkar category '{category_id}' not found")
    return {
        "status": "success",
        "data": data
    }

@router.get("/random", summary="Get a random Dhikr from all categories")
def get_random_dhikr():
    all_items = []
    if os.path.exists(DATA_DIR):
        for file in os.listdir(DATA_DIR):
            if file.endswith(".json") and file != "categories.json":
                cat_data = load_json(os.path.join(DATA_DIR, file))
                if cat_data and "items" in cat_data:
                    for item in cat_data["items"]:
                        item_copy = dict(item)
                        item_copy["category_name"] = cat_data.get("category_name_ar")
                        all_items.append(item_copy)
    if not all_items:
        raise HTTPException(status_code=404, detail="No adhkar found")
    
    chosen = random.choice(all_items)
    return {
        "status": "success",
        "data": chosen
    }

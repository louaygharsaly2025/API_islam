"""
Mushaf Router for API_ISLAM.
Provides printed Mushaf page images, editions (Madinah, Tajweed, Warsh, Qaloon, Shamerly), and Riwayat.
"""
import os
import json
from typing import Optional
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/api/v1/mushaf", tags=["Printed Mushaf & Riwayat"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "mushaf")

def load_json(filepath):
    if not os.path.exists(filepath):
        return None
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/editions", summary="List all available printed Mushaf editions")
def get_mushaf_editions():
    data = load_json(os.path.join(DATA_DIR, "editions.json"))
    if not data:
        raise HTTPException(status_code=500, detail="Editions metadata not found")
    return {
        "status": "success",
        "count": len(data.get("editions", [])),
        "data": data.get("editions", [])
    }

@router.get("/riwayat", summary="List all authentic Qira'at (Ten readings) and 20 Riwayat")
def get_riwayat():
    data = load_json(os.path.join(DATA_DIR, "riwayat.json"))
    if not data:
        raise HTTPException(status_code=500, detail="Riwayat metadata not found")
    return {
        "status": "success",
        "data": data.get("qiraat", [])
    }

@router.get("/page/{page_number}", summary="Get High-Resolution image URL and metadata for a specific Mushaf page")
def get_mushaf_page(
    page_number: int,
    edition: Optional[str] = Query("quran-hafs-madinah", description="Edition ID (e.g. quran-hafs-madinah, quran-tajweed-color, quran-warsh-madinah, quran-qaloon-madinah, quran-shamerly)")
):
    editions_data = load_json(os.path.join(DATA_DIR, "editions.json")) or {}
    editions = editions_data.get("editions", [])
    
    selected_edition = next((e for e in editions if e["id"] == edition), None)
    if not selected_edition:
        raise HTTPException(status_code=404, detail=f"Edition '{edition}' not found")
    
    max_pages = selected_edition.get("total_pages", 604)
    if page_number < 1 or page_number > max_pages:
        raise HTTPException(status_code=400, detail=f"Page number must be between 1 and {max_pages} for this edition")
    
    # Format page number string (e.g. 001 or 1 depending on template)
    page_str_3 = f"{page_number:03d}"
    page_str = str(page_number)
    
    img_template = selected_edition.get("image_url_template", "")
    page_url = img_template.replace("{page}", page_str_3 if "001" in img_template else page_str)
    
    svg_template = selected_edition.get("svg_url_template")
    svg_url = svg_template.replace("{page}", page_str_3) if svg_template else None

    return {
        "status": "success",
        "edition": selected_edition["name_ar"],
        "riwayah": selected_edition["riwayah"],
        "page_number": page_number,
        "total_pages": max_pages,
        "image_url": page_url,
        "svg_url": svg_url
    }

"""
Mushaf Router for API_ISLAM.
Provides printed Mushaf page images, editions (Madinah, Tajweed, Warsh, Qaloon, Shamerly),
Qira'at & Riwayat, and complete 604 printed page layout mapping.
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

@router.get("/page/{page_number}", summary="Get High-Resolution image URL and book layout metadata for a specific Mushaf page")
def get_mushaf_page(
    page_number: int,
    edition: Optional[str] = Query("quran-hafs-madinah", description="Edition ID: quran-hafs-madinah, quran-tajweed-color, quran-warsh-madinah, quran-qaloon-madinah, quran-shamerly, quran-douri, quran-shuba, quran-soosi")
):
    editions_data = load_json(os.path.join(DATA_DIR, "editions.json")) or {}
    editions = editions_data.get("editions", [])
    
    selected_edition = next((e for e in editions if e["id"] == edition), None)
    if not selected_edition:
        raise HTTPException(status_code=404, detail=f"Edition '{edition}' not found")
    
    max_pages = selected_edition.get("total_pages", 604)
    if page_number < 1 or page_number > max_pages:
        raise HTTPException(status_code=400, detail=f"Page number must be between 1 and {max_pages} for this edition")
    
    # Load 604 page mapping
    pages_mapping = load_json(os.path.join(DATA_DIR, "pages_mapping.json")) or []
    page_meta = next((p for p in pages_mapping if p["page_number"] == page_number), None)
    
    page_str_3 = f"{page_number:03d}"
    page_str = str(page_number)
    
    img_template = selected_edition.get("image_url_template", "")
    page_url = img_template.replace("{page}", page_str_3 if "001" in img_template else page_str)
    
    svg_template = selected_edition.get("svg_url_template")
    svg_url = svg_template.replace("{page}", page_str_3) if svg_template else None

    # Alternate mirror URLs for high reliability
    backup_url = f"https://cdn.islamic.network/quran/images/high-resolution/{page_number}.png"

    return {
        "status": "success",
        "edition_id": selected_edition["id"],
        "edition_name": selected_edition["name_ar"],
        "riwayah": selected_edition["riwayah"],
        "publisher": selected_edition.get("publisher"),
        "page_number": page_number,
        "total_pages": max_pages,
        "prev_page": page_number - 1 if page_number > 1 else None,
        "next_page": page_number + 1 if page_number < max_pages else None,
        "layout": {
            "side": page_meta.get("layout_side") if page_meta else ("right" if page_number % 2 != 0 else "left"),
            "is_right_page": page_meta.get("is_right_page") if page_meta else (page_number % 2 != 0)
        },
        "location": {
            "juz": page_meta.get("juz") if page_meta else 1,
            "hizb": page_meta.get("hizb") if page_meta else 1,
            "surah_number": page_meta.get("surah_number") if page_meta else 1,
            "surah_name_ar": page_meta.get("surah_name_ar") if page_meta else "الفاتحة"
        },
        "media": {
            "image_url": page_url,
            "backup_image_url": backup_url,
            "svg_url": svg_url
        }
    }

@router.get("/surah/{surah_number}/page", summary="Get the starting printed page for a given Surah")
def get_surah_start_page(surah_number: int):
    if surah_number < 1 or surah_number > 114:
        raise HTTPException(status_code=400, detail="Surah number must be between 1 and 114")
    
    start_pages = load_json(os.path.join(DATA_DIR, "surah_start_pages.json")) or {}
    page = start_pages.get(str(surah_number)) or start_pages.get(surah_number)
    
    if not page:
        raise HTTPException(status_code=404, detail="Surah start page not found")
        
    return {
        "status": "success",
        "surah_number": surah_number,
        "start_page": page
    }

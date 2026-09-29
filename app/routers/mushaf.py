"""
Mushaf Router for API_ISLAM.
Provides printed Mushaf page images (Hafs, Warsh, Tajweed), Qira'at editions,
and 604 printed page layout mapping with direct local image serving.
"""
import os
import json
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Response
from fastapi.responses import FileResponse, RedirectResponse

router = APIRouter(prefix="/api/v1/mushaf", tags=["Printed Mushaf & Riwayat"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data", "mushaf")
STATIC_IMAGES_DIR = os.path.join(BASE_DIR, "static", "images", "mushaf")

def load_json(filepath):
    if not os.path.exists(filepath):
        return None
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/editions", summary="List all available printed Mushaf editions")
def get_mushaf_editions():
    data = load_json(os.path.join(DATA_DIR, "editions.json"))
    if not data:
        return {
            "status": "success",
            "data": [
                {"id": "hafs", "name_ar": "مصحف المدينة النبوية (رواية حفص)", "riwayah": "حفص عن عاصم", "total_pages": 604, "local_available": True},
                {"id": "warsh", "name_ar": "مصحف المدينة النبوية (رواية ورش)", "riwayah": "ورش عن نافع", "total_pages": 604, "local_available": True},
                {"id": "tajweed", "name_ar": "مصحف التجويد الملون", "riwayah": "حفص عن عاصم (تجويد)", "total_pages": 604, "local_available": True}
            ]
        }
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

@router.get("/page/{page_number}/image", summary="Stream high-resolution Mushaf page image directly from local storage")
def get_mushaf_page_image(
    page_number: int,
    edition: str = Query("hafs", description="Edition: hafs, warsh, tajweed")
):
    if page_number < 1 or page_number > 604:
        raise HTTPException(status_code=400, detail="Page number must be between 1 and 604")

    edition_folder = edition.lower().replace("quran-", "").replace("-madinah", "").replace("-color", "")
    
    # Check possible local image paths
    candidates = [
        os.path.join(STATIC_IMAGES_DIR, edition_folder, f"{page_number}.png"),
        os.path.join(STATIC_IMAGES_DIR, edition_folder, f"{page_number}.jpg"),
        os.path.join(STATIC_IMAGES_DIR, edition_folder, f"{page_number:03d}.png"),
        os.path.join(STATIC_IMAGES_DIR, edition_folder, f"{page_number:03d}.jpg"),
        os.path.join(STATIC_IMAGES_DIR, "hafs", f"{page_number}.png") # Fallback to hafs
    ]

    for candidate in candidates:
        if os.path.exists(candidate):
            media_type = "image/png" if candidate.endswith(".png") else "image/jpeg"
            return FileResponse(
                path=candidate,
                media_type=media_type,
                headers={"Cache-Control": "public, max-age=31536000, immutable"}
            )

    # Fallback to high-resolution CDN redirect
    cdn_url = f"https://cdn.islamic.network/quran/images/high-resolution/{page_number}.png"
    return RedirectResponse(url=cdn_url, status_code=307)


@router.get("/page/{page_number}", summary="Get High-Resolution image URL and book layout metadata for a specific Mushaf page")
def get_mushaf_page(
    page_number: int,
    edition: Optional[str] = Query("hafs", description="Edition: hafs, warsh, tajweed, quran-hafs-madinah, quran-tajweed-color, quran-warsh-madinah")
):
    if page_number < 1 or page_number > 604:
        raise HTTPException(status_code=400, detail="Page number must be between 1 and 604")
    
    # Load 604 page mapping
    pages_mapping = load_json(os.path.join(DATA_DIR, "pages_mapping.json")) or []
    page_meta = next((p for p in pages_mapping if p["page_number"] == page_number), None)
    
    norm_edition = edition.lower().replace("quran-", "").replace("-madinah", "").replace("-color", "")

    local_image_url = f"/api/v1/mushaf/page/{page_number}/image?edition={norm_edition}"
    cdn_backup_url = f"https://cdn.islamic.network/quran/images/high-resolution/{page_number}.png"

    return {
        "status": "success",
        "edition": norm_edition,
        "page_number": page_number,
        "total_pages": 604,
        "prev_page": page_number - 1 if page_number > 1 else None,
        "next_page": page_number + 1 if page_number < 604 else None,
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
            "image_url": local_image_url,
            "local_image_endpoint": local_image_url,
            "cdn_backup_url": cdn_backup_url
        }
    }

"""
Comprehensive Quran Router for API_ISLAM.
Supports King Fahd Glorious Quran Printing Complex (KFGQPC) datasets
for 9 authentic Qira'at/Riwayat (Hafs, Warsh, Qaloon, Shouba, Doori, Soosi, Bazzi, Qumbul, Hafs-Smart).
"""
import os
import json
import re
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/api/v1/quran", tags=["Holy Quran & Qiraat"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KFGQPC_DIR = os.path.join(BASE_DIR, "data", "quran_kfgqpc")
LEGACY_QURAN_DIR = os.path.join(BASE_DIR, "data", "quran")

# In-memory caches for high-performance sub-millisecond responses
_EDITIONS_CACHE: Dict[str, List[Dict[str, Any]]] = {}
_SURAHS_INFO_CACHE: List[Dict[str, Any]] = []

AVAILABLE_EDITIONS = {
    "hafs": {
        "id": "hafs",
        "name_ar": "رواية حفص عن عاصم",
        "name_en": "Hafs 'an 'Aasim",
        "version": "v18",
        "font_family": "hafs18",
        "font_file": "/static/fonts/hafs.18.woff2",
        "file": "hafs.json"
    },
    "hafs-smart": {
        "id": "hafs-smart",
        "name_ar": "رواية حفص للأجهزة الذكية",
        "name_en": "Hafs for Smart Devices",
        "version": "v8",
        "font_family": "hafssmart8",
        "font_file": "/static/fonts/hafssmart.8.woff2",
        "file": "hafs-smart.json"
    },
    "warsh": {
        "id": "warsh",
        "name_ar": "رواية ورش عن نافع",
        "name_en": "Warsh 'an Nafi'",
        "version": "v10",
        "font_family": "warsh10",
        "font_file": "/static/fonts/warsh.10.woff2",
        "file": "warsh.json"
    },
    "qaloon": {
        "id": "qaloon",
        "name_ar": "رواية قالون عن نافع",
        "name_en": "Qaloon 'an Nafi'",
        "version": "v10",
        "font_family": "qaloon10",
        "font_file": "/static/fonts/qaloon.10.woff2",
        "file": "qaloon.json"
    },
    "shouba": {
        "id": "shouba",
        "name_ar": "رواية شعبة عن عاصم",
        "name_en": "Shouba 'an 'Aasim",
        "version": "v8",
        "font_family": "shouba8",
        "font_file": "/static/fonts/shouba.8.woff2",
        "file": "shouba.json"
    },
    "doori": {
        "id": "doori",
        "name_ar": "رواية الدوري عن أبي عمرو",
        "name_en": "Al-Doori 'an Abi 'Amr",
        "version": "v9",
        "font_family": "doori9",
        "font_file": "/static/fonts/doori.9.woff2",
        "file": "doori.json"
    },
    "soosi": {
        "id": "soosi",
        "name_ar": "رواية السوسي عن أبي عمرو",
        "name_en": "Al-Soosi 'an Abi 'Amr",
        "version": "v9",
        "font_family": "soosi9",
        "font_file": "/static/fonts/soosi.9.woff2",
        "file": "soosi.json"
    },
    "bazzi": {
        "id": "bazzi",
        "name_ar": "رواية البزي عن ابن كثير",
        "name_en": "Al-Bazzi 'an Ibn Katheer",
        "version": "v7",
        "font_family": "bazzi7",
        "font_file": "/static/fonts/bazzi.7.woff2",
        "file": "bazzi.json"
    },
    "qumbul": {
        "id": "qumbul",
        "name_ar": "رواية قنبل عن ابن كثير",
        "name_en": "Qumbul 'an Ibn Katheer",
        "version": "v7",
        "font_family": "qumbul7",
        "font_file": "/static/fonts/qumbul.7.woff2",
        "file": "qumbul.json"
    }
}


def parse_page_number(page_val) -> int:
    if isinstance(page_val, int):
        return page_val
    if isinstance(page_val, str):
        page_str = page_val.strip()
        if "-" in page_str:
            try:
                return int(page_str.split("-")[0])
            except ValueError:
                return 1
        try:
            return int(page_str)
        except ValueError:
            return 1
    return 1


def parse_int_safe(val, default: int = 1) -> int:
    if val is None:
        return default
    if isinstance(val, int):
        return val
    try:
        return int(str(val).split("-")[0].strip())
    except (ValueError, IndexError):
        return default


def load_edition_data(edition_id: str = "hafs") -> List[Dict[str, Any]]:
    norm_id = edition_id.lower().strip()
    if norm_id not in AVAILABLE_EDITIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Edition '{edition_id}' is not supported. Available: {list(AVAILABLE_EDITIONS.keys())}"
        )
    
    if norm_id in _EDITIONS_CACHE:
        return _EDITIONS_CACHE[norm_id]
    
    file_name = AVAILABLE_EDITIONS[norm_id]["file"]
    file_path = os.path.join(KFGQPC_DIR, file_name)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=500, detail=f"Dataset file for '{norm_id}' not found on server")
    
    with open(file_path, "r", encoding="utf-8") as f:
        raw_data = json.load(f)
        standardized = []
        for row in raw_data:
            s_num = parse_int_safe(row.get("sora") or row.get("sura_no", 1))
            name_ar = (row.get("sora_name_ar") or row.get("sura_name_ar", "")).strip()
            name_en = (row.get("sora_name_en") or row.get("sura_name_en", "")).strip()
            p_num = parse_page_number(row.get("page", 1))
            j_num = parse_int_safe(row.get("jozz", 1))
            a_num = parse_int_safe(row.get("aya_no", 1))
            text = row.get("aya_text", "")
            emlaey = row.get("aya_text_emlaey") or strip_tashkeel(text)
            
            standardized.append({
                "id": parse_int_safe(row.get("id"), len(standardized) + 1),
                "sora": s_num,
                "sura_no": s_num,
                "sora_name_ar": name_ar,
                "sura_name_ar": name_ar,
                "sora_name_en": name_en,
                "sura_name_en": name_en,
                "page": p_num,
                "page_raw": str(row.get("page", p_num)),
                "jozz": j_num,
                "line_start": parse_int_safe(row.get("line_start"), 1),
                "line_end": parse_int_safe(row.get("line_end"), 1),
                "aya_no": a_num,
                "aya_text": text,
                "aya_text_emlaey": emlaey
            })
            
        _EDITIONS_CACHE[norm_id] = standardized
        return standardized


def strip_tashkeel(text: str) -> str:
    """Removes Tashkeel and Quranic marks without changing letters."""
    if not text:
        return ""
    tashkeel_re = re.compile(r'[\u0617-\u061A\u064B-\u0652\u06D6-\u06ED\u0670]')
    return tashkeel_re.sub('', text).strip()


def normalize_arabic(text: str) -> str:
    """Normalize Arabic text for search matching."""
    if not text:
        return ""
    text = strip_tashkeel(text)
    # Normalize Alefs
    text = re.sub(r'[إأآٱ]', 'ا', text)
    text = re.sub(r'ى', 'ي', text)
    text = re.sub(r'ة', 'ه', text)
    return text.strip()


@router.get("/editions", summary="List all 9 available Quran Qiraat & Riwayat (KFGQPC)")
def get_editions():
    return {
        "status": "success",
        "source": "مجمع الملك فهد لطباعة المصحف الشريف (KFGQPC)",
        "count": len(AVAILABLE_EDITIONS),
        "data": list(AVAILABLE_EDITIONS.values())
    }


@router.get("/surahs", summary="Get list of all 114 Surahs with metadata")
def get_surahs(
    revelation_type: Optional[str] = Query(None, description="Filter by 'Meccan' or 'Medinan'")
):
    global _SURAHS_INFO_CACHE
    if not _SURAHS_INFO_CACHE:
        hafs_data = load_edition_data("hafs")
        surah_map = {}
        for row in hafs_data:
            s_num = row["sora"]
            if s_num not in surah_map:
                surah_map[s_num] = {
                    "number": s_num,
                    "name_ar": row["sora_name_ar"],
                    "name_en": row["sora_name_en"],
                    "start_page": row["page"],
                    "start_juz": row["jozz"],
                    "total_verses": 0
                }
            surah_map[s_num]["total_verses"] += 1

        # Augment with revelation type if legacy info exists
        legacy_file = os.path.join(LEGACY_QURAN_DIR, "surahs_info.json")
        legacy_info = {}
        if os.path.exists(legacy_file):
            try:
                with open(legacy_file, "r", encoding="utf-8") as f:
                    for s in json.load(f):
                        legacy_info[s["number"]] = s
            except Exception:
                pass

        surahs_list = []
        for s_num in sorted(surah_map.keys()):
            item = surah_map[s_num]
            if s_num in legacy_info:
                item["revelation_type"] = legacy_info[s_num].get("revelation_type", "Meccan")
                item["name_translation_en"] = legacy_info[s_num].get("name_english_translation", "")
            else:
                item["revelation_type"] = "Meccan"
            surahs_list.append(item)
        _SURAHS_INFO_CACHE = surahs_list

    res = _SURAHS_INFO_CACHE
    if revelation_type:
        res = [s for s in res if s.get("revelation_type", "").lower() == revelation_type.lower()]

    return {
        "status": "success",
        "count": len(res),
        "data": res
    }


@router.get("/surah/{surah_id}", summary="Get complete Surah verses by Surah ID (1-114) and Edition")
def get_surah(
    surah_id: int,
    edition: str = Query("hafs", description="Edition: hafs, warsh, qaloon, shouba, doori, soosi, bazzi, qumbul, hafs-smart")
):
    if surah_id < 1 or surah_id > 114:
        raise HTTPException(status_code=400, detail="Surah number must be between 1 and 114")

    data = load_edition_data(edition)
    verses = [row for row in data if row["sora"] == surah_id]
    
    if not verses:
        raise HTTPException(status_code=404, detail=f"Surah {surah_id} not found in edition '{edition}'")

    surah_meta = {
        "number": surah_id,
        "name_arabic": strip_tashkeel(verses[0]["sora_name_ar"]),
        "name_arabic_uthmani": verses[0]["sora_name_ar"],
        "name_english": verses[0]["sora_name_en"],
        "start_page": verses[0]["page"],
        "end_page": verses[-1]["page"],
        "start_juz": verses[0]["jozz"],
        "total_verses": len(verses),
        "edition": AVAILABLE_EDITIONS[edition.lower()],
        "verses": verses
    }

    return {
        "status": "success",
        "surah": surah_meta,
        "data": surah_meta
    }


@router.get("/ayah/{surah_id}/{ayah_no}", summary="Get a specific verse by Surah number and Ayah number")
def get_ayah(
    surah_id: int,
    ayah_no: int,
    edition: str = Query("hafs", description="Edition: hafs, warsh, qaloon, shouba, doori, soosi, bazzi, qumbul, hafs-smart")
):
    if surah_id < 1 or surah_id > 114:
        raise HTTPException(status_code=400, detail="Surah number must be between 1 and 114")

    data = load_edition_data(edition)
    verse = next((row for row in data if row["sora"] == surah_id and row["aya_no"] == ayah_no), None)
    
    if not verse:
        raise HTTPException(status_code=404, detail=f"Ayah {ayah_no} in Surah {surah_id} not found")

    return {
        "status": "success",
        "edition": AVAILABLE_EDITIONS[edition.lower()],
        "data": verse
    }


@router.get("/page/{page_number}", summary="Get all verses on a specific Mushaf page (1-604)")
def get_page_verses(
    page_number: int,
    edition: str = Query("hafs", description="Edition: hafs, warsh, qaloon, shouba, doori, soosi, bazzi, qumbul, hafs-smart")
):
    if page_number < 1 or page_number > 604:
        raise HTTPException(status_code=400, detail="Page number must be between 1 and 604")

    data = load_edition_data(edition)
    verses = [row for row in data if row["page"] == page_number]

    return {
        "status": "success",
        "page_number": page_number,
        "edition": AVAILABLE_EDITIONS[edition.lower()],
        "verses_count": len(verses),
        "data": verses
    }


@router.get("/juz/{juz_number}", summary="Get all verses in a specific Juz (1-30)")
def get_juz_verses(
    juz_number: int,
    edition: str = Query("hafs", description="Edition: hafs, warsh, qaloon, shouba, doori, soosi, bazzi, qumbul, hafs-smart")
):
    if juz_number < 1 or juz_number > 30:
        raise HTTPException(status_code=400, detail="Juz number must be between 1 and 30")

    data = load_edition_data(edition)
    verses = [row for row in data if row["jozz"] == juz_number]

    return {
        "status": "success",
        "juz_number": juz_number,
        "edition": AVAILABLE_EDITIONS[edition.lower()],
        "verses_count": len(verses),
        "data": verses
    }


@router.get("/search", summary="Search Quran text (Uthmanic and simplified Emlaey)")
def search_verses(
    q: str = Query(..., min_length=2, description="Search term in Arabic"),
    edition: str = Query("hafs", description="Edition: hafs, warsh, qaloon, shouba, doori, soosi, bazzi, qumbul, hafs-smart"),
    limit: int = Query(50, ge=1, le=200, description="Max results to return"),
    offset: int = Query(0, ge=0, description="Pagination offset")
):
    data = load_edition_data(edition)
    norm_query = normalize_arabic(q)
    results = []

    for row in data:
        text_emlaey = row.get("aya_text_emlaey", "")
        text_uthmani = row.get("aya_text", "")
        
        # Check direct or normalized match
        if q in text_emlaey or q in text_uthmani or norm_query in normalize_arabic(text_emlaey):
            results.append(row)

    paginated = results[offset:offset + limit]

    return {
        "status": "success",
        "query": q,
        "edition": AVAILABLE_EDITIONS[edition.lower()],
        "total_matches": len(results),
        "limit": limit,
        "offset": offset,
        "results": paginated
    }


@router.get("/reciters", summary="Get list of available Quran Reciters & audio stream links")
def get_reciters():
    reciters_file = os.path.join(LEGACY_QURAN_DIR, "audio", "reciters.json")
    reciters = []
    if os.path.exists(reciters_file):
        try:
            with open(reciters_file, "r", encoding="utf-8") as f:
                reciters = json.load(f)
        except Exception:
            pass
    
    if not reciters:
        # High quality default reciters
        reciters = [
            {"id": "mishari_al_afasy", "name_ar": "مشاري راشد العفاسي", "name_en": "Mishari Rashid Al-Afasy", "riwayah": "حفص عن عاصم", "server": "https://server8.mp3quran.net/afs"},
            {"id": "abdul_basit", "name_ar": "عبد الباسط عبد الصمد (مرتل)", "name_en": "Abdul Basit Abdul Samad", "riwayah": "حفص عن عاصم", "server": "https://server7.mp3quran.net/basit"},
            {"id": "mahmoud_al_husary", "name_ar": "محمود خليل الحصري", "name_en": "Mahmoud Khalil Al-Husary", "riwayah": "حفص عن عاصم", "server": "https://server13.mp3quran.net/husr"},
            {"id": "mohamed_siddiq_minshawi", "name_ar": "محمد صديق المنشاوي (مرتل)", "name_en": "Mohamed Siddiq Al-Minshawi", "riwayah": "حفص عن عاصم", "server": "https://server10.mp3quran.net/minsh"},
            {"id": "ali_al_hudhaify_qaloon", "name_ar": "علي بن عبد الرحمن الحذيفي", "name_en": "Ali Al-Hudhaify", "riwayah": "قالون عن نافع", "server": "https://server9.mp3quran.net/hthfi_qalon"},
            {"id": "yassin_al_jazairi_warsh", "name_ar": "ياسين الجزائري", "name_en": "Yassin Al-Jazaery", "riwayah": "ورش عن نافع", "server": "https://server11.mp3quran.net/jazaeri"}
        ]

    return {
        "status": "success",
        "count": len(reciters),
        "data": reciters
    }

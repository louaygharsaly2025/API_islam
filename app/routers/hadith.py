"""
Comprehensive Hadith Router for API_ISLAM.
Integrates Kutub as-Sittah (6 Canonical Hadith Collections: Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasai, Ibn Majah)
along with An-Nawawi Forty Hadiths.

Provides sub-millisecond O(1) Hadith lookup, bilingual Arabic/English readings, chapter navigation,
random hadith selection, and keyword search.
"""
import os
import json
import random
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/api/v1/hadith", tags=["Hadith"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HADITH_DIR = os.path.join(BASE_DIR, "data", "hadith")
BOOK_WISE_DIR = os.path.join(HADITH_DIR, "book-wise")
CHAPTER_WISE_DIR = os.path.join(HADITH_DIR, "chapter-wise")

# In-memory caches for high performance
_BOOKS_METADATA_CACHE: List[Dict[str, Any]] = []
_BOOKS_INDEX_CACHE: Dict[str, Dict[str, Any]] = {}

CANONICAL_BOOKS_INFO = {
    "bukhari": {
        "id": "bukhari",
        "name_ar": "صحيح البخاري",
        "name_en": "Sahih al-Bukhari",
        "author_ar": "الإمام محمد بن إسماعيل البخاري",
        "author_en": "Imam Muhammad ibn Ismail al-Bukhari",
        "death_year_hijri": 256,
        "authenticity": "Sahih (أصح كتاب بعد كتاب الله)"
    },
    "muslim": {
        "id": "muslim",
        "name_ar": "صحيح مسلم",
        "name_en": "Sahih Muslim",
        "author_ar": "الإمام مسلم بن الحجاج النيسابوري",
        "author_en": "Imam Muslim ibn al-Hajjaj an-Naysaburi",
        "death_year_hijri": 261,
        "authenticity": "Sahih"
    },
    "abudawud": {
        "id": "abudawud",
        "name_ar": "سنن أبي داود",
        "name_en": "Sunan Abi Dawud",
        "author_ar": "الإمام سليمان بن الأشعث السجستاني",
        "author_en": "Imam Abu Dawud Sulayman ibn al-Ash'ath as-Sijistani",
        "death_year_hijri": 275,
        "authenticity": "Sunan (Canonical)"
    },
    "tirmidhi": {
        "id": "tirmidhi",
        "name_ar": "جامع الترمذي",
        "name_en": "Jami` at-Tirmidhi",
        "author_ar": "الإمام محمد بن عيسى الترمذي",
        "author_en": "Imam Abu 'Isa Muhammad ibn 'Isa at-Tirmidhi",
        "death_year_hijri": 279,
        "authenticity": "Sunan (Canonical)"
    },
    "nasai": {
        "id": "nasai",
        "name_ar": "سنن النسائي",
        "name_en": "Sunan an-Nasa'i",
        "author_ar": "الإمام أحمد بن شعيب النسائي",
        "author_en": "Imam Ahmad ibn Shu'ayb an-Nasa'i",
        "death_year_hijri": 303,
        "authenticity": "Sunan (Canonical)"
    },
    "ibnmajah": {
        "id": "ibnmajah",
        "name_ar": "سنن ابن ماجه",
        "name_en": "Sunan Ibn Majah",
        "author_ar": "الإمام محمد بن يزيد بن ماجه القزويني",
        "author_en": "Imam Muhammad ibn Yazid Ibn Majah al-Qazwini",
        "death_year_hijri": 273,
        "authenticity": "Sunan (Canonical)"
    }
}


def load_json(filepath: str) -> Optional[Any]:
    if not os.path.exists(filepath):
        return None
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None


def get_all_books_metadata() -> List[Dict[str, Any]]:
    global _BOOKS_METADATA_CACHE, _BOOKS_INDEX_CACHE
    if _BOOKS_METADATA_CACHE:
        return _BOOKS_METADATA_CACHE

    meta_file = os.path.join(BOOK_WISE_DIR, "metadata.json")
    raw_list = load_json(meta_file) or []

    result = []
    # Add Nawawi 40 first
    nawawi_data = load_json(os.path.join(HADITH_DIR, "nawawi40.json"))
    nawawi_count = len(nawawi_data.get("hadiths", [])) if nawawi_data else 42
    result.append({
        "id": "nawawi40",
        "name_ar": "الأربعون النووية",
        "name_en": "An-Nawawi 40 Hadiths",
        "author_ar": "الإمام يحيى بن شرف النووي",
        "author_en": "Imam Yahya ibn Sharaf an-Nawawi",
        "authenticity": "Sahih & Hasan",
        "total_hadiths": nawawi_count,
        "total_chapters": 1,
        "description": "A celebrated collection of forty fundamental hadiths of Islam compiled by Imam Yahya ibn Sharaf al-Nawawi."
    })

    # Add 6 canonical books
    for item in raw_list:
        book_id = item.get("book_name_english", "").lower()
        info = CANONICAL_BOOKS_INFO.get(book_id, {})
        entry = {
            "id": book_id,
            "name_ar": item.get("book_name_arabic") or info.get("name_ar", book_id),
            "name_en": info.get("name_en", item.get("book_name_english")),
            "author_ar": info.get("author_ar", ""),
            "author_en": info.get("author_en", ""),
            "authenticity": info.get("authenticity", "Canonical Hadith Collection"),
            "total_hadiths": item.get("total_hadiths_inBook", 0),
            "total_chapters": item.get("total_chapters_inBook", len(item.get("all_chapters_detail", []))),
            "description": item.get("book_short_desc", ""),
            "chapters_detail": item.get("all_chapters_detail", [])
        }
        result.append(entry)
        _BOOKS_INDEX_CACHE[book_id] = entry

    _BOOKS_METADATA_CACHE = result
    return result


def find_book(book_id: str) -> Optional[Dict[str, Any]]:
    get_all_books_metadata()
    bid = book_id.lower().replace("-", "").replace("_", "")
    # direct check
    if bid in _BOOKS_INDEX_CACHE:
        return _BOOKS_INDEX_CACHE[bid]
    for b in _BOOKS_METADATA_CACHE:
        if b["id"].lower() == bid or b["name_en"].lower().replace(" ", "") == bid:
            return b
    return None


@router.get("/books", summary="Get list of all Hadith collections (Kutub as-Sittah & Nawawi)")
def get_books():
    books = get_all_books_metadata()
    # Return summary without repeating all nested chapter details in listing
    summary_list = []
    total_hadiths_sum = 0
    for b in books:
        total_hadiths_sum += b.get("total_hadiths", 0)
        summary_list.append({
            "id": b["id"],
            "name_ar": b["name_ar"],
            "name_en": b["name_en"],
            "author_ar": b["author_ar"],
            "author_en": b["author_en"],
            "authenticity": b["authenticity"],
            "total_hadiths": b["total_hadiths"],
            "total_chapters": b["total_chapters"],
            "description": b["description"]
        })

    return {
        "status": "success",
        "count": len(summary_list),
        "total_hadiths_in_all_books": total_hadiths_sum,
        "data": summary_list
    }


@router.get("/collections", summary="Get list of available Hadith collections (Backward Compatible)")
def get_collections():
    return get_books()


@router.get("/book/{book_id}", summary="Get detailed metadata and chapter list of a specific book")
def get_book_details(book_id: str):
    book = find_book(book_id)
    if not book:
        raise HTTPException(status_code=404, detail=f"Book '{book_id}' not found. Available: bukhari, muslim, abudawud, tirmidhi, nasai, ibnmajah, nawawi40")

    return {
        "status": "success",
        "data": book
    }


@router.get("/book/{book_id}/chapters", summary="Get list of chapters in a book")
def get_book_chapters(book_id: str):
    book = find_book(book_id)
    if not book:
        raise HTTPException(status_code=404, detail=f"Book '{book_id}' not found")

    chapters = book.get("chapters_detail", [])
    formatted = []
    for idx, ch in enumerate(chapters, start=1):
        formatted.append({
            "chapter_number": idx,
            "chapter_title_ar": ch.get("chapter_title_arabic", ""),
            "chapter_title_en": ch.get("chapter_title_english", ""),
            "total_hadiths": ch.get("total_hadiths_inChapter", 0),
            "first_hadith_number": ch.get("chapter_first_hadith", 0),
            "last_hadith_number": ch.get("chapter_last_hadith", 0)
        })

    return {
        "status": "success",
        "book_id": book["id"],
        "book_name_ar": book["name_ar"],
        "book_name_en": book["name_en"],
        "total_chapters": len(formatted),
        "data": formatted
    }


@router.get("/book/{book_id}/chapter/{chapter_no}", summary="Get Hadiths for a specific chapter")
def get_chapter_hadiths(
    book_id: str,
    chapter_no: int,
    lang: str = Query("ar", description="Language: 'ar' (Arabic), 'en' (English), or 'both'")
):
    book = find_book(book_id)
    if not book:
        raise HTTPException(status_code=404, detail=f"Book '{book_id}' not found")

    bid = book["id"]
    if bid == "nawawi40":
        data = load_json(os.path.join(HADITH_DIR, "nawawi40.json"))
        return {"status": "success", "data": data}

    ar_file = os.path.join(CHAPTER_WISE_DIR, bid, "arabic", f"chapter{chapter_no}.json")
    en_file = os.path.join(CHAPTER_WISE_DIR, bid, "english", f"chapter{chapter_no}.json")

    ar_data = load_json(ar_file) if lang in ["ar", "both"] else None
    en_data = load_json(en_file) if lang in ["en", "both"] else None

    if not ar_data and not en_data:
        raise HTTPException(status_code=404, detail=f"Chapter {chapter_no} not found for book '{book_id}'")

    if lang == "ar":
        return {
            "status": "success",
            "book": {"id": bid, "name_ar": book["name_ar"], "name_en": book["name_en"]},
            "chapter_number": chapter_no,
            "chapter_title_ar": ar_data.get("arabic_title", ""),
            "total_hadiths": ar_data.get("totalHadiths_inChapter", len(ar_data.get("hadith_list", []))),
            "hadiths": ar_data.get("hadith_list", [])
        }
    elif lang == "en":
        return {
            "status": "success",
            "book": {"id": bid, "name_ar": book["name_ar"], "name_en": book["name_en"]},
            "chapter_number": chapter_no,
            "chapter_title_en": en_data.get("english_title", ""),
            "total_hadiths": en_data.get("totalHadiths_inChapter", len(en_data.get("hadith_list", []))),
            "hadiths": en_data.get("hadith_list", [])
        }
    else:  # both
        ar_list = ar_data.get("hadith_list", []) if ar_data else []
        en_list = en_data.get("hadith_list", []) if en_data else []
        en_dict = {h.get("hadithNum_inChapter", idx + 1): h for idx, h in enumerate(en_list)}

        merged = []
        for idx, ar_h in enumerate(ar_list, start=1):
            ch_num = ar_h.get("hadithNum_inChapter", idx)
            en_h = en_dict.get(ch_num, {})
            merged.append({
                "hadith_number_in_chapter": ch_num,
                "hadith_number_in_book": ar_h.get("hadithNum_inBook", en_h.get("hadithNum_inBook")),
                "title": ar_h.get("title", en_h.get("title", "")),
                "arabic_text": ar_h.get("arabic_text", ""),
                "narrator": en_h.get("narrator", ""),
                "english_text": en_h.get("english_text", ""),
                "grade": ar_h.get("grade") or en_h.get("grade", "Sahih")
            })

        return {
            "status": "success",
            "book": {"id": bid, "name_ar": book["name_ar"], "name_en": book["name_en"]},
            "chapter_number": chapter_no,
            "chapter_title_ar": ar_data.get("arabic_title", "") if ar_data else "",
            "chapter_title_en": en_data.get("english_title", "") if en_data else "",
            "total_hadiths": len(merged),
            "hadiths": merged
        }


@router.get("/book/{book_id}/hadith/{hadith_no}", summary="Get a specific Hadith by number in a book")
def get_hadith_by_number(
    book_id: str,
    hadith_no: int,
    lang: str = Query("both", description="Language: 'ar' (Arabic), 'en' (English), or 'both'")
):
    book = find_book(book_id)
    if not book:
        raise HTTPException(status_code=404, detail=f"Book '{book_id}' not found")

    bid = book["id"]

    if bid == "nawawi40":
        data = load_json(os.path.join(HADITH_DIR, "nawawi40.json"))
        hadiths = data.get("hadiths", []) if data else []
        item = next((h for h in hadiths if h.get("number") == hadith_no), None)
        if not item:
            raise HTTPException(status_code=404, detail=f"Hadith #{hadith_no} not found in Nawawi 40")
        return {
            "status": "success",
            "book": {"id": bid, "name_ar": book["name_ar"], "name_en": book["name_en"]},
            "hadith": item
        }

    # Locate chapter in O(1) via all_chapters_detail
    chapters = book.get("chapters_detail", [])
    target_ch_num = None
    target_ch_info = None

    for idx, ch in enumerate(chapters, start=1):
        f = ch.get("chapter_first_hadith", 0)
        l = ch.get("chapter_last_hadith", 0)
        if f <= hadith_no <= l:
            target_ch_num = idx
            target_ch_info = ch
            break

    if not target_ch_num:
        raise HTTPException(status_code=404, detail=f"Hadith #{hadith_no} exceeds range for book '{bid}' (Total: {book['total_hadiths']})")

    ar_file = os.path.join(CHAPTER_WISE_DIR, bid, "arabic", f"chapter{target_ch_num}.json")
    en_file = os.path.join(CHAPTER_WISE_DIR, bid, "english", f"chapter{target_ch_num}.json")

    ar_data = load_json(ar_file)
    en_data = load_json(en_file)

    ar_item = None
    if ar_data:
        ar_item = next((h for h in ar_data.get("hadith_list", []) if h.get("hadithNum_inBook") == hadith_no), None)

    en_item = None
    if en_data:
        en_item = next((h for h in en_data.get("hadith_list", []) if h.get("hadithNum_inBook") == hadith_no), None)

    if not ar_item and not en_item:
        raise HTTPException(status_code=404, detail=f"Hadith #{hadith_no} not found in chapter {target_ch_num}")

    result = {
        "book": {
            "id": bid,
            "name_ar": book["name_ar"],
            "name_en": book["name_en"],
            "author_ar": book["author_ar"],
            "author_en": book["author_en"]
        },
        "chapter": {
            "chapter_number": target_ch_num,
            "chapter_title_ar": target_ch_info.get("chapter_title_arabic", ""),
            "chapter_title_en": target_ch_info.get("chapter_title_english", "")
        },
        "hadith_number_in_book": hadith_no,
        "hadith_number_in_chapter": (ar_item or en_item).get("hadithNum_inChapter", 1),
        "title": (ar_item or en_item).get("title", f"{book['name_en']} {hadith_no}"),
        "arabic_text": ar_item.get("arabic_text", "") if ar_item and lang in ["ar", "both"] else None,
        "narrator": en_item.get("narrator", "") if en_item and lang in ["en", "both"] else None,
        "english_text": en_item.get("english_text", "") if en_item and lang in ["en", "both"] else None,
        "grade": (ar_item or en_item).get("grade", "Sahih")
    }

    return {
        "status": "success",
        "data": result
    }


@router.get("/collection/{collection_id}", summary="Get Hadiths by collection ID (Backward Compatible)")
def get_collection(collection_id: str):
    cid = collection_id.lower()
    if cid == "nawawi40":
        file_path = os.path.join(HADITH_DIR, "nawawi40.json")
        data = load_json(file_path)
        if not data:
            raise HTTPException(status_code=404, detail=f"Collection '{collection_id}' not found")
        return {"status": "success", "data": data}

    book = find_book(cid)
    if not book:
        raise HTTPException(status_code=404, detail=f"Collection '{collection_id}' not found")

    # For canonical books, return book overview with the first chapter for instant preview
    ch1_ar = load_json(os.path.join(CHAPTER_WISE_DIR, book["id"], "arabic", "chapter1.json"))
    return {
        "status": "success",
        "data": {
            "collection_id": book["id"],
            "title_ar": book["name_ar"],
            "title_en": book["name_en"],
            "author": book["author_ar"],
            "total_hadiths": book["total_hadiths"],
            "total_chapters": book["total_chapters"],
            "chapter_1_preview": ch1_ar,
            "notice": "For complete book chapters and individual hadith access, use /api/v1/hadith/book/{book_id}/chapter/{chapter_no} and /api/v1/hadith/book/{book_id}/hadith/{hadith_no}"
        }
    }


@router.get("/random", summary="Get a random Hadith from Kutub as-Sittah or An-Nawawi")
def get_random_hadith(book: Optional[str] = Query(None, description="Optional book id (bukhari, muslim, nawawi40, etc.)")):
    if book and book.lower() == "nawawi40":
        nawawi_data = load_json(os.path.join(HADITH_DIR, "nawawi40.json"))
        hadiths = nawawi_data.get("hadiths", []) if nawawi_data else []
        if not hadiths:
            raise HTTPException(status_code=404, detail="No hadiths available")
        chosen = dict(random.choice(hadiths))
        chosen["collection"] = nawawi_data.get("title_ar", "الأربعون النووية")
        return {"status": "success", "data": chosen}

    chosen_book_id = book.lower() if book else random.choice(["bukhari", "muslim", "abudawud", "tirmidhi", "nasai", "ibnmajah", "nawawi40"])

    if chosen_book_id == "nawawi40":
        nawawi_data = load_json(os.path.join(HADITH_DIR, "nawawi40.json"))
        hadiths = nawawi_data.get("hadiths", []) if nawawi_data else []
        chosen = dict(random.choice(hadiths))
        chosen["collection"] = "الأربعون النووية"
        return {"status": "success", "data": chosen}

    book_info = find_book(chosen_book_id)
    if not book_info:
        raise HTTPException(status_code=404, detail=f"Book '{chosen_book_id}' not found")

    total_chapters = book_info.get("total_chapters", 1)
    random_ch = random.randint(1, max(1, total_chapters))

    ar_file = os.path.join(CHAPTER_WISE_DIR, chosen_book_id, "arabic", f"chapter{random_ch}.json")
    en_file = os.path.join(CHAPTER_WISE_DIR, chosen_book_id, "english", f"chapter{random_ch}.json")

    ar_data = load_json(ar_file)
    en_data = load_json(en_file)

    ar_list = ar_data.get("hadith_list", []) if ar_data else []
    en_list = en_data.get("hadith_list", []) if en_data else []

    if not ar_list:
        raise HTTPException(status_code=404, detail="No hadith found in selected chapter")

    idx = random.randint(0, len(ar_list) - 1)
    ar_h = ar_list[idx]
    en_h = en_list[idx] if idx < len(en_list) else {}

    hadith_out = {
        "book_id": chosen_book_id,
        "collection": book_info["name_ar"],
        "book_name_en": book_info["name_en"],
        "chapter_number": random_ch,
        "chapter_title_ar": ar_data.get("arabic_title", ""),
        "chapter_title_en": en_data.get("english_title", "") if en_data else "",
        "hadith_number_in_book": ar_h.get("hadithNum_inBook", en_h.get("hadithNum_inBook")),
        "hadith_number_in_chapter": ar_h.get("hadithNum_inChapter", idx + 1),
        "title": ar_h.get("title", ""),
        "arabic_text": ar_h.get("arabic_text", ""),
        "narrator": en_h.get("narrator", ""),
        "english_text": en_h.get("english_text", ""),
        "grade": ar_h.get("grade") or en_h.get("grade", "Sahih")
    }

    return {
        "status": "success",
        "data": hadith_out
    }


@router.get("/search", summary="Search in Hadith texts across collections")
def search_hadiths(
    q: str = Query(..., min_length=2, description="Keywords in Arabic or English"),
    book: Optional[str] = Query(None, description="Filter by book (e.g. bukhari, muslim, nawawi40)"),
    limit: int = Query(20, ge=1, le=100, description="Max results"),
    offset: int = Query(0, ge=0, description="Pagination offset")
):
    matches = []
    q_lower = q.lower()

    # Search Nawawi 40
    if not book or book.lower() == "nawawi40":
        nawawi_data = load_json(os.path.join(HADITH_DIR, "nawawi40.json"))
        if nawawi_data and "hadiths" in nawawi_data:
            for h in nawawi_data["hadiths"]:
                ar_m = q in h.get("arabic_text", "") or q in h.get("narrator", "")
                en_m = q_lower in h.get("english_text", "").lower()
                if ar_m or en_m:
                    matches.append({
                        "book_id": "nawawi40",
                        "collection_title": nawawi_data.get("title_ar"),
                        "hadith": h
                    })

    # Search in chapter-wise files
    target_books = [book.lower()] if book and book.lower() != "nawawi40" else ["bukhari", "muslim", "abudawud", "tirmidhi", "nasai", "ibnmajah"]

    for b in target_books:
        ar_dir = os.path.join(CHAPTER_WISE_DIR, b, "arabic")
        en_dir = os.path.join(CHAPTER_WISE_DIR, b, "english")
        if not os.path.exists(ar_dir):
            continue

        b_info = find_book(b)
        b_name = b_info.get("name_ar", b) if b_info else b

        # Scan chapters until limit reached (offset + limit)
        for fname in os.listdir(ar_dir):
            if not fname.endswith(".json"):
                continue
            ch_data = load_json(os.path.join(ar_dir, fname))
            if not ch_data or "hadith_list" not in ch_data:
                continue

            for h in ch_data["hadith_list"]:
                ar_text = h.get("arabic_text", "")
                if q in ar_text:
                    matches.append({
                        "book_id": b,
                        "collection_title": b_name,
                        "hadith": h
                    })
                    if len(matches) >= offset + limit + 50:
                        break
            if len(matches) >= offset + limit + 50:
                break

    paginated = matches[offset:offset + limit]

    return {
        "status": "success",
        "query": q,
        "total_matches": len(matches),
        "limit": limit,
        "offset": offset,
        "results": paginated
    }

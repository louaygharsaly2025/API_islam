"""
Tajweed Router for API_ISLAM.
Provides character-level Tajweed annotations for all 6,236 verses of the Holy Quran (Riwayat Hafs).
Supports rules extraction, rule legends, and pre-formatted color-coded HTML output.
"""
import os
import json
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import HTMLResponse

router = APIRouter(prefix="/api/v1/tajweed", tags=["Tajweed Rules & Coloring"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TAJWEED_FILE = os.path.join(BASE_DIR, "data", "tajweed", "tajweed.hafs.json")
KFGQPC_HAFS_FILE = os.path.join(BASE_DIR, "data", "quran_kfgqpc", "hafs.json")

# In-memory index: (surah, ayah) -> annotations list
_TAJWEED_INDEX: Dict[str, List[Dict[str, Any]]] = {}
_HAFS_VERSE_MAP: Dict[str, str] = {}

TAJWEED_RULES = {
    "ghunnah": {
        "id": "ghunnah",
        "name_ar": "غُنّة",
        "name_en": "Ghunnah",
        "color": "#16a34a",
        "description": "صوت يخرج من الخيشوم بمقدار حركتين في النون والميم المشددتين"
    },
    "idghaam_ghunnah": {
        "id": "idghaam_ghunnah",
        "name_ar": "إدغام بغنة",
        "name_en": "Idghaam with Ghunnah",
        "color": "#15803d",
        "description": "إدغام النون الساكنة أو التنوين في حروف (ينمو) مع بقاء الغنة"
    },
    "idghaam_no_ghunnah": {
        "id": "idghaam_no_ghunnah",
        "name_ar": "إدغام بغير غنة",
        "name_en": "Idghaam without Ghunnah",
        "color": "#64748b",
        "description": "إدغام النون الساكنة أو التنوين في حرفي (اللام والراء)"
    },
    "idghaam_mutajaanisain": {
        "id": "idghaam_mutajaanisain",
        "name_ar": "إدغام متجانسين",
        "name_en": "Idghaam Mutajanisayn",
        "color": "#64748b",
        "description": "إدغام حرفين اتفقا مخرجاً واختلفا صفة"
    },
    "idghaam_mutaqaaribain": {
        "id": "idghaam_mutaqaaribain",
        "name_ar": "إدغام متقاربين",
        "name_en": "Idghaam Mutaqaribayn",
        "color": "#64748b",
        "description": "إدغام حرفين تقاربا مخرجاً وصفة"
    },
    "idghaam_shafawi": {
        "id": "idghaam_shafawi",
        "name_ar": "إدغام شفوي (إدغام مثلين صغير)",
        "name_en": "Idghaam Shafawi",
        "color": "#16a34a",
        "description": "إدغام الميم الساكنة في ميم مثلها مع الغنة"
    },
    "ikhfa": {
        "id": "ikhfa",
        "name_ar": "إخفاء حقيقي",
        "name_en": "Ikhfa Haqiqi",
        "color": "#059669",
        "description": "النطق بالحرف بصفة بين الإظهار والإدغام مع بقاء الغنة"
    },
    "ikhfa_shafawi": {
        "id": "ikhfa_shafawi",
        "name_ar": "إخفاء شفوي",
        "name_en": "Ikhfa Shafawi",
        "color": "#0d9488",
        "description": "إخفاء الميم الساكنة عند حرف الباء مع الغنة"
    },
    "iqlab": {
        "id": "iqlab",
        "name_ar": "إقلاب",
        "name_en": "Iqlab",
        "color": "#0284c7",
        "description": "قلب النون الساكنة أو التنوين ميماً مخفاة بغنة عند الباء"
    },
    "madd_2": {
        "id": "madd_2",
        "name_ar": "مد طبيعي / صلة صغرى",
        "name_en": "Normal Madd (2 Vowels)",
        "color": "#d97706",
        "description": "يمد بمقدار حركتين"
    },
    "madd_246": {
        "id": "madd_246",
        "name_ar": "مد عارض للسكون / لين",
        "name_en": "Madd 'Aarid / Leen (2-4-6 Vowels)",
        "color": "#ea580c",
        "description": "يمد بمقدار حركتين أو أربع أو ست حركات جوازاً"
    },
    "madd_muttasil": {
        "id": "madd_muttasil",
        "name_ar": "مد متصل واجب",
        "name_en": "Madd Muttasil (4-5 Vowels)",
        "color": "#dc2626",
        "description": "أن يأتي حرف المد والهمز في كلمة واحدة، ويمد 4 أو 5 حركات"
    },
    "madd_munfasil": {
        "id": "madd_munfasil",
        "name_ar": "مد منفصل جائز / صلة كبرى",
        "name_en": "Madd Munfasil (4-5 Vowels)",
        "color": "#e11d48",
        "description": "أن يأتي حرف المد في آخر الكلمة والهمز في أول الكلمة التالية"
    },
    "madd_6": {
        "id": "madd_6",
        "name_ar": "مد لازم (كلمي أو حرفي)",
        "name_en": "Madd Lazim (6 Vowels)",
        "color": "#991b1b",
        "description": "يمد بمقدار 6 حركات لزوماً"
    },
    "qalqalah": {
        "id": "qalqalah",
        "name_ar": "قلقلة",
        "name_en": "Qalqalah",
        "color": "#2563eb",
        "description": "اضطراب الصوت عند النطق بالحرف الساكن من حروف (قطب جد)"
    },
    "hamzat_wasl": {
        "id": "hamzat_wasl",
        "name_ar": "همزة وصل",
        "name_en": "Hamzat Wasl",
        "color": "#9ca3af",
        "description": "تثبت ابتداءً وتسقط وصلاً"
    },
    "lam_shamsiyyah": {
        "id": "lam_shamsiyyah",
        "name_ar": "لام شمسية مدغمة",
        "name_en": "Lam Shamsiyyah",
        "color": "#9ca3af",
        "description": "لام التعريف المدغمة فيما بعدها"
    },
    "silent": {
        "id": "silent",
        "name_ar": "حرف صامت (لا يلفظ)",
        "name_en": "Silent Letter",
        "color": "#9ca3af",
        "description": "أحرف مكتوبة في الرسم ولا تلفظ وصلاً ووقفاً"
    }
}


def _init_tajweed_index():
    global _TAJWEED_INDEX, _HAFS_VERSE_MAP
    if not _TAJWEED_INDEX and os.path.exists(TAJWEED_FILE):
        with open(TAJWEED_FILE, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
            for item in raw_data:
                key = f"{item['surah']}:{item['ayah']}"
                _TAJWEED_INDEX[key] = item.get("annotations", [])

    if not _HAFS_VERSE_MAP and os.path.exists(KFGQPC_HAFS_FILE):
        with open(KFGQPC_HAFS_FILE, "r", encoding="utf-8") as f:
            hafs_list = json.load(f)
            for row in hafs_list:
                key = f"{row['sora']}:{row['aya_no']}"
                _HAFS_VERSE_MAP[key] = row.get("aya_text", "")


def get_annotations_for_verse(surah: int, ayah: int) -> List[Dict[str, Any]]:
    _init_tajweed_index()
    key = f"{surah}:{ayah}"
    return _TAJWEED_INDEX.get(key, [])


def render_tajweed_html(text: str, annotations: List[Dict[str, Any]]) -> str:
    """Renders HTML with color-coded spans given Unicode codepoint annotations."""
    if not text or not annotations:
        return text

    # Sort annotations by start ascending
    sorted_ann = sorted(annotations, key=lambda a: a["start"])
    
    # Map index to rule
    n = len(text)
    tags_start: Dict[int, List[Dict[str, Any]]] = {}
    tags_end: Dict[int, List[Dict[str, Any]]] = {}
    
    for ann in sorted_ann:
        s = ann["start"]
        e = ann["end"]
        if s not in tags_start:
            tags_start[s] = []
        if e not in tags_end:
            tags_end[e] = []
        tags_start[s].append(ann)
        tags_end[e].append(ann)

    rendered_chars = []
    for i, char in enumerate(text):
        # Open tags
        if i in tags_start:
            for ann in tags_start[i]:
                rule = ann["rule"]
                rule_info = TAJWEED_RULES.get(rule, {"name_ar": rule, "color": "#059669"})
                rendered_chars.append(f'<span class="tajweed-{rule}" style="color: {rule_info["color"]}; font-weight: bold;" title="{rule_info["name_ar"]}">')
        
        rendered_chars.append(char)
        
        # Close tags (if tag ends after this character)
        if (i + 1) in tags_end:
            for ann in tags_end[i + 1]:
                rendered_chars.append('</span>')

    return "".join(rendered_chars)


@router.get("/rules", summary="Get dictionary of all supported Tajweed rules with colors and descriptions")
def get_tajweed_rules():
    return {
        "status": "success",
        "total_rules": len(TAJWEED_RULES),
        "data": TAJWEED_RULES
    }


@router.get("/ayah/{surah_id}/{ayah_no}", summary="Get Tajweed character annotations for a specific verse")
def get_ayah_tajweed(surah_id: int, ayah_no: int):
    if surah_id < 1 or surah_id > 114:
        raise HTTPException(status_code=400, detail="Surah number must be between 1 and 114")

    _init_tajweed_index()
    annotations = get_annotations_for_verse(surah_id, ayah_no)
    key = f"{surah_id}:{ayah_no}"
    raw_text = _HAFS_VERSE_MAP.get(key, "")

    enriched = []
    for ann in annotations:
        r = ann.get("rule")
        meta = TAJWEED_RULES.get(r, {})
        enriched.append({
            "rule": r,
            "rule_name_ar": meta.get("name_ar", r),
            "rule_name_en": meta.get("name_en", r),
            "color": meta.get("color", "#000000"),
            "start": ann.get("start"),
            "end": ann.get("end"),
            "target_substring": raw_text[ann.get("start"):ann.get("end")] if raw_text else None
        })

    return {
        "status": "success",
        "surah": surah_id,
        "ayah": ayah_no,
        "total_annotations": len(annotations),
        "annotations": enriched
    }


@router.get("/surah/{surah_id}", summary="Get all Tajweed annotations for an entire Surah")
def get_surah_tajweed(surah_id: int):
    if surah_id < 1 or surah_id > 114:
        raise HTTPException(status_code=400, detail="Surah number must be between 1 and 114")

    _init_tajweed_index()
    surah_annotations = []
    
    # Check all verses for this surah
    for key, ann in _TAJWEED_INDEX.items():
        s, a = map(int, key.split(":"))
        if s == surah_id:
            surah_annotations.append({
                "ayah": a,
                "total_rules": len(ann),
                "annotations": ann
            })

    surah_annotations.sort(key=lambda x: x["ayah"])

    return {
        "status": "success",
        "surah": surah_id,
        "ayahs_count": len(surah_annotations),
        "data": surah_annotations
    }


@router.get("/ayah/{surah_id}/{ayah_no}/html", summary="Get verse text with pre-rendered Tajweed colored HTML tags")
def get_ayah_tajweed_html(surah_id: int, ayah_no: int):
    if surah_id < 1 or surah_id > 114:
        raise HTTPException(status_code=400, detail="Surah number must be between 1 and 114")

    _init_tajweed_index()
    key = f"{surah_id}:{ayah_no}"
    raw_text = _HAFS_VERSE_MAP.get(key, "")
    annotations = get_annotations_for_verse(surah_id, ayah_no)

    if not raw_text:
        raise HTTPException(status_code=404, detail=f"Verse {surah_id}:{ayah_no} not found")

    html_snippet = render_tajweed_html(raw_text, annotations)

    return {
        "status": "success",
        "surah": surah_id,
        "ayah": ayah_no,
        "raw_text": raw_text,
        "html": html_snippet
    }

"""
Generate complete 604 pages index & Surah page positions for the standard Madinah printed Mushaf.
"""
import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MUSHAF_DIR = os.path.join(BASE_DIR, "data", "mushaf")

# Surah starting page index in the standard 604-page Madinah Mushaf
SURAH_START_PAGES = {
    1: 1, 2: 2, 3: 50, 4: 77, 5: 106, 6: 128, 7: 151, 8: 177, 9: 187, 10: 208,
    11: 221, 12: 235, 13: 249, 14: 255, 15: 262, 16: 267, 17: 282, 18: 293, 19: 305, 20: 312,
    21: 322, 22: 332, 23: 342, 24: 350, 25: 359, 26: 367, 27: 377, 28: 385, 29: 396, 30: 404,
    31: 411, 32: 415, 33: 418, 34: 428, 35: 434, 36: 440, 37: 446, 38: 453, 39: 458, 40: 467,
    41: 477, 42: 483, 43: 489, 44: 496, 45: 499, 46: 502, 47: 507, 48: 511, 49: 515, 50: 518,
    51: 520, 52: 523, 53: 526, 54: 528, 55: 531, 56: 534, 57: 537, 58: 542, 59: 545, 60: 549,
    61: 551, 62: 553, 63: 554, 64: 556, 65: 558, 66: 560, 67: 562, 68: 564, 69: 566, 70: 568,
    71: 570, 72: 572, 73: 574, 74: 575, 75: 577, 76: 578, 77: 580, 78: 582, 79: 583, 80: 585,
    81: 586, 82: 587, 83: 587, 84: 589, 85: 590, 86: 591, 87: 591, 88: 592, 89: 593, 90: 594,
    91: 595, 92: 595, 93: 596, 94: 596, 95: 597, 96: 597, 97: 598, 98: 598, 99: 599, 100: 599,
    101: 600, 102: 600, 103: 601, 104: 601, 105: 601, 106: 602, 107: 602, 108: 602, 109: 603, 110: 603,
    111: 603, 112: 604, 113: 604, 114: 604
}

# Juz start pages in standard Madinah Mushaf
JUZ_START_PAGES = {
    1: 1, 2: 22, 3: 42, 4: 62, 5: 82, 6: 102, 7: 122, 8: 142, 9: 162, 10: 182,
    11: 202, 12: 222, 13: 242, 14: 262, 15: 282, 16: 302, 17: 322, 18: 342, 19: 362, 20: 382,
    21: 402, 22: 422, 23: 442, 24: 462, 25: 482, 26: 502, 27: 522, 28: 542, 29: 562, 30: 582
}

def get_juz_for_page(page):
    current_juz = 1
    for juz, start_p in sorted(JUZ_START_PAGES.items()):
        if page >= start_p:
            current_juz = juz
        else:
            break
    return current_juz

def get_surah_for_page(page, surahs_info):
    # Find which surah starts on or right before this page
    surah_num = 1
    for s_num, start_p in sorted(SURAH_START_PAGES.items()):
        if page >= start_p:
            surah_num = s_num
        else:
            break
    surah_meta = next((s for s in surahs_info if s["number"] == surah_num), None)
    return surah_num, surah_meta["name_arabic"] if surah_meta else ""

def generate_mappings():
    surahs_info_path = os.path.join(BASE_DIR, "data", "quran", "surahs_info.json")
    surahs_info = []
    if os.path.exists(surahs_info_path):
        with open(surahs_info_path, "r", encoding="utf-8") as f:
            surahs_info = json.load(f)

    pages = []
    for p in range(1, 605):
        juz = get_juz_for_page(p)
        hizb = ((juz - 1) * 2) + (1 if p < JUZ_START_PAGES.get(juz, 1) + 10 else 2)
        surah_num, surah_name = get_surah_for_page(p, surahs_info)
        
        pages.append({
            "page_number": p,
            "juz": juz,
            "hizb": hizb,
            "surah_number": surah_num,
            "surah_name_ar": surah_name,
            "is_right_page": (p % 2 != 0),
            "layout_side": "right" if (p % 2 != 0) else "left"
        })

    os.makedirs(MUSHAF_DIR, exist_ok=True)
    with open(os.path.join(MUSHAF_DIR, "pages_mapping.json"), "w", encoding="utf-8") as f:
        json.dump(pages, f, ensure_ascii=False, indent=2)

    with open(os.path.join(MUSHAF_DIR, "surah_start_pages.json"), "w", encoding="utf-8") as f:
        json.dump(SURAH_START_PAGES, f, ensure_ascii=False, indent=2)

    print("Generated 604 Mushaf pages mappings successfully!")

if __name__ == "__main__":
    generate_mappings()

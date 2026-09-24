"""
Script to download authentic Quran Tafsir (Al-Muyassar, Ibn Kathir, As-Sa'di, Al-Jalalayn, etc.)
from open Islamic datasets (quranenc.com / alquran.cloud / api.quran.com)
"""
import os
import json
import urllib.request
import time

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TAFSIR_DIR = os.path.join(BASE_DIR, "data", "tafsir")

TAFSIR_SOURCES = {
    "ar-muyassar": "arabic_moyassar",
    "ar-saadi": "arabic_saadi",
    "ar-baghawi": "arabic_baghawy",
    "ar-qurtubi": "arabic_qurtubi",
    "ar-tabari": "arabic_tabari",
    "ar-ibn-kathir": "arabic_ibn_katheer"
}

def fetch_tafsir_for_surah(tafsir_id, surah_number):
    source_key = TAFSIR_SOURCES.get(tafsir_id, "arabic_moyassar")
    url = f"https://quranenc.com/api/v1/translation/sura/{source_key}/{surah_number}"
    
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                ayahs = []
                for item in data.get('result', []):
                    ayahs.append({
                        "ayah_number": int(item.get("aya")),
                        "text": item.get("translation")
                    })
                
                output = {
                    "tafsir_id": tafsir_id,
                    "surah_number": surah_number,
                    "ayahs": ayahs
                }
                
                target_folder = os.path.join(TAFSIR_DIR, tafsir_id)
                os.makedirs(target_folder, exist_ok=True)
                target_file = os.path.join(target_folder, f"{surah_number}.json")
                with open(target_file, "w", encoding="utf-8") as f:
                    json.dump(output, f, ensure_ascii=False, indent=2)
                print(f"[SUCCESS] Downloaded {tafsir_id} for Surah {surah_number}")
                return True
    except Exception as e:
        print(f"[ERROR] Failed to fetch {tafsir_id} Surah {surah_number}: {e}")
    return False

def main(tafsir_id="ar-muyassar"):
    print(f"Starting Tafsir download for: {tafsir_id}")
    for s in range(1, 115):
        filepath = os.path.join(TAFSIR_DIR, tafsir_id, f"{s}.json")
        if os.path.exists(filepath):
            print(f"Surah {s} already exists for {tafsir_id}. Skipping...")
            continue
        fetch_tafsir_for_surah(tafsir_id, s)
        time.sleep(0.2)

if __name__ == "__main__":
    main()

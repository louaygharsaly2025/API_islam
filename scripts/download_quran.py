"""
Utility script to fetch full Quran Surahs text & English translations from Quran API (alquran.cloud)
and save them locally into data/quran/surahs/<id>.json
"""
import os
import json
import urllib.request
import urllib.error
import time

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SURAHS_DIR = os.path.join(BASE_DIR, "data", "quran", "surahs")

def fetch_surah(surah_num):
    url = f"https://api.alquran.cloud/v1/surah/{surah_num}/editions/quran-uthmani,en.sahih"
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    
    with urllib.request.urlopen(req, timeout=10) as response:
        if response.status == 200:
            data = json.loads(response.read().decode('utf-8'))
            arabic_data = data['data'][0]
            english_data = data['data'][1]
            
            verses = []
            for i, ayah in enumerate(arabic_data['ayahs']):
                en_text = english_data['ayahs'][i]['text'] if i < len(english_data['ayahs']) else ""
                verses.append({
                    "number": ayah['number'],
                    "number_in_surah": ayah['numberInSurah'],
                    "juz": ayah['juz'],
                    "page": ayah['page'],
                    "text_uthmani": ayah['text'],
                    "translation_en": en_text,
                    "audio_url": f"https://cdn.islamic.network/quran/audio/128/ar.alafasy/{ayah['number']}.mp3"
                })
                
            surah_obj = {
                "number": arabic_data['number'],
                "name_arabic": arabic_data['name'],
                "name_english": arabic_data['englishName'],
                "name_translation": arabic_data['englishNameTranslation'],
                "revelation_type": arabic_data['revelationType'],
                "total_verses": arabic_data['numberOfAyahs'],
                "bismillah_pre": surah_num != 1 and surah_num != 9,
                "verses": verses
            }
            
            output_path = os.path.join(SURAHS_DIR, f"{surah_num}.json")
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(surah_obj, f, ensure_ascii=False, indent=2)
            print(f"Downloaded and saved Surah {surah_num}: {arabic_data['name']} ({arabic_data['englishName']})")
            return True
    return False

def main():
    os.makedirs(SURAHS_DIR, exist_ok=True)
    print("Starting Quran Surahs downloader...")
    for s in range(1, 115):
        filepath = os.path.join(SURAHS_DIR, f"{s}.json")
        if os.path.exists(filepath):
            print(f"Surah {s} already exists locally. Skipping...")
            continue
        try:
            fetch_surah(s)
            time.sleep(0.3)
        except Exception as e:
            print(f"Failed to fetch Surah {s}: {e}")

if __name__ == "__main__":
    main()

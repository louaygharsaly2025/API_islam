# ============================================================================
# API_ISLAM Python Client SDK
# Works with Python 3.8+ using `requests` or `httpx`
# ============================================================================

import requests

class IslamicApiClient:
    def __init__(self, base_url="http://localhost:8000/api/v1"):
        self.base_url = base_url.rstrip("/")

    def _get(self, endpoint, params=None):
        url = f"{self.base_url}{endpoint}"
        response = requests.get(url, params=params)
        response.raise_for_status()
        json_data = response.json()
        return json_data.get("data", json_data)

    # --- Quran ---
    def get_surahs(self, revelation_type=None):
        params = {"revelation_type": revelation_type} if revelation_type else None
        return self._get("/quran/surahs", params=params)

    def get_surah(self, surah_id: int):
        return self._get(f"/quran/surah/{surah_id}")

    def search_quran(self, query: str):
        res = self._get("/quran/search", params={"q": query})
        return res.get("results", [])

    def get_reciters(self):
        return self._get("/quran/reciters")

    # --- Adhkar ---
    def get_adhkar_categories(self):
        return self._get("/adhkar/categories")

    def get_adhkar(self, category: str):
        return self._get(f"/adhkar/category/{category}")

    def get_random_dhikr(self):
        return self._get("/adhkar/random")

    # --- Hadith ---
    def get_hadith_collection(self, collection_id: str = "nawawi40"):
        return self._get(f"/hadith/collection/{collection_id}")

    def get_random_hadith(self):
        return self._get("/hadith/random")

    # --- Prayer Times ---
    def get_prayer_times(self, latitude: float, longitude: float, date_str: str = None, timezone: float = 1.0, method: str = "EGYPT"):
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "timezone": timezone,
            "method": method
        }
        if date_str:
            params["date"] = date_str
        return self._get("/prayer-times/calculate", params=params)

# Example Usage
if __name__ == "__main__":
    client = IslamicApiClient()
    print("Testing connection...")
    try:
        surahs = client.get_surahs()
        print(f"Total Surahs available: {len(surahs)}")
        
        prayer = client.get_prayer_times(36.8065, 10.1815)
        print("Prayer times in Tunis:", prayer["timings"])
    except Exception as e:
        print("Make sure server is running:", e)

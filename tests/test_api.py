"""
Comprehensive Integration & Unit Tests for API_ISLAM endpoints.
"""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# 1. General Endpoints
def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.json()["service"] == "API_ISLAM"

def test_root_landing_page():
    response = client.get("/")
    assert response.status_code == 200
    assert "API_ISLAM" in response.text

# 2. Quran Endpoints
def test_get_surahs():
    response = client.get("/api/v1/quran/surahs")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "success"
    assert json_data["count"] == 114
    assert len(json_data["data"]) == 114

def test_get_meccan_surahs():
    response = client.get("/api/v1/quran/surahs?revelation_type=Meccan")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "success"
    assert all(s["revelation_type"] == "Meccan" for s in json_data["data"])

def test_get_single_surah_fatiha():
    response = client.get("/api/v1/quran/surah/1")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["data"]["name_arabic"] == "الفاتحة"
    assert len(json_data["data"]["verses"]) == 7

def test_get_reciters():
    response = client.get("/api/v1/quran/reciters")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["count"] > 0

# 3. Mushaf & Riwayat Endpoints
def test_get_mushaf_editions():
    response = client.get("/api/v1/mushaf/editions")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["count"] >= 5

def test_get_mushaf_page():
    response = client.get("/api/v1/mushaf/page/1?edition=quran-hafs-madinah")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["page_number"] == 1
    assert "image_url" in json_data

def test_get_riwayat():
    response = client.get("/api/v1/mushaf/riwayat")
    assert response.status_code == 200
    json_data = response.json()
    assert len(json_data["data"]) >= 7

# 4. Tafsir Endpoints
def test_get_tafsir_books():
    response = client.get("/api/v1/tafsir/books")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["count"] >= 5

def test_get_surah_tafsir():
    response = client.get("/api/v1/tafsir/ar-muyassar/surah/1")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["data"]["surah_number"] == 1
    assert len(json_data["data"]["ayahs"]) == 7

def test_get_ayah_tafsir():
    response = client.get("/api/v1/tafsir/ar-muyassar/ayah/1/1")
    assert response.status_code == 200
    json_data = response.json()
    assert "tafsir_text" in json_data

# 5. Adhkar Endpoints
def test_get_adhkar_categories():
    response = client.get("/api/v1/adhkar/categories")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["count"] >= 4

def test_get_morning_adhkar():
    response = client.get("/api/v1/adhkar/category/morning")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["data"]["category_id"] == "morning"
    assert len(json_data["data"]["items"]) > 0

def test_get_random_dhikr():
    response = client.get("/api/v1/adhkar/random")
    assert response.status_code == 200
    assert "arabic_text" in response.json()["data"]

# 6. Hadith Endpoints
def test_get_hadith_collections():
    response = client.get("/api/v1/hadith/collections")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["count"] > 0

def test_get_nawawi_hadiths():
    response = client.get("/api/v1/hadith/collection/nawawi40")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["data"]["collection_id"] == "nawawi40"
    assert len(json_data["data"]["hadiths"]) > 0

def test_get_random_hadith():
    response = client.get("/api/v1/hadith/random")
    assert response.status_code == 200
    assert "arabic_text" in response.json()["data"]

# 7. Prayer Times Endpoints
def test_get_prayer_methods():
    response = client.get("/api/v1/prayer-times/methods")
    assert response.status_code == 200
    assert len(response.json()["methods"]) > 0

def test_calculate_prayer_times():
    response = client.get("/api/v1/prayer-times/calculate?latitude=36.8065&longitude=10.1815&timezone=1&method=EGYPT")
    assert response.status_code == 200
    json_data = response.json()
    timings = json_data["data"]["timings"]
    assert "Fajr" in timings
    assert "Sunrise" in timings
    assert "Dhuhr" in timings
    assert "Asr" in timings
    assert "Maghrib" in timings
    assert "Isha" in timings

"""
Unit & Integration Tests for Holy Quran Qiraat, Tajweed Engine, and Local Mushaf Streaming.
"""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_quran_9_editions():
    response = client.get("/api/v1/quran/editions")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 9
    ids = [e["id"] for e in data["data"]]
    assert "hafs" in ids
    assert "warsh" in ids
    assert "qaloon" in ids
    assert "shouba" in ids
    assert "doori" in ids
    assert "soosi" in ids
    assert "bazzi" in ids
    assert "qumbul" in ids
    assert "hafs-smart" in ids

def test_quran_riwayah_warsh_and_qaloon():
    # Warsh
    res_warsh = client.get("/api/v1/quran/ayah/1/1?edition=warsh")
    assert res_warsh.status_code == 200
    assert "aya_text" in res_warsh.json()["data"]

    # Qaloon
    res_qaloon = client.get("/api/v1/quran/ayah/1/1?edition=qaloon")
    assert res_qaloon.status_code == 200
    assert "aya_text" in res_qaloon.json()["data"]

def test_quran_page_verses():
    response = client.get("/api/v1/quran/page/1?edition=hafs")
    assert response.status_code == 200
    data = response.json()
    assert data["page_number"] == 1
    assert data["verses_count"] == 7

def test_quran_juz_verses():
    response = client.get("/api/v1/quran/juz/1?edition=hafs")
    assert response.status_code == 200
    data = response.json()
    assert data["juz_number"] == 1
    assert data["verses_count"] > 0

def test_quran_search():
    response = client.get("/api/v1/quran/search?q=الرحمن&edition=hafs")
    assert response.status_code == 200
    data = response.json()
    assert data["total_matches"] > 0
    assert len(data["results"]) > 0

def test_tajweed_rules_catalog():
    response = client.get("/api/v1/tajweed/rules")
    assert response.status_code == 200
    data = response.json()
    assert data["total_rules"] >= 15
    assert "ghunnah" in data["data"]
    assert "madd_6" in data["data"]
    assert "qalqalah" in data["data"]

def test_tajweed_ayah_annotations():
    response = client.get("/api/v1/tajweed/ayah/1/1")
    assert response.status_code == 200
    data = response.json()
    assert data["surah"] == 1
    assert data["ayah"] == 1
    assert data["total_annotations"] > 0

def test_tajweed_ayah_html():
    response = client.get("/api/v1/tajweed/ayah/1/1/html")
    assert response.status_code == 200
    data = response.json()
    assert "html" in data
    assert "tajweed-" in data["html"]
    assert "span" in data["html"]

def test_mushaf_local_image_streaming():
    response = client.get("/api/v1/mushaf/page/1/image?edition=hafs")
    assert response.status_code == 200
    assert "image/png" in response.headers.get("content-type", "")
    assert len(response.content) > 1000

def test_static_font_css():
    response = client.get("/static/fonts/kfgqpc.local.css")
    assert response.status_code == 200
    assert "font-family" in response.text

# 🌿 API_ISLAM (v4.0 Ultimate Quran Engine)

[![CI/CD Pipeline](https://github.com/louaygharsaly2025/API_islam/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/louaygharsaly2025/API_islam/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](Dockerfile)
[![Tests](https://img.shields.io/badge/tests-42%20passed-success.svg)](tests/)

The most comprehensive, high-performance, open-source Islamic REST API and Data Repository built with **FastAPI** and **Python 3**.

---

## 🌟 Core Features & Modules

* **📖 Holy Quran & 9 Qira'at (KFGQPC)**: Complete text for 114 Surahs and 6,236 Ayahs across 9 authentic narrations (**Hafs**, **Warsh**, **Qaloon**, **Shouba**, **Doori**, **Soosi**, **Bazzi**, **Qumbul**, **Hafs-Smart**), with Uthmanic fonts and fast search.
* **🎨 Character-Level Tajweed Engine**: 18 Tajweed rules catalog with precise Unicode codepoint offsets and pre-rendered colored HTML strings for mobile/web apps.
* **🖼️ High-Res Printed Mushaf**: 604 high-resolution printed pages streamed directly from local storage with ultra-fast caching headers (**Hafs**, **Warsh 'an Nafi'**, **Color-coded Tajweed**).
* **✨ 99 Names of Allah (Asmaul Husna)**: Complete list with Arabic calligraphy names, transliterations, English meanings, and comprehensive explanations.
* **🤲 Duas & Ruqyah Shariah**: 40 Quranic Rabbana supplications and authentic Ruqyah verses and prophetic invocations.
* **📚 Authentic Tafsir**: Books catalog including **Al-Muyassar**, **As-Sa'di**, **Ibn Kathir**, **Al-Qurtubi**, **Al-Tabari**, and **Al-Jalalayn**.
* **📜 Authentic Hadiths**: An-Nawawi Forty Hadiths with Arabic & English translations, narrators, and search.
* **🕌 Astronomical Prayer Times**: Exact calculation engine based on pure solar algorithms for any GPS coordinates.
* **🧭 Qibla Direction**: Great-circle navigation algorithm providing exact degree bearing to the Holy Kaaba and distance in kilometers.
* **📅 Hijri Calendar & Islamic Events**: Gregorian <-> Hijri bidirectional conversion with annual Islamic holidays and occasions.
* **📻 Live Quran Radios**: 24/7 streaming MP3 radios (Makkah, Cairo, Alafasy, Abdul Basit, Al-Minshawi, Al-Muaiqly, Al-Husary, Ruqyah, Tafsir).
* **💰 Islamic Zakat Calculator**: Nisab thresholds (Gold/Silver) and zakat calculation on cash, gold, silver, investments, and trade assets.
* **⚡ Interactive Docs & Postman**: Built-in Swagger UI (`/docs`), ReDoc (`/redoc`), and 1-click test file (`api_requests.http`).
* **🐳 Docker & CI/CD**: Production-ready `Dockerfile`, `docker-compose.yml`, and GitHub Actions CI/CD with 42 automated unit tests (100% pass).

---

## 📁 Directory Structure

```text
API_islam/
├── app/                        # FastAPI application source code
│   ├── main.py                 # Application entrypoint & UI portal
│   ├── routers/                # 12 Modules (quran, mushaf, tafsir, asmaul_husna, duas, hadith, ...)
│   └── services/               # Astronomical & Mathematical engines (Prayer, Qibla, Hijri, Zakat)
├── data/                       # 25 JSON Datasets (Quran, Adhkar, Duas, Hadith, Mushaf, Radios, ...)
├── schemas/                    # Formal JSON Schemas for validation
├── tests/                      # 32 Automated Unit & Integration Tests (Pytest)
├── scripts/                    # Automation & sync scripts (validate, download, generate)
├── examples/                   # Ready-to-use SDK Clients (Flutter, JS, Python, HTML Flip Viewer)
├── docs/                       # Documentation (COMPLETE_GUIDE.md, API_DOCUMENTATION.md)
├── .github/workflows/          # Automated CI/CD Pipeline
├── Dockerfile                  # Container build
├── docker-compose.yml          # Compose orchestration
├── requirements.txt            # Python dependencies
├── api_requests.http           # 1-Click Interactive REST tester
└── LICENSE                     # MIT License
```

---

## 🚀 Quick Start

### 1. Install & Run Locally
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open in browser:
* **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **Alternative ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
* **Web Landing Portal**: [http://localhost:8000/](http://localhost:8000/)

### 2. Run with Docker
```bash
docker compose up -d --build
```

### 3. Run Automated Tests
```bash
python scripts/validate_data.py
python -m pytest -v
```

---

## 📖 Comprehensive Documentation
For the full guide and integration examples in **Flutter**, **React**, **Node.js**, and **Python**, check [docs/COMPLETE_GUIDE.md](docs/COMPLETE_GUIDE.md).

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

**louay gharsaly 2026**

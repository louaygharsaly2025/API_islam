# 🌿 API_ISLAM

A modern, fast, and structured Islamic Data Repository and REST API service built with **FastAPI** and **Python 3**.

---

## 🌟 Features

* **📖 Holy Quran**: Complete metadata for 114 Surahs, Ayahs, Translations, Reciters, and Full-text Search.
* **🤲 Adhkar & Duas**: Morning, Evening, Sleep, and Post-Prayer Adhkar with counters, virtues, and references.
* **📜 Authentic Hadiths**: An-Nawawi Forty Hadiths with Arabic & English translations and narrators.
* **🕌 Astronomical Prayer Times**: Exact prayer calculation engine based on solar algorithms for any GPS coordinates.
* **⚡ High Performance & Interactive Docs**: Built-in Swagger UI (`/docs`) and ReDoc (`/redoc`).
* **🐳 Docker Ready**: `Dockerfile` and `docker-compose.yml` included.

---

## 📁 Directory Structure

```text
API_islam/
├── app/                        # FastAPI application source code
│   ├── main.py                 # Main entrypoint & UI landing page
│   ├── routers/                # API Endpoints (quran, adhkar, hadith, prayer_times)
│   └── services/               # Prayer calculation astronomical service
├── data/                       # Core JSON datasets
│   ├── quran/                  # Surahs index, ayahs, translations, reciters
│   ├── adhkar/                 # Morning, evening, sleep, after_prayer
│   ├── hadith/                 # Hadith collections
│   └── prayer_times/           # Calculation methods metadata
├── schemas/                    # JSON Schemas for validation
├── scripts/                    # Automation & utility scripts
│   ├── init_datasets.py        # Initialize baseline datasets
│   ├── validate_data.py        # Validate JSON against schemas
│   └── download_quran.py       # Sync all 114 surahs from Quran API
├── docs/                       # Comprehensive documentation
│   ├── API_DOCUMENTATION.md    # Endpoints guide & query params
│   └── DATA_SCHEMA.md          # Architecture & data specifications
├── .gitignore                  # Git ignore rules
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Container definition
└── docker-compose.yml          # Compose service configuration
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the API Server
```bash
uvicorn app.main:app --reload --port 8000
```
Open your browser at:
* **Interactive API Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **Alternative Docs (ReDoc)**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
* **Root Portal**: [http://localhost:8000/](http://localhost:8000/)

---

## 🛠️ Utilities & Scripts

### Validate JSON Datasets & Schemas
```bash
python scripts/validate_data.py
```

### Sync All 114 Quran Surahs
```bash
python scripts/download_quran.py
```

---

## 🐳 Run with Docker

```bash
docker-compose up -d --build
```

---

**louay gharsaly 2026**

# API_ISLAM Endpoints Documentation

Welcome to **API_ISLAM** documentation. All responses are in JSON format.

Base URL: `http://localhost:8000` (or your deployed URL)

---

## 1. Quran Endpoints

### 1.1 List all Surahs
* **Endpoint**: `GET /api/v1/quran/surahs`
* **Query Parameters**:
  * `revelation_type` *(optional)*: Filter by `Meccan` or `Medinan`.
* **Example Response**:
```json
{
  "status": "success",
  "count": 114,
  "data": [
    {
      "number": 1,
      "name_arabic": "الفاتحة",
      "name_english": "Al-Faatiha",
      "name_translation": "The Opening",
      "revelation_type": "Meccan",
      "total_verses": 7
    }
  ]
}
```

### 1.2 Get Surah by Number
* **Endpoint**: `GET /api/v1/quran/surah/{surah_id}`
* **Path Parameters**:
  * `surah_id` *(required)*: Number from 1 to 114.
* **Example**: `/api/v1/quran/surah/1`

### 1.3 Search Quran Verses
* **Endpoint**: `GET /api/v1/quran/search?q={keyword}`
* **Query Parameters**:
  * `q` *(required)*: Search term in Arabic or English.

### 1.4 Available Reciters
* **Endpoint**: `GET /api/v1/quran/reciters`

---

## 2. Adhkar Endpoints

### 2.1 Get Categories
* **Endpoint**: `GET /api/v1/adhkar/categories`

### 2.2 Get Adhkar by Category
* **Endpoint**: `GET /api/v1/adhkar/category/{category_id}`
* **Path Parameters**:
  * `category_id`: `morning`, `evening`, `sleep`, or `after_prayer`.

### 2.3 Random Dhikr
* **Endpoint**: `GET /api/v1/adhkar/random`

---

## 3. Hadith Endpoints

### 3.1 Collections List
* **Endpoint**: `GET /api/v1/hadith/collections`

### 3.2 Get Collection
* **Endpoint**: `GET /api/v1/hadith/collection/{collection_id}`
* **Example**: `/api/v1/hadith/collection/nawawi40`

### 3.3 Random Hadith
* **Endpoint**: `GET /api/v1/hadith/random`

### 3.4 Search Hadiths
* **Endpoint**: `GET /api/v1/hadith/search?q={keyword}`

---

## 4. Prayer Times Calculation

### 4.1 Get Calculation Conventions
* **Endpoint**: `GET /api/v1/prayer-times/methods`

### 4.2 Calculate Prayer Times
* **Endpoint**: `GET /api/v1/prayer-times/calculate`
* **Query Parameters**:
  * `latitude` *(float, required)*: e.g. `36.8065` (Tunis)
  * `longitude` *(float, required)*: e.g. `10.1815` (Tunis)
  * `date` *(string, optional)*: `YYYY-MM-DD` (defaults to current date)
  * `timezone` *(float, optional)*: Timezone offset in hours (e.g. `1` for GMT+1)
  * `method` *(string, optional)*: `EGYPT`, `MWL`, `ISNA`, `MAKKAH`, `KARACHI`, `TEHRAN`, `GULF`.
  * `school` *(string, optional)*: `Shafi` or `Hanafi`.
* **Example Response**:
```json
{
  "status": "success",
  "data": {
    "latitude": 36.8065,
    "longitude": 10.1815,
    "date": "2026-09-24",
    "timezone": "UTC+1.0",
    "method": {
      "id": "EGYPT",
      "name": "Egyptian General Authority of Survey"
    },
    "timings": {
      "Imsak": "04:36",
      "Fajr": "04:46",
      "Sunrise": "06:14",
      "Dhuhr": "12:18",
      "Asr": "15:43",
      "Sunset": "18:22",
      "Maghrib": "18:22",
      "Isha": "19:43",
      "Midnight": "00:18"
    }
  }
}
```

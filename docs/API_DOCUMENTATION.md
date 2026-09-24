# API_ISLAM Endpoints Documentation (v2.1)

Welcome to **API_ISLAM** documentation. All responses are in JSON format.

Base URL: `http://localhost:8000` (or your deployed URL)

---

## 1. Quran Endpoints

### 1.1 List all Surahs
* **Endpoint**: `GET /api/v1/quran/surahs`
* **Query Parameters**:
  * `revelation_type` *(optional)*: Filter by `Meccan` or `Medinan`.

### 1.2 Get Surah by Number
* **Endpoint**: `GET /api/v1/quran/surah/{surah_id}`
* **Path Parameters**:
  * `surah_id` *(required)*: Number from 1 to 114.

### 1.3 Search Quran Verses
* **Endpoint**: `GET /api/v1/quran/search?q={keyword}`

### 1.4 Available Reciters
* **Endpoint**: `GET /api/v1/quran/reciters`

---

## 2. Printed Mushaf & Riwayat Endpoints

### 2.1 Get Printed Mushaf Editions
* **Endpoint**: `GET /api/v1/mushaf/editions`
* Returns available printed editions:
  * `quran-hafs-madinah`: مصحف المدينة النبوية (حفص عن عاصم)
  * `quran-tajweed-color`: مصحف التجويد الملون (أحكام التجويد الملونة)
  * `quran-warsh-madinah`: مصحف المدينة (رواية ورش عن نافع)
  * `quran-qaloon-madinah`: مصحف المدينة (رواية قالون عن نافع)
  * `quran-shamerly`: مصحف الشمرلي (15 سطر)
  * `quran-douri`: مصحف الدوري عن أبي عمرو
  * `quran-shuba`: مصحف شعبة عن عاصم
  * `quran-soosi`: مصحف السوسي عن أبي عمرو

### 2.2 Get Mushaf Page Image
* **Endpoint**: `GET /api/v1/mushaf/page/{page_number}?edition={edition_id}`
* **Example**: `/api/v1/mushaf/page/1?edition=quran-hafs-madinah`
* **Response**:
```json
{
  "status": "success",
  "edition": "مصحف المدينة النبوية (حفص عن عاصم)",
  "riwayah": "Hafs",
  "page_number": 1,
  "total_pages": 604,
  "image_url": "https://raw.githubusercontent.com/TheGreatMage/quran-pages-images/master/pages/1.png",
  "svg_url": "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-images/pages/001.svg"
}
```

### 2.3 Get 10 Qira'at & 20 Riwayat
* **Endpoint**: `GET /api/v1/mushaf/riwayat`

---

## 3. Tafsir (Explanations) Endpoints

### 3.1 Get Tafsir Books Catalog
* **Endpoint**: `GET /api/v1/tafsir/books`
* Includes: `ar-muyassar`, `ar-saadi`, `ar-ibn-kathir`, `ar-qurtubi`, `ar-tabari`, `ar-jalalayn`, `ar-baghawi`, `ar-waseet`.

### 3.2 Get Surah Tafsir
* **Endpoint**: `GET /api/v1/tafsir/{tafsir_id}/surah/{surah_number}`
* **Example**: `/api/v1/tafsir/ar-muyassar/surah/1`

### 3.3 Get Ayah Tafsir
* **Endpoint**: `GET /api/v1/tafsir/{tafsir_id}/ayah/{surah_number}/{ayah_number}`
* **Example**: `/api/v1/tafsir/ar-muyassar/ayah/1/1`

---

## 4. Adhkar Endpoints

* **Categories**: `GET /api/v1/adhkar/categories`
* **By Category**: `GET /api/v1/adhkar/category/{category_id}` (`morning`, `evening`, `sleep`, `after_prayer`)
* **Random Daily Dhikr**: `GET /api/v1/adhkar/random`

---

## 5. Hadith Endpoints

* **Collections**: `GET /api/v1/hadith/collections`
* **Get Collection**: `GET /api/v1/hadith/collection/{collection_id}` (e.g. `nawawi40`)
* **Random Hadith**: `GET /api/v1/hadith/random`
* **Search Hadith**: `GET /api/v1/hadith/search?q={keyword}`

---

## 6. Prayer Times Calculation

* **Calculation Methods**: `GET /api/v1/prayer-times/methods`
* **Calculate**: `GET /api/v1/prayer-times/calculate?latitude=36.8065&longitude=10.1815&timezone=1&method=EGYPT`

# 🌿 API_ISLAM (v5.0 Ultimate Islamic Data & Application Engine)

[![CI/CD Pipeline](https://github.com/louaygharsaly2025/API_islam/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/louaygharsaly2025/API_islam/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![npm package](https://img.shields.io/npm/v/api-islam.svg?logo=npm&color=CB3837)](https://www.npmjs.com/package/api-islam)
[![pub package](https://img.shields.io/pub/v/api_islam.svg?logo=dart&color=0175C2)](https://pub.dev/packages/api_islam)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](Dockerfile)
[![Tests](https://img.shields.io/badge/tests-52%20passed-success.svg)](tests/)

The most comprehensive, high-performance, open-source Islamic REST API, Multilingual Data Repository, and Web Application Portal built with **FastAPI**, **Python 3**, **React 19**, and **TailwindCSS**.

---

## 🌟 الأمانة العلمية والمصادر المفتوحة (Scientific Integrity & Attributions)

> [!IMPORTANT]
> حفظاً للأمانة العلمية وحقوق الملكية الفكرية، تم توثيق ونسبة جميع قواعد البيانات والواجهات المدمجة في هذا المشروع لأصحابها الأصليين بكل شفافية ودقة:
> * **موسوعة الحديث الشريف (الكتب الستة)** و **ترجمات القرآن بـ 97 لغة**: تم جمعها وتنسيقها بواسطة المطور **Haseeb Arshad** ([haseebarshad17/quran-hadith-json](https://github.com/haseebarshad17/quran-hadith-json) | [islamapi.vercel.app](https://islamapi.vercel.app/)).
> * **واجهة الفتح ويب (AlFath – Muslim Daily)**: تم تطويرها بالكامل بواسطة **Fatkhur Rahman** ([fatkhurrhn](https://github.com/fatkhurrhn) | [alfathh.vercel.app](https://alfathh.vercel.app/)).
> * **المصحف الشريف والروايات الـ 9**: صادرة عن **مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة** ([qurancomplex.gov.sa](https://qurancomplex.gov.sa/)).
> * **ترجمات القرآن الأكاديمية**: مشاريع **Tanzil Project** ([tanzil.net](http://tanzil.net)) و **QuranEnc** ([quranenc.com](https://quranenc.com)).
>
> 📖 للمطالعة الكاملة لبيانات الترخيص والمؤلفين وشروط الاستخدام: **[`docs/SOURCES_AND_ATTRIBUTIONS.md`](docs/SOURCES_AND_ATTRIBUTIONS.md)**.

---

## 📦 Official Client Libraries & SDKs (حزم ومكتبات المطورين)

Official packages are published and maintained for rapid integration into web and mobile applications:

| Platform / Ecosystem | Package | Installation | Package Registry |
| :--- | :--- | :--- | :--- |
| **Flutter / Dart** | [`api_islam`](packages/api_islam) | `flutter pub add api_islam` | [![pub package](https://img.shields.io/pub/v/api_islam.svg?logo=dart&color=0175C2)](https://pub.dev/packages/api_islam)<br>[pub.dev/packages/api_islam](https://pub.dev/packages/api_islam) |
| **Node.js / JS / TS** | [`api-islam`](packages/api-islam-js) | `npm install api-islam` | [![npm package](https://img.shields.io/npm/v/api-islam.svg?logo=npm&color=CB3837)](https://www.npmjs.com/package/api-islam)<br>[npmjs.com/package/api-islam](https://www.npmjs.com/package/api-islam) |

---

## 🚀 ما الجديد في الإصدار v5.0 (What's New in v5.0)

1. **📜 محرك الكتب الستة في الحديث الشريف (Kutub as-Sittah Engine)**:
   * قاعدة بيانات متكاملة تضم **34,100+ حديث نبوي شريف** باللغتين العربية والإنجليزية.
   * تشمل: **صحيح البخاري** (7,277 حديثاً)، **صحيح مسلم** (7,459 حديثاً)، **سنن أبي داود** (5,276 حديثاً)، **جامع الترمذي** (4,053 حديثاً)، **سنن النسائي** (5,685 حديثاً)، **سنن ابن ماجه** (4,345 حديثاً)، و**الأربعون النووية** (42 حديثاً).
   * خوارزمية بحث واسترجاع $O(1)$ سريعة جداً للحديث المباشر برقمه في الكتاب دون استهلاك الذاكرة.
   * قراءة ثنائية اللغة (`lang=both` أو `lang=ar` أو `lang=en`) مع أحكام التخريج والرواة.
2. **🌍 محرك ترجمات القرآن الكريم بـ 97 لغة (Multilingual Quran Translations)**:
   * ترجمات معتمدة لآيات وسور القرآن الـ 114 كاملة بـ **97 لغة عالمية** (الإنجليزية، الفرنسية، الأردية، الإندونيسية، الروسية، التركية، الألمانية، الإسبانية، الصينية، الهندية، وغيرها).
   * استعلام فوري عن ترجمة السورة كاملة أو الآية المفردة.
   * بيانات شاملة لمصادر الترجمة، أسماء المترجمين، واتجاه النصوص (RTL / LTR).
3. **🕌 تطبيق الفتح ويب المتكامل (AlFath Muslim Daily Frontend)**:
   * واجهة ويب عصرية مدمجة في مجلد [`frontend/`](frontend) مبنية بـ React 19 و Vite و TailwindCSS تضم المصحف التفاعلي، مواقيت الصلاة، اتجاه القبلة، الأذكار، والتقويم الهجري.

---

## 🌟 Core Features & Modules (أبرز الوحدات والخدمات)

* **📖 Holy Quran & 9 Qira'at (KFGQPC)**: Complete text for 114 Surahs and 6,236 Ayahs across 9 authentic narrations (**Hafs**, **Warsh**, **Qaloon**, **Shouba**, **Doori**, **Soosi**, **Bazzi**, **Qumbul**, **Hafs-Smart**), with Uthmanic fonts and fast search.
* **📜 Kutub as-Sittah & Hadith Engine**: 34,100+ Hadiths with English/Arabic translations, chapters, narrators, and O(1) number lookups.
* **🌍 97+ Language Quran Editions**: Full Quran translations for 97 languages with author metadata and single verse lookup.
* **🎨 Character-Level Tajweed Engine**: 18 Tajweed rules catalog with precise Unicode codepoint offsets and pre-rendered colored HTML strings for mobile/web apps.
* **🖼️ High-Res Printed Mushaf**: 604 high-resolution printed pages streamed directly from local storage with ultra-fast caching headers (**Hafs**, **Warsh 'an Nafi'**, **Color-coded Tajweed**).
* **✨ 99 Names of Allah (Asmaul Husna)**: Complete list with Arabic calligraphy names, transliterations, English meanings, and comprehensive explanations.
* **🤲 Duas & Ruqyah Shariah**: 40 Quranic Rabbana supplications and authentic Ruqyah verses and prophetic invocations.
* **📚 Authentic Tafsir**: Books catalog including **Al-Muyassar**, **As-Sa'di**, **Ibn Kathir**, **Al-Qurtubi**, **Al-Tabari**, and **Al-Jalalayn**.
* **🕌 Astronomical Prayer Times**: Exact calculation engine based on pure solar algorithms for any GPS coordinates.
* **🧭 Qibla Direction**: Great-circle navigation algorithm providing exact degree bearing to the Holy Kaaba and distance in kilometers.
* **📅 Hijri Calendar & Islamic Events**: Gregorian <-> Hijri bidirectional conversion with annual Islamic holidays and occasions.
* **📻 Live Quran Radios**: 24/7 streaming MP3 radios (Makkah, Cairo, Alafasy, Abdul Basit, Al-Minshawi, Al-Muaiqly, Al-Husary, Ruqyah, Tafsir).
* **💰 Islamic Zakat Calculator**: Nisab thresholds (Gold/Silver) and zakat calculation on cash, gold, silver, investments, and trade assets.
* **⚡ Interactive Docs & Postman**: Built-in Swagger UI (`/docs`), ReDoc (`/redoc`), and 1-click test file (`api_requests.http`).
* **🐳 Docker & CI/CD**: Production-ready `Dockerfile`, `docker-compose.yml`, and GitHub Actions CI/CD with 52 automated unit tests (100% pass).

---

## 📁 Directory Structure (هيكلية المشروع)

```text
API_islam/
├── app/                        # FastAPI application source code
│   ├── main.py                 # Application entrypoint & UI portal
│   ├── routers/                # 13 Modules (quran, hadith, mushaf, tajweed, tafsir, ...)
│   └── services/               # Astronomical & Mathematical engines (Prayer, Qibla, Hijri, Zakat)
├── frontend/                   # AlFath - Muslim Daily Web App (React 19 + Vite + TailwindCSS)
│   ├── src/                    # Pages, components, prayer times, quran, calendar, games
│   ├── package.json            # Frontend dependencies
│   └── README.md               # Frontend setup and attribution
├── packages/                   # Official Published SDKs
│   ├── api_islam/              # Flutter / Dart SDK (pub.dev/packages/api_islam)
│   └── api-islam-js/           # TypeScript / Node.js SDK (npmjs.com/package/api-islam)
├── data/                       # Comprehensive Datasets
│   ├── hadith/                 # Kutub as-Sittah (34,100+ hadiths, book-wise & chapter-wise)
│   ├── quran/edition/          # 97 Multilingual Quran translation editions
│   ├── quran/metadata.json     # 114 Surahs, 30 Juz, 14 Sajdah verses, and translation sources
│   ├── quran_kfgqpc/           # 9 King Fahd Complex Qira'at editions
│   ├── mushaf/                 # 604 high-res Mushaf pages
│   └── adhkar/, duas/, ...     # Adhkar, Duas, Radios, Tafsir, Tajweed rules
├── schemas/                    # Formal JSON Schemas for validation
├── tests/                      # 52 Automated Unit & Integration Tests (Pytest - 100% pass)
├── scripts/                    # Automation & sync scripts (validate, download, generate)
├── examples/                   # Ready-to-use SDK Clients (Flutter, JS, Python, HTML Flip Viewer)
├── docs/                       # Detailed Documentation & Attributions
│   ├── SOURCES_AND_ATTRIBUTIONS.md # التوثيق الشامل للأمانة العلمية والمصادر والرخص
│   ├── COMPLETE_GUIDE.md       # Complete user guide
│   └── API_DOCUMENTATION.md    # API reference
├── Dockerfile                  # Container build
├── docker-compose.yml          # Compose orchestration
├── requirements.txt            # Python dependencies
├── api_requests.http           # 1-Click Interactive REST tester
└── LICENSE                     # MIT License
```

---

## 🌐 أبرز نقاط الاتصال البرمجية (Core API Endpoints)

### 1. الأحاديث النبوية والكتب الستة (`/api/v1/hadith`)
| الطريقة | Endpoint | الوصف |
| :--- | :--- | :--- |
| `GET` | `/api/v1/hadith/books` | قائمة أمهات كتب الحديث الستة + الأربعون النووية مع الإحصائيات |
| `GET` | `/api/v1/hadith/book/{book_id}` | تفاصيل الكتاب وفهرس الأبواب ونطاقات الأحاديث |
| `GET` | `/api/v1/hadith/book/{book_id}/chapters` | قائمة أبواب وفصول الكتاب مع العناوين بالعربية والإنجليزية |
| `GET` | `/api/v1/hadith/book/{book_id}/chapter/{no}?lang=both` | أحاديث باب محدد بنصوص عربية وإنجليزية مدمجة |
| `GET` | `/api/v1/hadith/book/{book_id}/hadith/{no}` | جلب حديث محدد برقمه في الكتاب بلحظات $O(1)$ |
| `GET` | `/api/v1/hadith/random?book=bukhari` | جلب حديث عشوائي من كتاب معين أو من جميع الكتب |
| `GET` | `/api/v1/hadith/search?q=النية` | البحث السريع في نصوص الأحاديث بالكلمات المفتاحية |

### 2. القرآن والترجمات بـ 97 لغة (`/api/v1/quran`)
| الطريقة | Endpoint | الوصف |
| :--- | :--- | :--- |
| `GET` | `/api/v1/quran/editions` | الروايات الـ 9 لمجمع الملك فهد (حفص، ورش، قالون، ...) |
| `GET` | `/api/v1/quran/metadata` | بيانات القرآن الشاملة (114 سورة، 30 جزء، 14 سجدة) |
| `GET` | `/api/v1/quran/translations/languages` | قائمة الـ 97 لغة ترجمة المتوفرة مع بيانات المترجمين |
| `GET` | `/api/v1/quran/translations/{lang}/surah/{id}` | ترجمة سورة كاملة إلى أي لغة من الـ 97 لغة |
| `GET` | `/api/v1/quran/translations/{lang}/ayah/{s_id}/{a_id}` | ترجمة آية مفردة إلى اللغة المختارة |

---

## 🚀 Quick Start (التشغيل السريع)

### 1. تشغيل الخادم الخلفي (Backend API)
```bash
# تثبيت الحزم
pip install -r requirements.txt

# تشغيل الخادم
uvicorn app.main:app --reload --port 8000
```
* **Swagger UI التفاعلي**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc التوثيقي**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
* **بوابة الويب الرئيسية**: [http://localhost:8000/](http://localhost:8000/)

### 2. تشغيل واجهة الفتح ويب (Frontend App)
```bash
cd frontend
npm install
npm run dev
```
تفتح الواجهة على: [http://localhost:4567](http://localhost:4567).

### 3. تشغيل الاختبارات الآلية (Run Automated Tests)
```bash
python -m pytest -v
```
**النتيجة**: 52 اختباراً يمر بنجاح تام (100% Pass).

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE). All sacred Islamic texts (Quran and Hadith) belong to the entire Muslim Ummah and humanity.

**louay gharsaly 2026**

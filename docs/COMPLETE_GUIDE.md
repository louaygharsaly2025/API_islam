# 📖 الدليل الشامل لمشروع API_ISLAM (Comprehensive Developer & Architecture Guide)

مرحباً بك في التوثيق الشامل لمشروع **API_ISLAM** - أقوى وأشمل واجهة برمجية إسلامية مفتوحة المصدر مبنية باستخدام **FastAPI** و **Python 3**.

---

## 📑 فهرس المحتويات
1. [نظرة عامة على المشروع](#-1-نظرة-عامة-على-المشروع)
2. [الميزات والخدمات المتاحة بالكامل](#-2-الميزات-والخدمات-المتاحة-بالكامل)
3. [الهيكل المعماري للنظام (System Architecture)](#-3-الهيكل-المعماري-للنظام)
4. [مرجع الـ Endpoints الكامل](#-4-مرجع-الـ-endpoints-الكامل)
5. [كيفية الدمج في التطبيقات (Flutter, React, Node, Python)](#-5-كيفية-الدمج-في-التطبيقات)
6. [التشغيل المحلي و Docker](#-6-التشغيل-المحلي-و-docker)
7. [النشر السحابي (Deployment Guide)](#-7-النشر-السحابي)
8. [الـ CI/CD Pipeline واختبارات الجودة](#-8-الـ-cicd-pipeline-واختبارات-الجودة)

---

## 🌟 1. نظرة عامة على المشروع

تم تصميم هذا المشروع ليكون حلاً مركزياً موثوقاً لجميع المطورين والمؤسسات التي تبني تطبيقات إسلامية (تطبيقات الموبايل، مواقع الويب، أنظمة الشاشات في المساجد، البوتات الذكية).

### أبرز ما يميز المشروع:
* **سرعة فائقة (High-Performance)**: مبني بنظام `Asynchronous ASGI` مع `Uvicorn` و `FastAPI`.
* **دقة فلكية عالية**: حساب مواقيت الصلاة واتجاه القبلة رياضياً بدون الاعتماد على خدمات خارجية.
* **دعم متعدد الروايات والمصاحف**: قالون عن نافع، ورش عن نافع، حفص عن عاصم، مصحف التجويد الملون، الشمرلي.
* **جاهز للإنتاج (Production-Ready)**: مدعوم بـ Dockerfile، Docker Compose، CI/CD Pipeline، واختبارات آلية 100%.

---

## 🚀 2. الميزات والخدمات المتاحة بالكامل

| الخدمة | الوصف | الرابط الأساسي |
| :--- | :--- | :--- |
| **📖 القرآن الكريم** | 114 سورة، آيات، تفاسير، تلاوات، بحث فوري | `/api/v1/quran` |
| **🖼️ المصاحف الورقية** | 604 صفحة عالية الدقة (حفص، ورش، قالون، تجويد) | `/api/v1/mushaf` |
| **📚 كتب التفاسير** | الميسر، السعدي، ابن كثير، القرطبي، الطبري، الجلالين | `/api/v1/tafsir` |
| **🤲 الأذكار والأدعية** | أذكار الصباح والمساء والنوم وبعد الصلاة | `/api/v1/adhkar` |
| **📜 الأحاديث النبوية** | الأربعون النووية مع المتن والتخريج والبحث | `/api/v1/hadith` |
| **🕌 مواقيت الصلاة** | حساب فلكي حسب إحداثيات GPS لجميع دول العالم | `/api/v1/prayer-times` |
| **🧭 اتجاه القبلة** | حساب زاوية البوصلة والمسافة الدقيقة إلى الكعبة | `/api/v1/qibla` |
| **📅 التقويم الهجري** | تحويل التواريخ ومتابعة المناسبات والأعياد الإسلامية | `/api/v1/hijri` |
| **📻 إذاعات القرآن** | بث مباشر لإذاعة مكة والقاهرة وكبار القراء | `/api/v1/radios` |

---

## 🏗️ 3. الهيكل المعماري للنظام

```text
API_islam/
├── app/                        # تطبيق FastAPI الرئيسي
│   ├── main.py                 # نقطة الدخول، إعداد CORS، والواجهة التفاعلية
│   ├── routers/                # الـ Endpoints مقسمة حسب الخدمات
│   │   ├── quran.py            # القرآن الكريم والتلاوات
│   │   ├── mushaf.py           # المصاحف المصورة والروايات
│   │   ├── tafsir.py           # كتب وشروح التفسير
│   │   ├── adhkar.py           # أذكار المسلم
│   │   ├── hadith.py           # الأحاديث النبوية
│   │   ├── prayer_times.py     # مواقيت الصلاة
│   │   ├── qibla.py            # اتجاه القبلة
│   │   ├── hijri.py            # التقويم الهجري
│   │   └── radios.py           # إذاعات القرآن المباشرة
│   └── services/               # المحركات الحسابية والفلكية
│       ├── prayer_calculator.py# خوارزمية حساب مواقيت الصلاة الفلكية
│       ├── qibla_calculator.py # خوارزمية حساب زاوية القبلة الكروية
│       └── hijri_calendar.py   # خوارزمية التحويل الهجري والمناسبات
├── data/                       # قاعدة البيانات المحلية (JSON Datasets)
├── schemas/                    # ملفات JSON Schema للتحقق من سلامة البيانات
├── tests/                      # الاختبارات الآلية (Pytest Suite)
├── scripts/                    # أدوات التنزيل والمزامنة والتحقق
├── examples/                   # كلاسات وعينات كود جاهزة (Flutter, JS, Python)
├── .github/workflows/          # الـ CI/CD Pipeline عبر GitHub Actions
├── Dockerfile                  # ملف البناء السحابي
└── docker-compose.yml          # إدارة وتشغيل الحاويات
```

---

## 📡 4. مرجع الـ Endpoints الكامل

### 1. القرآن الكريم (`/api/v1/quran`)
* `GET /surahs`: قائمة السور كاملة مع الفلاتر (`revelation_type=Meccan|Medinan`).
* `GET /surah/{id}`: سورة كاملة بآياتها وترجماتها وروابط الصوت.
* `GET /search?q={keyword}`: بحث فوري في النصوص القرآنية باللغة العربية أو الإنجليزية.
* `GET /reciters`: قائمة القراء المتاحين وروابط تلاواتهم.

### 2. المصاحف الورقية المصورة (`/api/v1/mushaf`)
* `GET /editions`: المصاحف المتاحة (المدينة، التجويد، ورش، قالون، الشمرلي).
* `GET /page/{number}?edition={id}`: رابط صورة الصفحة عالية الدقة (PNG/SVG) مع رقم الجزء، الحزب، السورة وموقع الصفحة (يمين/يسار).
* `GET /surah/{number}/page`: معرفة رقم الصفحة التي تبدأ فيها أي سورة.
* `GET /riwayat`: دليل القراءات العشر والروايات العشرين.

### 3. كتب التفاسير (`/api/v1/tafsir`)
* `GET /books`: قائمة كتب التفسير (الميسر، السعدي، ابن كثير، إلخ).
* `GET /{tafsir_id}/surah/{number}`: تفسير سورة كاملة.
* `GET /{tafsir_id}/ayah/{surah}/{ayah}`: تفسير آية محددة.

### 4. اتجاه القبلة (`/api/v1/qibla`)
* `GET /calculate?latitude={lat}&longitude={lng}`
  * **النتيجة**: درجة الزاوية من الشمال الحقيقي (0°-360°)، اتجاه البوصلة (مثلاً `SE` - جنوب شرق)، والمسافة بالكيلومترات إلى الكعبة المشرفة.

### 5. التقويم الهجري والمناسبات (`/api/v1/hijri`)
* `GET /today?adjustment=0`: تاريخ اليوم بالهجري والميلادي مع اسم اليوم والشهر الهجري بالعربية والإنجليزية.
* `GET /convert?date_str=YYYY-MM-DD`: تحويل أي تاريخ ميلادي إلى هجري.
* `GET /events?year=1448`: جدول المناسبات الإسلامية (رمضان، الأعياد، يوم عرفة، الإسراء والمعراج).

### 6. مواقيت الصلاة (`/api/v1/prayer-times`)
* `GET /methods`: طرق الحساب المعتمدة (هيئة المساحة المصرية، أم القرى، رابطة العالم الإسلامي، إلخ).
* `GET /calculate?latitude={lat}&longitude={lng}&timezone={tz}&method={method}&school=Shafi|Hanafi`
  * **النتيجة**: أوقات (الإمساك، الفجر، الشروق، الظهر، العصر، الغروب، المغرب، العشاء، منتصف الليل).

### 7. إذاعات القرآن المباشرة (`/api/v1/radios`)
* `GET /radios?category=live_station|reciter|adhkar|educational`
  * **النتيجة**: روابط بث مباشر MP3 شغال 24/7.

---

## 💻 5. كيفية الدمج في التطبيقات

### أمثلة الكود الجاهزة للنسخ داخل مجلد `examples/`:
* **Flutter**: [flutter_client.dart](file:///C:/Users/louaygharsaly/Desktop/API_islam/examples/flutter_client.dart) و [flutter_mushaf_view.dart](file:///C:/Users/louaygharsaly/Desktop/API_islam/examples/flutter_mushaf_view.dart).
* **JavaScript / TypeScript / React / Node**: [js_client.js](file:///C:/Users/louaygharsaly/Desktop/API_islam/examples/js_client.js).
* **Python**: [python_client.py](file:///C:/Users/louaygharsaly/Desktop/API_islam/examples/python_client.py).
* **Interactive Web Flip Viewer**: [mushaf_flip_viewer.html](file:///C:/Users/louaygharsaly/Desktop/API_islam/examples/mushaf_flip_viewer.html).

---

## 🐳 6. التشغيل المحلي و Docker

### التشغيل بواسطة Python المباشر:
```bash
# تثبيت المكتبات
pip install -r requirements.txt

# تشغيل السيرفر
uvicorn app.main:app --reload --port 8000
```

### التشغيل بواسطة Docker:
```bash
docker compose up -d --build
```

---

## ☁️ 7. النشر السحابي (Deployment)

### النشر على Render.com (مجاني وسهل):
1. اذهب إلى [Render.com](https://render.com) وسجل الدخول بحساب GitHub.
2. انقر على **New +** ثم **Web Service**.
3. اختر الـ Repository `API_islam`.
4. اختر Runtime: **Docker**.
5. انقر على **Deploy Web Service** - وسيصبح لديك رابط مباشر متاح للعالم!

---

## 🛡️ 8. الـ CI/CD Pipeline واختبارات الجودة

المشروع مزود بـ 25 اختباراً آلياً تغطي كافة الـ Endpoints.

### تشغيل الاختبارات محلياً:
```bash
python -m pytest -v
```

كل عملية `git push` تفحص أوتوماتيكياً:
1. التحقق من سلامة وصحة ملفات JSON مع الـ Schemas.
2. تشغيل حزمة الـ Tests على Python 3.11 و 3.12 و 3.13.
3. بناء صورة الـ Docker واختبار استجابة الـ Healthcheck.

---

**louay gharsaly 2026**

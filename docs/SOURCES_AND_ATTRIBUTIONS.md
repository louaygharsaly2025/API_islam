# 📜 الأمانة العلمية، المصادر والحقوق (Academic Integrity, Sources & Attributions)

هذا المستند مخصص لتوثيق **جميع المصادر، المؤلفين، المطورين، وحقوق الملكية الفكرية** لكل البيانات والأكواد البرمجية المدمجة في مشروع **`API_ISLAM`** حفظاً للأمانة العلمية وامتثالاً لقيم الشفافية ورخص البرمجيات مفتوحة المصدر (Open Source Licenses).

This document serves as the **official attribution and provenance registry** for all datasets, APIs, and frontend assets integrated into **`API_ISLAM`**, strictly honoring the intellectual property and open-source contributions of original authors.

---

## 📑 فهرس المصادر (Table of Attributions)

| المكون / Dataset | المصدر الأصلي / Source | المؤلف / Author / Maintainer | الترخيص / License | مجلد المشروع / Local Path |
| :--- | :--- | :--- | :--- | :--- |
| **موسوعة الحديث الشريف (الكتب الستة)** | [haseebarshad17/quran-hadith-json](https://github.com/haseebarshad17/quran-hadith-json) | **Haseeb Arshad** (`haseebarshad17`) | MIT / Open Data | `data/hadith/` |
| **ترجمات القرآن بـ 97 لغة** | [quran-hadith-json (edition)](https://github.com/haseebarshad17/quran-hadith-json) | **Haseeb Arshad** & Tanzil / QuranEnc | Open Data | `data/quran/edition/` |
| **واجهة الفتح ويب (Frontend)** | [alfathh.vercel.app](https://alfathh.vercel.app/) | **Fatkhur Rahman** (`fatkhurrhn`) | MIT / Open Source | `frontend/` |
| **مصحف وروايات مجمع الملك فهد** | [مجمع الملك فهد لطباعة المصحف الشريف](https://qurancomplex.gov.sa/) | **KFGQPC (Madinah Munawwarah)** | الملكية العامة للأمة الإسلامية | `data/quran_kfgqpc/`, `static/` |
| **محرك التجويد الملون وقواعده** | [Global Quran / Quran.com API](https://quran.com) | Open Islamic Data | Creative Commons | `data/tajweed/`, `app/routers/tajweed.py` |
| **الأربعون النووية** | الإمام محيي الدين يحيى بن شرف النووي | الإمام النووي (ت 676 هـ) | وقف لله تعالى (Public Domain) | `data/hadith/nawawi40.json` |
| **مواقيت الصلاة الفلكية والقبلة** | NOAA Solar Calculations & PrayTimes.org | Astronomical Algorithms (Jean Meeus) | MIT | `app/services/prayer_times.py` |

---

## 1. 📜 موسوعة الحديث الشريف والكتب الستة (Kutub as-Sittah Hadith Engine)

تم دمج أضخم قاعدة بيانات مهيكلة لكتب الحديث النبوي الستة المعتمدة لدى أهل السنة والجماعة، بالإضافة إلى الأربعون النووية، بإجمالي **34,100+ حديث نبوي شريف** باللغتين العربية والإنجليزية.

* **المصدر والجامع البرمجي (Original Curator)**:
  * **Haseeb Arshad** (`haseebarshad17`)
  * مستودع جيت هاب: [https://github.com/haseebarshad17/quran-hadith-json](https://github.com/haseebarshad17/quran-hadith-json)
  * خدمة الـ API المباشرة: [https://islamapi.vercel.app/](https://islamapi.vercel.app/)
* **أمهات كتب السنة المدمجة**:
  1. **صحيح البخاري (Sahih al-Bukhari)**: للإمام محمد بن إسماعيل البخاري (ت 256 هـ) - 7,277 حديثاً في 97 كتاباً/باباً. الترجمة الإنجليزية: Dr. Muhammad Muhsin Khan.
  2. **صحيح مسلم (Sahih Muslim)**: للإمام مسلم بن الحجاج النيسابوري (ت 261 هـ) - 7,459 حديثاً في 57 كتاباً/باباً. الترجمة الإنجليزية: Abdul Hamid Siddiqui.
  3. **سنن أبي داود (Sunan Abi Dawud)**: للإمام سليمان بن الأشعث السجستاني (ت 275 هـ) - 5,276 حديثاً في 43 كتاباً/باباً. الترجمة الإنجليزية: Prof. Ahmad Hasan.
  4. **جامع الترمذي (Jami` at-Tirmidhi)**: للإمام محمد بن عيسى الترمذي (ت 279 هـ) - 4,053 حديثاً في 49 كتاباً/باباً.
  5. **سنن النسائي (Sunan an-Nasa'i)**: للإمام أحمد بن شعيب النسائي (ت 303 هـ) - 5,685 حديثاً في 51 كتاباً/باباً.
  6. **سنن ابن ماجه (Sunan Ibn Majah)**: للإمام محمد بن يزيد بن ماجه القزويني (ت 273 هـ) - 4,345 حديثاً في 38 كتاباً/باباً.
  7. **الأربعون النووية (An-Nawawi 40)**: للإمام يحيى بن شرف النووي (ت 676 هـ).
* **الملفات المدمجة في المشروع**:
  * `data/hadith/book-wise/`: بيانات شاملة لكل كتاب بنصوصه العربية والإنجليزية والفهارس.
  * `data/hadith/chapter-wise/`: ملفات مقسمة لكل باب وفصل لتوفير استجابة برمجية فائقة السرعة دون استهلاك الذاكرة.
  * `app/routers/hadith.py`: محرك البحث، الاستعلام عن الأبواب، جلب الحديث برقمه الثنائي اللغة، ومولد الأحاديث العشوائية.

---

## 2. 🌍 ترجمات القرآن الكريم بـ 97 لغة (Multilingual Quran Translations)

تم دمج قاعدة بيانات ترجمات القرآن الكريم إلى 97 لغة عالمية مع كامل بيانات المترجمين، مصادر الترجمة، واتجاه القراءة (LTR / RTL).

* **المصدر وجامع البيانات**:
  * **Haseeb Arshad** عبر مستودع [quran-hadith-json](https://github.com/haseebarshad17/quran-hadith-json/tree/main/quran)
* **المؤسسات والمصادر الأصلية للترجمات**:
  * **مشروع تنزيل (Tanzil Project)**: [http://tanzil.net](http://tanzil.net)
  * **مركز رواد الترجمة وقرآن إنسك (QuranEnc)**: [https://quranenc.com](https://quranenc.com)
  * **مجمع الملك فهد لطباعة المصحف الشريف**: [https://qurancomplex.gov.sa/](https://qurancomplex.gov.sa/)
  * **Islamic Invitation & Goodword Books**
* **أبرز اللغات المتوفرة (97 لغة)**:
  * الإنجليزية (Abdel Haleem, Sahih International, Yusuf Ali, Pickthall)
  * الفرنسية (Islamic Foundation, Muhammad Hamidullah)
  * الإندونيسية (Kementerian Agama RI)
  * الأردية (Maulana Muhammad Junagarhi, Tahir ul Qadri)
  * التركية (Diyanet Isleri, Elmalili Hamdi Yazir)
  * الروسية (Elmir Kuliev, Abu Adel)
  * الألمانية (Abu Rida, Bubenheim & Elyas)
  * الإسبانية (Raul Gonzalez Bornez, Muhammad Isa Garcia)
  * الفارسية، الإيطالية، الصينية، الكورية، اليابانية، الهندية، البنغالية، السواحيلية، الهوسا، وغيرها...
* **الملفات المدمجة في المشروع**:
  * `data/quran/edition/`: المجلدات الفرعية الـ 97.
  * `data/quran/metadata.json`: بيانات المصادر وسور القرآن وأجزائه وآيات السجدة.
  * `app/routers/quran.py`: نقاط اتصال `translations/languages`, `translations/{lang}/surah/{id}`, `translations/{lang}/ayah/{s_id}/{a_id}`.

---

## 3. 🕌 بوابة الفتح ويب (AlFath – Muslim Daily Web Application)

تطبيق ويب حديث متكامل للمسلم تم تصميمه بالواجهات التفاعلية الحديثة والأنظمة الذكية لمرافقة المسلم في عبادته اليومية.

* **المطور الأصلي (Original Author)**:
  * **Fatkhur Rahman** (`fatkhurrhn`)
  * رابط المشروع المنشور: [https://alfathh.vercel.app/](https://alfathh.vercel.app/)
  * اسم المشروع: `islamic-fatkhurrhn` / `AlFath - Muslim Daily`
* **التقنيات المستخدمة**:
  * **React 19** & **Vite 7**
  * **TailwindCSS 3.4**
  * **Remix Icon**
  * **React Router DOM 7**
  * **Firebase SDK**
* **المسار في المشروع**:
  * مجلد `frontend/`: يحتوي على الكود المصدري الكامل مع كافة المكونات (`src/components/`, `src/pages/`, `src/assets/`).
  * تم الاحتفاظ بملف `frontend/README.md` الأصلي مع توضيح خطوات التشغيل والربط بـ API_ISLAM.

---

## 4. 📖 المصحف الشريف والروايات (King Fahd Complex - KFGQPC)

* **الجهة المصدرة**: مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة، المملكة العربية السعودية.
* **البيانات المستخدمة**:
  * النص العثماني المعتمد وفق المصحف الشريف.
  * نصوص الروايات القرآنية الـ 9: حفص عن عاصم، ورش عن نافع، قالون عن نافع، شعبة عن عاصم، الدوري عن أبي عمرو، السوسي عن أبي عمرو، البزي عن ابن كثير، قنبل عن ابن كثير، وحفص للأجهزة الذكية.
  * خطوط المجمع الرقمية الرسمية (`hafs.18.woff2`, `warsh.10.woff2`, `qaloon.10.woff2`...).
  * صفحات المصحف المصورة عالية الدقة (604 صفحة) في `data/mushaf/pages/`.

---

## 5. ⚖️ شروط الاستخدام والترخيص (License & Usage Terms)

* كود مشروع **`API_ISLAM`** مطروح تحت رخصة **MIT License**.
* النصوص القرآنية والأحاديث النبوية الشريفة هي نصوص مقدسة وقفية مخصصة لخدمة المسلمين وكافة البشرية دون احتكار.
* جميع الأعمال البرمجية وقواعد البيانات المقتبسة مذكورة بنسبتها الكاملة لمطوريها، ويحظر إزالة بيانات الحقوق أو نسب هذه التجميعات لغير أصحابها.

---

**تم التحديث بتاريخ 15/10/2026**
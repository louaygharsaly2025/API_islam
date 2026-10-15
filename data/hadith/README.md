# 📜 بيانات الحديث الشريف (Hadith Datasets & Kutub as-Sittah)

يحتوي هذا المجلد على البيانات المهيكلة لأمهات كتب السنة النبوية الشريفة (الكتب الستة) بالإضافة إلى الأربعين النووية.

## 📚 الكتب المتاحة (Available Collections)

| المعرف (ID) | اسم الكتاب بالعربية | Book Name (English) | المؤلف (Author) | عدد الأحاديث | عدد الأبواب |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `bukhari` | **صحيح البخاري** | Sahih al-Bukhari | الإمام محمد بن إسماعيل البخاري | 7,277 | 97 |
| `muslim` | **صحيح مسلم** | Sahih Muslim | الإمام مسلم بن الحجاج النيسابوري | 7,459 | 57 |
| `abudawud` | **سنن أبي داود** | Sunan Abi Dawud | الإمام سليمان بن الأشعث السجستاني | 5,276 | 43 |
| `tirmidhi` | **جامع الترمذي** | Jami` at-Tirmidhi | الإمام محمد بن عيسى الترمذي | 4,053 | 49 |
| `nasai` | **سنن النسائي** | Sunan an-Nasa'i | الإمام أحمد بن شعيب النسائي | 5,685 | 51 |
| `ibnmajah` | **سنن ابن ماجه** | Sunan Ibn Majah | الإمام محمد بن يزيد بن ماجه القزويني | 4,345 | 38 |
| `nawawi40` | **الأربعون النووية** | An-Nawawi 40 Hadiths | الإمام يحيى بن شرف النووي | 42 | 1 |
| **المجموع** | | | | **34,100+** | **336** |

---

## 📁 هيكلية المجلد (Directory Layout)

```text
data/hadith/
├── nawawi40.json                 # الأربعون النووية بنصوصها العربية والإنجليزية والشرح
├── book-wise/                    # ملفات الكتب المجمعة الشاملة
│   ├── metadata.json             # فهرس وبيانات جميع الكتب وأبوابها ونطاقات الأحاديث
│   ├── bukhari/                  # (arabic.json, english.json, metadata.json)
│   ├── muslim/                   # (arabic.json, english.json, metadata.json)
│   ├── abudawud/                 # (arabic.json, english.json, metadata.json)
│   ├── tirmidhi/                 # (arabic.json, english.json, metadata.json)
│   ├── nasai/                    # (arabic.json, english.json, metadata.json)
│   └── ibnmajah/                 # (arabic.json, english.json, metadata.json)
└── chapter-wise/                 # ملفات مقسمة بالأبواب لسرعة استجابة برمجية فائقة
    ├── bukhari/arabic/chapter{N}.json
    ├── bukhari/english/chapter{N}.json
    └── ... (لجميع الكتب الستة)
```

---

## 🔗 المصدر والأمانة العلمية (Attribution & Source)

* تم إعداد هذه التجميعة وتجهيزها برمجياً بواسطة **Haseeb Arshad** (`haseebarshad17`).
* رابط المشروع الأصلي: [https://github.com/haseebarshad17/quran-hadith-json](https://github.com/haseebarshad17/quran-hadith-json)
* خدمة الـ API المباشرة: [https://islamapi.vercel.app/](https://islamapi.vercel.app/)
* الترجمات الإنجليزية المعتمدة: د. محمد محسن خان (البخاري)، عبد الحميد صديقي (مسلم)، أ.د. أحمد حسن (أبو داود).
* للمزيد راجع: [`docs/SOURCES_AND_ATTRIBUTIONS.md`](../../docs/SOURCES_AND_ATTRIBUTIONS.md).

---

**تم التحديث بتاريخ 15/10/2026**
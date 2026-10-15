# 🌍 ترجمات القرآن الكريم بـ 97 لغة (Multilingual Quran Translations)

يحتوي هذا المجلد على ترجمات معتمدة لآيات وسور القرآن الكريم الـ 114 موزعة على **97 لغة عالمية**.

## 📊 إحصائيات الترجمات (Translation Stats)
* **إجمالي اللغات المتوفرة**: 97 لغة عالمية.
* **إجمالي السور المترجمة**: 114 سورة كاملة لكل لغة.
* **عدد الآيات**: 6,236 آية كريمة.
* **اتجاه النص**: يدعم لغات اليمين إلى اليسار (RTL مثل الأردية، الفارسية، الداري، الديفيهي) ولغات اليسار إلى اليمين (LTR).

---

## 🗂️ هيكل البيانات (Data Schema)

كل لغة داخل مجلد خاص بها يحتوي على ملف `array.json`:
```json
[
  {
    "chapter": 1,
    "versesCount": 7,
    "verses": [
      "In the name of God, the Lord of Mercy, the Giver of Mercy",
      "Praise belongs to God, Lord of the Worlds",
      ...
    ]
  },
  ...
]
```

---

## 🔗 المصادر والأمانة العلمية (Attribution & Sources)

* مأخوذة من تجميعة **Haseeb Arshad** عبر مستودع:
  [https://github.com/haseebarshad17/quran-hadith-json](https://github.com/haseebarshad17/quran-hadith-json)
* مصادر الترجمات الرسمية:
  * **مشروع تنزيل (Tanzil Project)**: [http://tanzil.net](http://tanzil.net)
  * **مركز رواد الترجمة وقرآن إنسك (QuranEnc)**: [https://quranenc.com](https://quranenc.com)
  * **مجمع الملك فهد لطباعة المصحف الشريف**: [https://qurancomplex.gov.sa/](https://qurancomplex.gov.sa/)
* للمزيد من التفاصيل والبيانات الكاملة راجع: [`docs/SOURCES_AND_ATTRIBUTIONS.md`](../../../docs/SOURCES_AND_ATTRIBUTIONS.md).

---

**تم التحديث بتاريخ 15/10/2026**
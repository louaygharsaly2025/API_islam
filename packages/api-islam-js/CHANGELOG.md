# Changelog

## 1.2.1

- Updated README and documentation with complete Tafsir and Reciters examples.
- Synced distribution artifacts.

## 1.2.0

- Added `TafsirService` (`api.tafsir`):
  - Full Quran Tafsir & Exegesis support with methods: `getBooks()`, `getSurahTafsir(tafsirId, surahNumber)`, `getAyahTafsir(tafsirId, surahNumber, ayahNumber)`.
- Added `getReciters()` and `getJuz()` to `QuranService` (`api.quran`):
  - Top Quran reciters streaming links (Al-Afasy, Al-Husary, Abdul Basit, Minshawi, Hudhaify, Yassin Al-Jazairi).
  - Direct 30 Juz retrieval.
- Normalized Ayah and Surah field mapping to seamlessly support KFGQPC standardized keys (`aya_text`, `aya_no`, `sora`, `jozz`, `name_ar`, `start_page`, `end_page`).
- Supported both `/api/v1/quran/editions` and `/api/v1/quran/qiraat` endpoints.

## 1.1.1

- Added detailed README.md usage examples for Kutub as-Sittah Hadith and 97 Quran Translations.
- TypeScript declaration file improvements.

## 1.1.0


- Added `HadithService` (`api.hadith`):
  - Full support for Kutub as-Sittah (Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami` at-Tirmidhi, Sunan an-Nasa'i, Sunan Ibn Majah) and 40 Hadith Nawawi (34,100+ Hadiths in Arabic and English).
  - Methods: `getBooks()`, `getBook(id)`, `getChapters(bookId)`, `getChapter(bookId, no)`, `getHadith(bookId, no)` ($O(1)$ fast lookup), `getRandomHadith()`, `search()`.
- Added Multilingual Quran Translations to `QuranService` (`api.quran`):
  - 97 language editions with full Surah and Ayah translations.
  - Structural metadata via `getMetadata()` (Surahs, 30 Juzs, 14 Sajdah verses).
  - Methods: `getMetadata()`, `getTranslationLanguages()`, `getTranslationSurah(lang, id)`, `getTranslationAyah(lang, surahId, ayahId)`.

## 1.0.1

- Updated official GitHub repository URLs to `louaygharsaly2025/API_islam`.

## 1.0.0


- Initial release of `api-islam-client` for TypeScript & Node.js/Browser.
- Dual ESM and CommonJS bundle support with auto-generated TypeScript declarations (`.d.ts`).
- Full API coverage:
  - Quran with 114 Surahs and 9 authentic Qira'at.
  - Tajweed colored segments and rule breakdown.
  - Accurate Prayer Times, Qibla compass bearing, and Hijri Calendar.
  - Fortress of the Muslim (Hisn al-Muslim) daily Azkar.
  - 40 Rabbana Duas from the Holy Quran.
  - 99 Names of Allah (Asma' Allah Al-Husna).
  - Comprehensive Ruqyah Shariah.
  - Zakat Calculator.
  - Islamic Live Radios streaming and Mushaf Page image URLs.

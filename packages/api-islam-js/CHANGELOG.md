# Changelog

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

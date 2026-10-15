# Changelog

All notable changes to this project will be documented in this file.

## 1.1.1

- Enhanced API documentation comments across all public models and client methods for 100% pub.dev score.
- Fixed dangling library doc comments.
- Updated README.md installation instructions and added detailed code examples for Kutub as-Sittah Hadith and 97 Quran Translations.

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

- Initial release of `api_islam` SDK for Dart and Flutter.
- Quran Service:
  - 114 Surahs metadata and verses.
  - 9 authentic Qira'at (Hafs, Warsh, Qaloon, Doori, Soosi, Shouba, Bazzi, Qumbul, Hafs Smart).
  - Ayah search across all Qira'at.
  - Page-by-page rendering support with Mushaf page images and King Fahd Complex fonts.
- Tajweed Rules Service:
  - Colored Tajweed rules categorization (Ghunnah, Ikhfa, Idgham, Qalqalah, Madd, Iqlab, etc.).
  - Surah and Ayah level Tajweed breakdown.
- Prayers & Hijri Service:
  - Accurate prayer times calculation (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha, Imsak, Midnight).
  - Supports 12+ international calculation methods (MWL, ISNA, Egypt, Makkah, Karachi, Tehran, etc.).
  - Automatic Qibla direction calculation (bearing, compass direction, distance to Kaaba in km).
  - Hijri calendar conversion and monthly prayer schedules.
- Azkar & Duas:
  - Morning, Evening, Sleep, Post-prayer, and daily fortress of the Muslim supplications.
  - 40 Rabbana Duas from the Holy Quran with translations.
  - Comprehensive Ruqyah Shariah verses and supplications.
- 99 Names of Allah (Asma' Allah Al-Husna) with Arabic text, transliteration, and English meanings.
- Islamic Tools:
  - Zakat Calculator (Cash, Gold, Silver, Trade goods).
  - Live Islamic Radios streaming from around the world.

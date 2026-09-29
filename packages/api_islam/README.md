# api_islam

[![pub package](https://img.shields.io/pub/v/api_islam.svg)](https://pub.dev/packages/api_islam)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A modern, fast, and feature-rich **Dart & Flutter SDK** for **API_ISLAM** — The Ultimate Open-Source Islamic Platform API.

---

## 🌟 Features

- 📖 **Holy Quran with 9 Qira'at**: Hafs, Warsh, Qaloon, Doori, Soosi, Shouba, Bazzi, Qumbul, and Hafs Smart with King Fahd Complex official fonts.
- 🎨 **Tajweed Rules**: Colored Tajweed text segment breakdown by rules (Ghunnah, Ikhfa, Idgham, Qalqalah, etc.).
- 🕌 **Prayer Times & Qibla**: Highly accurate prayer timings calculation (12+ global calculation methods) + exact Kaaba compass direction & distance.
- 📅 **Hijri Calendar**: Accurate Gregorian to Islamic Hijri date converter with Islamic holidays.
- 📿 **Azkar & Duas**: Fortress of the Muslim (Hisn al-Muslim) daily morning/evening supplications.
- 🤲 **40 Rabbana Duas**: Quranic supplications with Arabic text, references, and English translations.
- ✨ **99 Names of Allah**: Asma' Allah Al-Husna with transliterations and meanings.
- 🛡️ **Ruqyah Shariah**: Comprehensive Islamic healing verses and authentic supplications.
- 💰 **Zakat Calculator**: Instant Nisab and Zakat calculation on Cash, Gold, Silver, and Trade goods.
- 📻 **Live Islamic Radios**: High-quality global Quran and Islamic radio streams.
- 🖼️ **Mushaf Page Images**: High-resolution Mushaf page images (1–604) with CDN fallback.

---

## 📦 Installation

Add `api_islam` to your `pubspec.yaml`:

```yaml
dependencies:
  api_islam: ^1.0.0
```

Then run:

```bash
flutter pub get
# or for Dart projects:
dart pub get
```

---

## 🚀 Quick Start

```dart
import 'package:api_islam/api_islam.dart';

void main() async {
  // Initialize SDK
  final api = ApiIslam(baseUrl: 'https://your-api-islam-instance.com');

  // 1. Get Surah Al-Fatihah in Warsh recitation
  final surah = await api.quran.getSurah(1, qiraah: 'warsh');
  print('Surah: ${surah.info.name}');
  for (final ayah in surah.verses) {
    print('${ayah.verseNumber}: ${ayah.text}');
  }

  // 2. Get Prayer Times by Coordinates (e.g. Tunis / Cairo / Dubai)
  final prayerTimes = await api.prayers.getPrayerTimes(
    latitude: 36.8065,
    longitude: 10.1815,
  );
  print('Fajr: ${prayerTimes.fajr}, Maghrib: ${prayerTimes.maghrib}');
  print('Hijri Date: ${prayerTimes.hijri}');

  // 3. Get Qibla Direction
  final qibla = await api.prayers.getQibla(latitude: 36.8065, longitude: 10.1815);
  print('Qibla: ${qibla.directionDegrees}° (${qibla.compassDirection})');

  // 4. Close client when done
  api.close();
}
```

---

## 💡 Code Examples

### 📖 Quran & Recitations (9 Qira'at)
```dart
// List all 9 available Qira'at
final qiraatList = await api.quran.getQiraat();

// Fetch page 1 in Qaloon
final pageVerses = await api.quran.getPage(1, qiraah: 'qaloon');

// Search Quran verses
final results = await api.quran.search('الرحمن', qiraah: 'hafs');
```

### 🎨 Tajweed Breakdown
```dart
final tajweedRules = await api.tajweed.getRules();
final surahTajweed = await api.tajweed.getSurahTajweed(1);

for (final ayah in surahTajweed) {
  for (final segment in ayah.segments) {
    print('${segment.text} -> Color: ${segment.colorHex} (${segment.ruleId})');
  }
}
```

### 📿 Azkar & 99 Names of Allah
```dart
// Morning Azkar
final morningAzkar = await api.azkar.getByCategory('morning');

// 99 Names of Allah
final names = await api.azkar.getNamesOfAllah();

// 40 Rabbana Duas
final rabbana = await api.azkar.getRabbanaDuas();
```

### 💰 Zakat Calculator
```dart
final zakat = await api.tools.calculateZakat(
  cash: 12000.0,
  goldGrams: 50.0,
  silverGrams: 100.0,
  currency: 'USD',
);

print('Is Eligible: ${zakat.isEligible}');
print('Zakat Due: ${zakat.zakatDue} ${zakat.currency}');
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

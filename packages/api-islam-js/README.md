# api-islam

[![npm version](https://img.shields.io/npm/v/api-islam.svg)](https://www.npmjs.com/package/api-islam)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Official, fully-typed **TypeScript & JavaScript SDK** for **API_ISLAM** — The Ultimate Open-Source Islamic Platform API.

Works seamlessly in **Node.js, Browser, Next.js, React, Vue, Svelte, Angular, React Native, and Electron**.

---

## 🌟 Features

- 📖 **Holy Quran with 9 Qira'at**: Hafs, Warsh, Qaloon, Doori, Soosi, Shouba, Bazzi, Qumbul, Hafs Smart.
- 🎨 **Tajweed Colored Rules**: Rules categorization and segment breakdown for recitation.
- 🕌 **Prayer Times & Qibla**: Highly accurate timings calculation and Kaaba compass bearing & distance.
- 📅 **Hijri Calendar**: Accurate Gregorian to Islamic Hijri conversion.
- 📿 **Azkar & Duas**: Daily fortress of the Muslim (Hisn al-Muslim) supplications.
- 🤲 **40 Rabbana Duas**: Quranic supplications with English meanings and references.
- ✨ **99 Names of Allah**: Asma' Allah Al-Husna with transliterations and meanings.
- 🛡️ **Ruqyah Shariah**: Comprehensive Islamic healing verses and supplications.
- 💰 **Zakat Calculator**: Instant Nisab and Zakat calculation on Cash, Gold, Silver, and Trade goods.
- 📻 **Live Islamic Radios**: Global Quran and Islamic radio streams.
- 🖼️ **Mushaf Page Images**: High-resolution Mushaf page images (1–604) with CDN fallback.

---

## 📦 Installation

```bash
npm install api-islam
# or
yarn add api-islam
# or
pnpm add api-islam
# or
bun add api-islam
```

---

## 🚀 Quick Start

```typescript
import { ApiIslam } from 'api-islam';

const api = new ApiIslam({
  baseUrl: 'https://your-api-islam-instance.com', // or 'http://localhost:8000'
});

async function run() {
  // 1. Get Surah Al-Fatihah with Warsh recitation
  const surah = await api.quran.getSurah(1, 'warsh');
  console.log(`Surah: ${surah.info.name} (${surah.qiraah})`);
  surah.verses.forEach(v => console.log(`[${v.verse_number}] ${v.text}`));

  // 2. Get Prayer Times for Tunis (36.8065, 10.1815)
  const times = await api.prayers.getPrayerTimes({
    latitude: 36.8065,
    longitude: 10.1815,
  });
  console.log(`Fajr: ${times.timings.Fajr}, Maghrib: ${times.timings.Maghrib}`);

  // 3. Get Qibla Direction
  const qibla = await api.prayers.getQibla(36.8065, 10.1815);
  console.log(`Qibla: ${qibla.direction}° (${qibla.compass_direction})`);

  // 4. Calculate Zakat for $10,000 Cash
  const zakat = await api.tools.calculateZakat({ cash: 10000 });
  console.log(`Zakat Due: ${zakat.zakat_due} ${zakat.currency}`);
}

run();
```

---

## 💡 Code Examples

### 🎨 Tajweed Colored Breakdown
```typescript
const rules = await api.tajweed.getRules();
const surahTajweed = await api.tajweed.getSurahTajweed(1);

surahTajweed.forEach(ayah => {
  ayah.segments.forEach(seg => {
    console.log(`${seg.text} -> Color: ${seg.color} (${seg.rule})`);
  });
});
```

### 📿 Morning & Evening Azkar
```typescript
const morningAzkar = await api.azkar.getByCategory('morning');
const namesOfAllah = await api.azkar.getNamesOfAllah();
const rabbanaDuas = await api.azkar.getRabbanaDuas();
```

### 📻 Islamic Radios & Mushaf Pages
```typescript
// Live Radios
const radios = await api.media.getRadios();

// Mushaf Page Direct Image URL
const imageUrl = api.media.getMushafPageImageUrl(1);
```

---

## 📄 License

MIT License © 2026 Louay Gharsalli

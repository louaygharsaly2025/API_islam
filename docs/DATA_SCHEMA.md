# Data Repository Specifications

This document outlines the organization and schema references for all JSON datasets stored in `data/`.

## Directory Overview

```text
data/
├── quran/
│   ├── surahs_info.json          # Complete index of all 114 Surahs
│   ├── surahs/                   # Individual full Surahs with verses ({id}.json)
│   ├── translations/             # English/French/Other Quran translations
│   └── audio/                    # Reciters and audio streams
├── adhkar/
│   ├── categories.json           # Categories index
│   ├── morning.json              # Morning adhkar
│   ├── evening.json              # Evening adhkar
│   ├── sleep.json                # Sleep adhkar
│   └── after_prayer.json         # Post-prayer adhkar
├── hadith/
│   └── nawawi40.json             # 40 Nawawi Hadiths
└── prayer_times/
    └── methods.json              # Standard calculation conventions
```

## JSON Schemas

Formal schemas are located in `schemas/`:
* `surah.schema.json` -> Schema for `data/quran/surahs/*.json`
* `adhkar.schema.json` -> Schema for `data/adhkar/*.json`
* `hadith.schema.json` -> Schema for `data/hadith/*.json`
* `prayer_times.schema.json` -> Schema for prayer calculation models

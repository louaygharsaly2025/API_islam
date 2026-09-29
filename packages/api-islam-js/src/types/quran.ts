export interface SurahInfo {
  id: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  total_verses: number;
  revelation_type: string;
  page_start: number;
  page_end: number;
}

export interface Ayah {
  id: number;
  surah_id: number;
  verse_number: number;
  text: string;
  page: number;
  juz: number;
  hizbQuarter: number;
  audio_url?: string;
  translation?: string;
}

export interface SurahDetail {
  info: SurahInfo;
  verses: Ayah[];
  qiraah: string;
}

export interface QiraahInfo {
  id: string;
  name_ar: string;
  name_en: string;
  font_name: string;
  woff2_url: string;
  ttf_url: string;
}

export interface QuranSearchResult {
  count: number;
  query: string;
  qiraah: string;
  results: Ayah[];
}

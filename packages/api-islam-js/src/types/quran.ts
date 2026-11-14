export interface SurahInfo {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  englishName: string;
  englishNameTranslation: string;
  total_verses: number;
  revelation_type: string;
  page_start: number;
  page_end: number;
  start_page?: number;
  end_page?: number;
}

export interface Ayah {
  id: number;
  surah_id: number;
  verse_number: number;
  text: string;
  // KFGQPC standardized keys
  sora?: number;
  sura_no?: number;
  aya_no?: number;
  aya_text?: string;
  aya_text_emlaey?: string;
  page: number;
  juz: number;
  jozz?: number;
  hizbQuarter: number;
  audio_url?: string;
  translation?: string;
}

export interface ReciterInfo {
  id: string;
  name_ar: string;
  name_en: string;
  riwayah: string;
  server: string;
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

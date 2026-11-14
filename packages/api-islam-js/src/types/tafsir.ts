export interface TafsirBook {
  id: string;
  name_ar: string;
  name_en: string;
  language: string;
  author: string;
}

export interface AyahTafsir {
  tafsir_id: string;
  surah_number: number;
  ayah_number: number;
  tafsir_text: string;
}

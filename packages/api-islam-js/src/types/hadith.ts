export interface HadithBook {
  id: string;
  name_ar: string;
  name_en: string;
  hadiths_count: number;
  chapters_count: number;
}

export interface HadithChapter {
  chapter_number: number;
  title_ar: string;
  title_en: string;
  hadiths_count: number;
}

export interface HadithItem {
  hadith_number: number;
  arabic: string;
  english: string;
  book_id?: string;
  chapter_number?: number;
}

export interface HadithSearchResult {
  count: number;
  query: string;
  book?: string;
  results: HadithItem[];
}

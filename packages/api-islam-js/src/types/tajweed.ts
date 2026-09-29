export interface TajweedRule {
  id: string;
  name_ar: string;
  name_en: string;
  color_hex: string;
  description: string;
}

export interface TajweedSegment {
  text: string;
  rule?: string;
  color?: string;
}

export interface TajweedAyah {
  surah_id: number;
  ayah_number: number;
  text: string;
  segments: TajweedSegment[];
}

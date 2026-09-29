export interface ZekrItem {
  id: number;
  category: string;
  zekr: string;
  description?: string;
  count: number;
  reference?: string;
  audio?: string;
}

export interface RabbanaDua {
  number: number;
  arabic: string;
  translation: string;
  reference_surah: string;
  reference_ayah: string;
}

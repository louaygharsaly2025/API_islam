export interface HijriMonth {
  number: number;
  ar: string;
  en: string;
}

export interface HijriDate {
  day: number;
  month: HijriMonth | number;
  year: number;
  month_ar?: string;
  month_en?: string;
  holidays?: string[];
}

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak?: string;
  Midnight?: string;
}

export interface PrayerTimesData {
  timings: PrayerTimings;
  readable_date: string;
  hijri?: HijriDate;
}

export interface QiblaData {
  latitude: number;
  longitude: number;
  direction: number;
  compass_direction: string;
  distance_to_kaaba_km: number;
}

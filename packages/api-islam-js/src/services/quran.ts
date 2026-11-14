import { ApiIslamConfig, ApiException } from '../config';
import { SurahInfo, SurahDetail, Ayah, QiraahInfo, QuranSearchResult, ReciterInfo } from '../types/quran';

function normalizeAyah(a: any): Ayah {
  return {
    id: a.id ?? a.number ?? 0,
    surah_id: a.surah_id ?? a.surahNumber ?? a.sora ?? a.sura_no ?? 0,
    verse_number: a.verse_number ?? a.numberInSurah ?? a.aya_no ?? 0,
    text: a.text ?? a.aya_text ?? '',
    page: a.page ?? 0,
    juz: a.juz ?? a.jozz ?? 0,
    hizbQuarter: a.hizbQuarter ?? 0,
    audio_url: a.audio_url ?? a.audio,
    translation: a.translation,
    sora: a.sora,
    sura_no: a.sura_no,
    aya_no: a.aya_no,
    aya_text: a.aya_text,
    aya_text_emlaey: a.aya_text_emlaey,
    jozz: a.jozz,
  };
}

export class QuranService {
  private baseUrl: string;
  private timeoutMs: number;
  private headers: Record<string, string>;

  constructor(config: ApiIslamConfig = {}) {
    this.baseUrl = (config.baseUrl || 'http://localhost:8000').replace(/\/+$/, '');
    this.timeoutMs = config.timeoutMs || 15000;
    this.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  private async request<T>(path: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          url.searchParams.append(k, String(v));
        }
      });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(url.toString(), {
        headers: this.headers,
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        throw new ApiException(`API Request failed with status ${res.status}: ${errorText}`, res.status, errorText);
      }

      return (await res.json()) as T;
    } catch (e: any) {
      if (e instanceof ApiException) throw e;
      throw new ApiException(e?.message || 'Network error occurred', undefined, e);
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Get list of all 114 Surahs.
   */
  async getSurahs(): Promise<SurahInfo[]> {
    const data = await this.request<any>('/api/v1/quran/surahs');
    return Array.isArray(data) ? data : (data.surahs || []);
  }

  /**
   * Get list of supported 9 authentic Qira'at and fonts.
   */
  async getQiraat(): Promise<QiraahInfo[]> {
    try {
      const data = await this.request<any>('/api/v1/quran/editions');
      return Array.isArray(data)
        ? data
        : (data.data || data.qiraat || data.editions || []);
    } catch {
      const data = await this.request<any>('/api/v1/quran/qiraat');
      return Array.isArray(data)
        ? data
        : (data.data || data.qiraat || data.editions || []);
    }
  }

  /**
   * Get list of top Quran Reciters and audio streaming servers.
   */
  async getReciters(): Promise<ReciterInfo[]> {
    const data = await this.request<any>('/api/v1/quran/reciters');
    return Array.isArray(data) ? data : (data.data || data.reciters || []);
  }

  /**
   * Get all verses in a specific Juz (1 to 30) with optional Qira'ah.
   */
  async getJuz(juzNumber: number, qiraah: string = 'hafs'): Promise<Ayah[]> {
    const data = await this.request<any>(`/api/v1/quran/juz/${juzNumber}`, { qiraah });
    const raw: any[] = Array.isArray(data) ? data : (data.data || data.verses || data.ayahs || []);
    return raw.map(normalizeAyah);
  }

  /**
   * Get full Surah and verses with an optional specific Qira'ah.
   */
  async getSurah(surahId: number, qiraah: string = 'hafs'): Promise<SurahDetail> {
    const data = await this.request<any>(`/api/v1/quran/surah/${surahId}`, { qiraah });
    const rawInfo = data.info || data.surah || data;
    const info: SurahInfo = {
      id: rawInfo.id || rawInfo.number || surahId,
      name: rawInfo.name || rawInfo.name_ar || rawInfo.name_arabic || rawInfo.name_arabic_uthmani || '',
      englishName: rawInfo.englishName || rawInfo.name_en || rawInfo.name_english || '',
      englishNameTranslation: rawInfo.englishNameTranslation || '',
      total_verses: rawInfo.total_verses || rawInfo.numberOfAyahs || 0,
      revelation_type: rawInfo.revelation_type || rawInfo.revelationType || '',
      page_start: rawInfo.page_start || rawInfo.start_page || 1,
      page_end: rawInfo.page_end || rawInfo.end_page || 1,
    };
    const rawVerses: any[] = data.verses || data.ayahs || [];
    const verses: Ayah[] = rawVerses.map(normalizeAyah);
    return {
      info,
      verses,
      qiraah: data.qiraah || qiraah,
    };
  }

  /**
   * Get specific Ayah with optional Qira'ah.
   */
  async getAyah(surahId: number, ayahNumber: number, qiraah: string = 'hafs'): Promise<Ayah> {
    const raw = await this.request<any>(`/api/v1/quran/ayah/${surahId}/${ayahNumber}`, { qiraah });
    return normalizeAyah(raw.data || raw);
  }

  /**
   * Get specific Mushaf Page (1 to 604) with optional Qira'ah.
   */
  async getPage(pageNumber: number, qiraah: string = 'hafs'): Promise<Ayah[]> {
    const data = await this.request<any>(`/api/v1/quran/page/${pageNumber}`, { qiraah });
    const raw: any[] = Array.isArray(data) ? data : (data.data || data.ayahs || data.verses || []);
    return raw.map(normalizeAyah);
  }

  /**
   * Search across Quran verses with optional Qira'ah filter.
   */
  async search(query: string, qiraah: string = 'hafs'): Promise<QuranSearchResult> {
    const data = await this.request<any>('/api/v1/quran/search', { q: query, qiraah });
    return {
      count: data.count ?? data.results?.length ?? 0,
      query: data.query || query,
      qiraah: data.qiraah || qiraah,
      results: data.results || [],
    };
  }

  /**
   * Get Quran structural metadata (Surahs, 30 Juzs, 14 Sajdahs, translation sources).
   */
  async getMetadata(): Promise<any> {
    return this.request<any>('/api/v1/quran/metadata');
  }

  /**
   * Get list of all 97 supported translation languages and editions.
   */
  async getTranslationLanguages(): Promise<string[]> {
    const data = await this.request<any>('/api/v1/quran/translations/languages');
    return Array.isArray(data) ? data : (data.languages || []);
  }

  /**
   * Get a full Surah translation in any of the 97 languages.
   */
  async getTranslationSurah(lang: string, surahId: number): Promise<any> {
    return this.request<any>(`/api/v1/quran/translations/${lang}/surah/${surahId}`);
  }

  /**
   * Get a specific Ayah translation in any of the 97 languages.
   */
  async getTranslationAyah(lang: string, surahId: number, ayahId: number): Promise<any> {
    return this.request<any>(`/api/v1/quran/translations/${lang}/ayah/${surahId}/${ayahId}`);
  }
}


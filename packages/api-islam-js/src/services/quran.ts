import { ApiIslamConfig, ApiException } from '../config';
import { SurahInfo, SurahDetail, Ayah, QiraahInfo, QuranSearchResult } from '../types/quran';

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
    const data = await this.request<any>('/api/v1/quran/qiraat');
    return Array.isArray(data) ? data : (data.qiraat || []);
  }

  /**
   * Get full Surah and verses with an optional specific Qira'ah.
   */
  async getSurah(surahId: number, qiraah: string = 'hafs'): Promise<SurahDetail> {
    const data = await this.request<any>(`/api/v1/quran/surah/${surahId}`, { qiraah });
    const info: SurahInfo = data.info || data;
    const verses: Ayah[] = data.verses || data.ayahs || [];
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
    return this.request<Ayah>(`/api/v1/quran/ayah/${surahId}/${ayahNumber}`, { qiraah });
  }

  /**
   * Get specific Mushaf Page (1 to 604) with optional Qira'ah.
   */
  async getPage(pageNumber: number, qiraah: string = 'hafs'): Promise<Ayah[]> {
    const data = await this.request<any>(`/api/v1/quran/page/${pageNumber}`, { qiraah });
    return Array.isArray(data) ? data : (data.ayahs || data.verses || []);
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
}

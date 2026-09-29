import { ApiIslamConfig, ApiException } from '../config';
import { TajweedRule, TajweedAyah } from '../types/tajweed';

export class TajweedService {
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

  private async request<T>(path: string): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(url.toString(), {
        headers: this.headers,
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        throw new ApiException(`Tajweed API failed [${res.status}]: ${errorText}`, res.status, errorText);
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
   * Get all Tajweed rules and color classifications.
   */
  async getRules(): Promise<TajweedRule[]> {
    const data = await this.request<any>('/api/v1/tajweed/rules');
    return Array.isArray(data) ? data : (data.rules || []);
  }

  /**
   * Get full Surah with color-coded Tajweed segments.
   */
  async getSurahTajweed(surahId: number): Promise<TajweedAyah[]> {
    const data = await this.request<any>(`/api/v1/tajweed/surah/${surahId}`);
    return Array.isArray(data) ? data : (data.verses || data.ayahs || []);
  }

  /**
   * Get specific Ayah with color-coded Tajweed segments.
   */
  async getAyahTajweed(surahId: number, ayahNumber: number): Promise<TajweedAyah> {
    return this.request<TajweedAyah>(`/api/v1/tajweed/ayah/${surahId}/${ayahNumber}`);
  }
}

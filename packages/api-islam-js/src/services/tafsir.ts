import { ApiIslamConfig, ApiException } from '../config';
import { TafsirBook, AyahTafsir } from '../types/tafsir';

export class TafsirService {
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
        throw new ApiException(`Tafsir API Request failed with status ${res.status}: ${errorText}`, res.status, errorText);
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
   * Get list of all available Tafsir books.
   */
  async getBooks(): Promise<TafsirBook[]> {
    const data = await this.request<any>('/api/v1/tafsir/books');
    return Array.isArray(data) ? data : (data.data || data.books || []);
  }

  /**
   * Get Tafsir for an entire Surah.
   */
  async getSurahTafsir(tafsirId: string, surahNumber: number): Promise<any> {
    const data = await this.request<any>(`/api/v1/tafsir/${tafsirId.toLowerCase()}/surah/${surahNumber}`);
    return data.data || data;
  }

  /**
   * Get Tafsir for a specific Ayah.
   */
  async getAyahTafsir(tafsirId: string, surahNumber: number, ayahNumber: number): Promise<AyahTafsir> {
    const data = await this.request<any>(`/api/v1/tafsir/${tafsirId.toLowerCase()}/ayah/${surahNumber}/${ayahNumber}`);
    return {
      tafsir_id: data.tafsir_id || tafsirId,
      surah_number: data.surah_number || surahNumber,
      ayah_number: data.ayah_number || ayahNumber,
      tafsir_text: data.tafsir_text || data.text || '',
    };
  }
}

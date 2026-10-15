import { ApiIslamConfig, ApiException } from '../config';
import { HadithBook, HadithChapter, HadithItem, HadithSearchResult } from '../types/hadith';

export class HadithService {
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
   * Get list of all available Hadith books (Kutub as-Sittah + Nawawi 40).
   */
  async getBooks(): Promise<HadithBook[]> {
    const data = await this.request<any>('/api/v1/hadith/books');
    return Array.isArray(data) ? data : (data.books || []);
  }

  /**
   * Get metadata and chapter info for a specific Hadith book.
   */
  async getBook(bookId: string): Promise<HadithBook> {
    return this.request<HadithBook>(`/api/v1/hadith/book/${bookId}`);
  }

  /**
   * Get list of all chapters for a given Hadith book.
   */
  async getChapters(bookId: string): Promise<HadithChapter[]> {
    const data = await this.request<any>(`/api/v1/hadith/book/${bookId}/chapters`);
    return Array.isArray(data) ? data : (data.chapters || []);
  }

  /**
   * Get a specific chapter by number with Hadiths in Arabic, English, or both.
   */
  async getChapter(bookId: string, chapterNo: number, options: { lang?: 'ar' | 'en' | 'both' } = {}): Promise<any> {
    return this.request<any>(`/api/v1/hadith/book/${bookId}/chapter/${chapterNo}`, {
      lang: options.lang || 'both',
    });
  }

  /**
   * Fast O(1) single Hadith lookup by book and Hadith number.
   */
  async getHadith(bookId: string, hadithNo: number): Promise<HadithItem> {
    return this.request<HadithItem>(`/api/v1/hadith/book/${bookId}/hadith/${hadithNo}`);
  }

  /**
   * Get a random Hadith, optionally filtered by book.
   */
  async getRandomHadith(options: { book?: string } = {}): Promise<HadithItem> {
    const params: Record<string, any> = {};
    if (options.book) params.book = options.book;
    return this.request<HadithItem>('/api/v1/hadith/random', params);
  }

  /**
   * Search across Hadith collections by query.
   */
  async search(
    query: string,
    options: { book?: string; lang?: 'ar' | 'en'; limit?: number } = {}
  ): Promise<HadithSearchResult> {
    const params: Record<string, any> = {
      query,
      lang: options.lang || 'ar',
      limit: options.limit ?? 20,
    };
    if (options.book) params.book = options.book;
    return this.request<HadithSearchResult>('/api/v1/hadith/search', params);
  }
}

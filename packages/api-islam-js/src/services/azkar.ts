import { ApiIslamConfig, ApiException } from '../config';
import { ZekrItem, RabbanaDua } from '../types/azkar';
import { NameOfAllah } from '../types/asma_allah';
import { RuqyahItem } from '../types/ruqyah';

export class AzkarService {
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
        throw new ApiException(`Azkar API failed [${res.status}]: ${errorText}`, res.status, errorText);
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
   * Get all Azkar categories.
   */
  async getCategories(): Promise<string[]> {
    const data = await this.request<any>('/api/v1/azkar/categories');
    return Array.isArray(data) ? data : (data.categories || []);
  }

  /**
   * Get Azkar items by category (e.g. 'morning', 'evening', 'sleep').
   */
  async getByCategory(category: string): Promise<ZekrItem[]> {
    const data = await this.request<any>(`/api/v1/azkar/by-category/${category}`);
    return Array.isArray(data) ? data : (data.azkar || data.items || []);
  }

  /**
   * Get 40 Rabbana Duas from the Holy Quran.
   */
  async getRabbanaDuas(): Promise<RabbanaDua[]> {
    const data = await this.request<any>('/api/v1/azkar/rabbana');
    return Array.isArray(data) ? data : (data.duas || []);
  }

  /**
   * Get 99 Names of Allah (Asma' Allah Al-Husna).
   */
  async getNamesOfAllah(): Promise<NameOfAllah[]> {
    const data = await this.request<any>('/api/v1/azkar/asma-allah');
    return Array.isArray(data) ? data : (data.names || []);
  }

  /**
   * Get Comprehensive Ruqyah Shariah verses and supplications.
   */
  async getRuqyah(): Promise<RuqyahItem[]> {
    const data = await this.request<any>('/api/v1/azkar/ruqyah');
    return Array.isArray(data) ? data : (data.ruqyah || data.items || []);
  }
}

import { ApiIslamConfig, ApiException } from '../config';
import { IslamicRadio } from '../types/radio';
import { MushafPage } from '../types/mushaf';

export class MediaService {
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
        throw new ApiException(`Media API failed [${res.status}]: ${errorText}`, res.status, errorText);
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
   * Get all available live Islamic radio streams.
   */
  async getRadios(): Promise<IslamicRadio[]> {
    const data = await this.request<any>('/api/v1/radios/all');
    return Array.isArray(data) ? data : (data.radios || []);
  }

  /**
   * Get Mushaf page image metadata and direct CDN link.
   */
  async getMushafPage(pageNumber: number): Promise<MushafPage> {
    return this.request<MushafPage>(`/api/v1/mushaf/page/${pageNumber}`);
  }

  /**
   * Get direct URL to the high-resolution page image.
   */
  getMushafPageImageUrl(pageNumber: number): string {
    return `${this.baseUrl}/api/v1/mushaf/page/${pageNumber}/image`;
  }
}

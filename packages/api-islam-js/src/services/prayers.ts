import { ApiIslamConfig, ApiException } from '../config';
import { PrayerTimesData, QiblaData, HijriDate } from '../types/prayers';

export class PrayersService {
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
        throw new ApiException(`Prayers API failed [${res.status}]: ${errorText}`, res.status, errorText);
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
   * Get today's prayer times for given GPS coordinates.
   */
  async getPrayerTimes(options: {
    latitude: number;
    longitude: number;
    method?: number;
    date?: string;
  }): Promise<PrayerTimesData> {
    return this.request<PrayerTimesData>('/api/v1/prayers/times', {
      latitude: options.latitude,
      longitude: options.longitude,
      method: options.method,
      date: options.date,
    });
  }

  /**
   * Get today's prayer times by city and country name.
   */
  async getPrayerTimesByCity(options: {
    city: string;
    country: string;
    method?: number;
    date?: string;
  }): Promise<PrayerTimesData> {
    return this.request<PrayerTimesData>('/api/v1/prayers/by-city', {
      city: options.city,
      country: options.country,
      method: options.method,
      date: options.date,
    });
  }

  /**
   * Get Qibla compass bearing and distance to Kaaba.
   */
  async getQibla(latitude: number, longitude: number): Promise<QiblaData> {
    return this.request<QiblaData>('/api/v1/prayers/qibla', { latitude, longitude });
  }

  /**
   * Get Hijri date from Gregorian date (or today).
   */
  async getHijriDate(date?: string): Promise<HijriDate> {
    const data = await this.request<any>('/api/v1/prayers/hijri', date ? { date } : undefined);
    return data.hijri || data;
  }
}

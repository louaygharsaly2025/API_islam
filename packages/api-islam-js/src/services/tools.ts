import { ApiIslamConfig, ApiException } from '../config';
import { ZakatInput, ZakatCalculationResult } from '../types/zakat';

export class ToolsService {
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

  /**
   * Calculate Zakat given wealth details.
   */
  async calculateZakat(input: ZakatInput): Promise<ZakatCalculationResult> {
    const url = new URL(`${this.baseUrl}/api/v1/tools/zakat/calculate`);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          cash: input.cash ?? 0,
          gold_grams: input.gold_grams ?? 0,
          silver_grams: input.silver_grams ?? 0,
          trade_goods: input.trade_goods ?? 0,
          liabilities: input.liabilities ?? 0,
          gold_price_per_gram: input.gold_price_per_gram ?? 65.0,
          silver_price_per_gram: input.silver_price_per_gram ?? 0.85,
          currency: input.currency || 'USD',
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        throw new ApiException(`Zakat API failed [${res.status}]: ${errorText}`, res.status, errorText);
      }

      return (await res.json()) as ZakatCalculationResult;
    } catch (e: any) {
      if (e instanceof ApiException) throw e;
      throw new ApiException(e?.message || 'Network error occurred', undefined, e);
    } finally {
      clearTimeout(timer);
    }
  }
}

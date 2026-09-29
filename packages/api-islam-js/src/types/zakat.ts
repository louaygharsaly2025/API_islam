export interface ZakatInput {
  cash?: number;
  gold_grams?: number;
  silver_grams?: number;
  trade_goods?: number;
  liabilities?: number;
  gold_price_per_gram?: number;
  silver_price_per_gram?: number;
  currency?: string;
}

export interface ZakatCalculationResult {
  total_wealth: number;
  nisab_threshold: number;
  is_eligible: boolean;
  zakat_due: number;
  currency: string;
  breakdown: Record<string, any>;
}

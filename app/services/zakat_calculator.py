"""
Islamic Zakat Calculation Engine.
Calculates Nisab threshold and Zakat amount on Cash, Gold, Silver, Trade Merchandise, and Investments.
"""

class ZakatCalculator:
    # Standard Shariah Nisab weights in grams
    NISAB_GOLD_GRAMS = 85.0    # 85 grams of 24k Gold
    NISAB_SILVER_GRAMS = 595.0  # 595 grams of pure Silver
    ZAKAT_RATE = 0.025         # 2.5% (1/40th)

    @classmethod
    def get_nisab_info(cls, gold_price_per_gram: float = 75.0, silver_price_per_gram: float = 0.9):
        """
        Calculates current monetary Nisab based on market prices per gram.
        """
        gold_nisab_value = cls.NISAB_GOLD_GRAMS * gold_price_per_gram
        silver_nisab_value = cls.NISAB_SILVER_GRAMS * silver_price_per_gram

        return {
            "gold_nisab": {
                "weight_grams": cls.NISAB_GOLD_GRAMS,
                "price_per_gram": gold_price_per_gram,
                "monetary_value": round(gold_nisab_value, 2)
            },
            "silver_nisab": {
                "weight_grams": cls.NISAB_SILVER_GRAMS,
                "price_per_gram": silver_price_per_gram,
                "monetary_value": round(silver_nisab_value, 2)
            },
            "recommended_nisab_standard": "Gold Nisab is recommended for cash and investments in modern times",
            "zakat_rate_percentage": 2.5
        }

    @classmethod
    def calculate(
        cls,
        cash_in_hand: float = 0.0,
        bank_savings: float = 0.0,
        gold_grams: float = 0.0,
        gold_price_per_gram: float = 75.0,
        silver_grams: float = 0.0,
        silver_price_per_gram: float = 0.9,
        trade_merchandise_value: float = 0.0,
        shares_and_investments: float = 0.0,
        money_owed_to_you: float = 0.0,
        immediate_debts_due: float = 0.0,
        nisab_standard: str = "gold"
    ):
        """
        Calculate total wealth, check against Nisab, and compute payable Zakat.
        """
        # Calculate asset values
        gold_value = gold_grams * gold_price_per_gram
        silver_value = silver_grams * silver_price_per_gram

        total_assets = (
            cash_in_hand +
            bank_savings +
            gold_value +
            silver_value +
            trade_merchandise_value +
            shares_and_investments +
            money_owed_to_you
        )

        net_zakatable_wealth = max(0.0, total_assets - immediate_debts_due)

        # Determine threshold
        gold_nisab = cls.NISAB_GOLD_GRAMS * gold_price_per_gram
        silver_nisab = cls.NISAB_SILVER_GRAMS * silver_price_per_gram
        threshold = silver_nisab if nisab_standard.lower() == "silver" else gold_nisab

        is_zakat_due = net_zakatable_wealth >= threshold
        zakat_amount = round(net_zakatable_wealth * cls.ZAKAT_RATE, 2) if is_zakat_due else 0.0

        return {
            "assets_breakdown": {
                "cash_and_bank": round(cash_in_hand + bank_savings, 2),
                "gold_value": round(gold_value, 2),
                "silver_value": round(silver_value, 2),
                "merchandise_and_stocks": round(trade_merchandise_value + shares_and_investments, 2),
                "receivables": round(money_owed_to_you, 2),
                "total_gross_assets": round(total_assets, 2),
                "deductible_debts": round(immediate_debts_due, 2),
                "net_zakatable_wealth": round(net_zakatable_wealth, 2)
            },
            "nisab": {
                "standard_used": nisab_standard.capitalize(),
                "threshold_value": round(threshold, 2),
                "gold_nisab_value": round(gold_nisab, 2),
                "silver_nisab_value": round(silver_nisab, 2)
            },
            "result": {
                "is_zakat_eligible": is_zakat_due,
                "zakat_rate": "2.5%",
                "zakat_amount_due": zakat_amount
            }
        }

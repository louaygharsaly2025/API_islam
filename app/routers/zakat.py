"""
Zakat Router for API_ISLAM.
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from app.services.zakat_calculator import ZakatCalculator

router = APIRouter(prefix="/api/v1/zakat", tags=["Zakat Calculator"])

@router.get("/nisab", summary="Get current Nisab thresholds and standards")
def get_nisab_info(
    gold_price: Optional[float] = Query(75.0, description="Current market price per gram of 24k Gold in local currency"),
    silver_price: Optional[float] = Query(0.9, description="Current market price per gram of pure Silver in local currency")
):
    try:
        data = ZakatCalculator.get_nisab_info(gold_price_per_gram=gold_price, silver_price_per_gram=silver_price)
        return {
            "status": "success",
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/calculate", summary="Calculate payable Zakat on wealth and assets")
def calculate_zakat(
    cash_in_hand: Optional[float] = Query(0.0, description="Cash in hand and wallet"),
    bank_savings: Optional[float] = Query(0.0, description="Money in bank accounts and deposits"),
    gold_grams: Optional[float] = Query(0.0, description="Total grams of owned Gold"),
    gold_price_per_gram: Optional[float] = Query(75.0, description="Gold price per gram"),
    silver_grams: Optional[float] = Query(0.0, description="Total grams of owned Silver"),
    silver_price_per_gram: Optional[float] = Query(0.9, description="Silver price per gram"),
    trade_merchandise: Optional[float] = Query(0.0, description="Value of commercial trade merchandise"),
    stocks_and_shares: Optional[float] = Query(0.0, description="Value of investment shares / stocks"),
    money_owed_to_you: Optional[float] = Query(0.0, description="Debts expected to be repaid to you"),
    debts_due: Optional[float] = Query(0.0, description="Short-term debts and liabilities you owe"),
    nisab_standard: Optional[str] = Query("gold", description="Nisab standard to use: 'gold' or 'silver'")
):
    try:
        data = ZakatCalculator.calculate(
            cash_in_hand=cash_in_hand,
            bank_savings=bank_savings,
            gold_grams=gold_grams,
            gold_price_per_gram=gold_price_per_gram,
            silver_grams=silver_grams,
            silver_price_per_gram=silver_price_per_gram,
            trade_merchandise_value=trade_merchandise,
            shares_and_investments=stocks_and_shares,
            money_owed_to_you=money_owed_to_you,
            immediate_debts_due=debts_due,
            nisab_standard=nisab_standard
        )
        return {
            "status": "success",
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Zakat calculation failed: {str(e)}")

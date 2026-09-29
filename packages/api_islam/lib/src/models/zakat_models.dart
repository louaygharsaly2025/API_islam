/// Zakat Calculator Models.

class ZakatCalculationResult {
  final double totalWealth;
  final double nisabThreshold;
  final bool isEligible;
  final double zakatDue;
  final String currency;
  final Map<String, dynamic> breakdown;

  const ZakatCalculationResult({
    required this.totalWealth,
    required this.nisabThreshold,
    required this.isEligible,
    required this.zakatDue,
    required this.currency,
    required this.breakdown,
  });

  factory ZakatCalculationResult.fromJson(Map<String, dynamic> json) {
    return ZakatCalculationResult(
      totalWealth: (json['total_wealth'] as num? ?? 0).toDouble(),
      nisabThreshold: (json['nisab_threshold'] as num? ?? 0).toDouble(),
      isEligible: json['is_eligible'] as bool? ?? false,
      zakatDue: (json['zakat_due'] as num? ?? 0).toDouble(),
      currency: json['currency'] as String? ?? 'USD',
      breakdown: json['breakdown'] as Map<String, dynamic>? ?? {},
    );
  }
}

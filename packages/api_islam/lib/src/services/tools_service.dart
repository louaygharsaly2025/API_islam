import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config.dart';
import '../exceptions.dart';
import '../models/zakat_models.dart';

class ToolsService {
  final ApiIslamConfig config;
  final http.Client client;

  ToolsService({required this.config, required this.client});

  Uri _buildUri(String path, [Map<String, dynamic>? queryParams]) {
    final cleanBase = config.baseUrl.endsWith('/') ? config.baseUrl.substring(0, config.baseUrl.length - 1) : config.baseUrl;
    final url = '$cleanBase$path';
    final filteredParams = queryParams?.map((k, v) => MapEntry(k, v.toString()));
    return Uri.parse(url).replace(queryParameters: filteredParams);
  }

  /// Calculate Zakat for given assets.
  Future<ZakatCalculationResult> calculateZakat({
    double cash = 0.0,
    double goldGrams = 0.0,
    double silverGrams = 0.0,
    double tradeGoods = 0.0,
    double liabilities = 0.0,
    double goldPricePerGram = 65.0,
    double silverPricePerGram = 0.85,
    String currency = 'USD',
  }) async {
    try {
      final uri = _buildUri('/api/v1/tools/zakat/calculate');
      final body = jsonEncode({
        'cash': cash,
        'gold_grams': goldGrams,
        'silver_grams': silverGrams,
        'trade_goods': tradeGoods,
        'liabilities': liabilities,
        'gold_price_per_gram': goldPricePerGram,
        'silver_price_per_gram': silverPricePerGram,
        'currency': currency,
      });

      final res = await client.post(
        uri,
        headers: config.headers,
        body: body,
      ).timeout(config.timeout);

      if (res.statusCode >= 200 && res.statusCode < 300) {
        return ZakatCalculationResult.fromJson(jsonDecode(utf8.decode(res.bodyBytes)));
      } else {
        throw ApiException('Zakat calculation failed [${res.statusCode}]: ${res.body}', statusCode: res.statusCode);
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw NetworkException('Network error during Zakat calculation: $e');
    }
  }
}

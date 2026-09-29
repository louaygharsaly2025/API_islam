import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config.dart';
import '../exceptions.dart';
import '../models/azkar_models.dart';
import '../models/asma_allah_models.dart';
import '../models/ruqyah_models.dart';

class AzkarService {
  final ApiIslamConfig config;
  final http.Client client;

  AzkarService({required this.config, required this.client});

  Uri _buildUri(String path, [Map<String, dynamic>? queryParams]) {
    final cleanBase = config.baseUrl.endsWith('/') ? config.baseUrl.substring(0, config.baseUrl.length - 1) : config.baseUrl;
    final url = '$cleanBase$path';
    final filteredParams = queryParams?.map((k, v) => MapEntry(k, v.toString()));
    return Uri.parse(url).replace(queryParameters: filteredParams);
  }

  Future<dynamic> _get(String path, [Map<String, dynamic>? params]) async {
    try {
      final uri = _buildUri(path, params);
      final res = await client.get(uri, headers: config.headers).timeout(config.timeout);
      if (res.statusCode >= 200 && res.statusCode < 300) {
        return jsonDecode(utf8.decode(res.bodyBytes));
      } else if (res.statusCode == 404) {
        throw NotFoundException('Azkar resource not found at $path');
      } else {
        throw ApiException('Azkar request failed [${res.statusCode}]: ${res.body}', statusCode: res.statusCode);
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw NetworkException('Network error during Azkar request: $e');
    }
  }

  /// Get list of Azkar categories.
  Future<List<String>> getCategories() async {
    final data = await _get('/api/v1/azkar/categories');
    final list = data is List ? data : (data['categories'] as List? ?? []);
    return list.map((e) => e.toString()).toList();
  }

  /// Get Azkar by category (e.g. morning, evening, sleep).
  Future<List<ZekrItem>> getByCategory(String category) async {
    final data = await _get('/api/v1/azkar/by-category/$category');
    final list = data is List ? data : (data['azkar'] as List? ?? data['items'] as List? ?? []);
    return list.map((e) => ZekrItem.fromJson(e as Map<String, dynamic>)).toList();
  }

  /// Get 40 Rabbana Duas from the Holy Quran.
  Future<List<RabbanaDua>> getRabbanaDuas() async {
    final data = await _get('/api/v1/azkar/rabbana');
    final list = data is List ? data : (data['duas'] as List? ?? []);
    return list.map((e) => RabbanaDua.fromJson(e as Map<String, dynamic>)).toList();
  }

  /// Get 99 Names of Allah (Asma' Allah Al-Husna).
  Future<List<NameOfAllah>> getNamesOfAllah() async {
    final data = await _get('/api/v1/azkar/asma-allah');
    final list = data is List ? data : (data['names'] as List? ?? []);
    return list.map((e) => NameOfAllah.fromJson(e as Map<String, dynamic>)).toList();
  }

  /// Get Comprehensive Ruqyah Shariah verses & supplications.
  Future<List<RuqyahItem>> getRuqyah() async {
    final data = await _get('/api/v1/azkar/ruqyah');
    final list = data is List ? data : (data['ruqyah'] as List? ?? data['items'] as List? ?? []);
    return list.map((e) => RuqyahItem.fromJson(e as Map<String, dynamic>)).toList();
  }
}

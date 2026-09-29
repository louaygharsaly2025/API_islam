import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config.dart';
import '../exceptions.dart';
import '../models/tajweed_models.dart';

class TajweedService {
  final ApiIslamConfig config;
  final http.Client client;

  TajweedService({required this.config, required this.client});

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
        throw NotFoundException('Tajweed resource not found at $path');
      } else {
        throw ApiException('Tajweed request failed [${res.statusCode}]: ${res.body}', statusCode: res.statusCode);
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw NetworkException('Network error during Tajweed request: $e');
    }
  }

  /// Get Tajweed rules and color schemes.
  Future<List<TajweedRule>> getRules() async {
    final data = await _get('/api/v1/tajweed/rules');
    final list = data is List ? data : (data['rules'] as List? ?? []);
    return list.map((e) => TajweedRule.fromJson(e as Map<String, dynamic>)).toList();
  }

  /// Get full Surah with color-coded Tajweed segments.
  Future<List<TajweedAyah>> getSurahTajweed(int surahId) async {
    final data = await _get('/api/v1/tajweed/surah/$surahId');
    final list = data is List ? data : (data['verses'] as List? ?? data['ayahs'] as List? ?? []);
    return list.map((e) => TajweedAyah.fromJson(e as Map<String, dynamic>)).toList();
  }

  /// Get a specific Ayah with Tajweed color breakdown.
  Future<TajweedAyah> getAyahTajweed(int surahId, int ayahNumber) async {
    final data = await _get('/api/v1/tajweed/ayah/$surahId/$ayahNumber');
    return TajweedAyah.fromJson(data as Map<String, dynamic>);
  }
}

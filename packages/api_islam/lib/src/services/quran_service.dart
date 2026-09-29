import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config.dart';
import '../exceptions.dart';
import '../models/quran_models.dart';

class QuranService {
  final ApiIslamConfig config;
  final http.Client client;

  QuranService({required this.config, required this.client});

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
        throw NotFoundException('Resource not found at $path');
      } else {
        throw ApiException('Request failed with status ${res.statusCode}: ${res.body}', statusCode: res.statusCode);
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw NetworkException('Network error during request: $e');
    }
  }

  /// Get list of all 114 Surahs.
  Future<List<SurahInfo>> getSurahs() async {
    final data = await _get('/api/v1/quran/surahs');
    final list = data is List ? data : (data['surahs'] as List? ?? []);
    return list.map((e) => SurahInfo.fromJson(e as Map<String, dynamic>)).toList();
  }

  /// Get list of supported 9 Qira'at and their font information.
  Future<List<QiraahInfo>> getQiraat() async {
    final data = await _get('/api/v1/quran/qiraat');
    final list = data is List ? data : (data['qiraat'] as List? ?? []);
    return list.map((e) => QiraahInfo.fromJson(e as Map<String, dynamic>)).toList();
  }

  /// Get full Surah details and verses with an optional specific Qira'ah.
  Future<SurahDetail> getSurah(int surahId, {String qiraah = 'hafs'}) async {
    final data = await _get('/api/v1/quran/surah/$surahId', {'qiraah': qiraah});
    return SurahDetail.fromJson(data as Map<String, dynamic>);
  }

  /// Get specific Ayah with an optional specific Qira'ah.
  Future<Ayah> getAyah(int surahId, int ayahNumber, {String qiraah = 'hafs'}) async {
    final data = await _get('/api/v1/quran/ayah/$surahId/$ayahNumber', {'qiraah': qiraah});
    return Ayah.fromJson(data as Map<String, dynamic>);
  }

  /// Get a specific Mushaf Page (1 to 604) with an optional specific Qira'ah.
  Future<List<Ayah>> getPage(int pageNumber, {String qiraah = 'hafs'}) async {
    final data = await _get('/api/v1/quran/page/$pageNumber', {'qiraah': qiraah});
    final list = data is List ? data : (data['ayahs'] as List? ?? data['verses'] as List? ?? []);
    return list.map((e) => Ayah.fromJson(e as Map<String, dynamic>)).toList();
  }

  /// Search across Quran verses with optional Qira'ah filter.
  Future<QuranSearchResult> search(String query, {String qiraah = 'hafs'}) async {
    final data = await _get('/api/v1/quran/search', {'q': query, 'qiraah': qiraah});
    return QuranSearchResult.fromJson(data as Map<String, dynamic>);
  }
}

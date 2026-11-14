import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config.dart';
import '../exceptions.dart';
import '../models/tafsir_models.dart';

/// Service for accessing Quran Tafsir & Exegesis books.
class TafsirService {
  final ApiIslamConfig config;
  final http.Client client;

  TafsirService({required this.config, required this.client});

  Uri _buildUri(String path, [Map<String, dynamic>? queryParams]) {
    final cleanBase = config.baseUrl.endsWith('/')
        ? config.baseUrl.substring(0, config.baseUrl.length - 1)
        : config.baseUrl;
    final url = '$cleanBase$path';
    final filteredParams =
        queryParams?.map((k, v) => MapEntry(k, v.toString()));
    return Uri.parse(url).replace(queryParameters: filteredParams);
  }

  Future<dynamic> _get(String path, [Map<String, dynamic>? params]) async {
    try {
      final uri = _buildUri(path, params);
      final res = await client
          .get(uri, headers: config.headers)
          .timeout(config.timeout);
      if (res.statusCode >= 200 && res.statusCode < 300) {
        return jsonDecode(utf8.decode(res.bodyBytes));
      } else if (res.statusCode == 404) {
        throw NotFoundException('Tafsir resource not found at $path');
      } else {
        throw ApiException(
          'Tafsir request failed [${res.statusCode}]: ${res.body}',
          statusCode: res.statusCode,
        );
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw NetworkException('Network error during Tafsir request: $e');
    }
  }

  /// Get list of all available Tafsir books.
  Future<List<TafsirBook>> getBooks() async {
    final data = await _get('/api/v1/tafsir/books');
    final list = data is List
        ? data
        : (data['data'] as List? ?? data['books'] as List? ?? []);
    return list
        .map((e) => TafsirBook.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// Get Tafsir for an entire Surah.
  Future<Map<String, dynamic>> getSurahTafsir(
    String tafsirId,
    int surahNumber,
  ) async {
    final data =
        await _get('/api/v1/tafsir/${tafsirId.toLowerCase()}/surah/$surahNumber');
    return data is Map<String, dynamic> ? data : {'data': data};
  }

  /// Get Tafsir for a specific Ayah.
  Future<AyahTafsir> getAyahTafsir(
    String tafsirId,
    int surahNumber,
    int ayahNumber,
  ) async {
    final data = await _get(
        '/api/v1/tafsir/${tafsirId.toLowerCase()}/ayah/$surahNumber/$ayahNumber');
    return AyahTafsir.fromJson(data as Map<String, dynamic>);
  }
}

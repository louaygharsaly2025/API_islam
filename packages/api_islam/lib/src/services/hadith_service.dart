import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config.dart';
import '../exceptions.dart';
import '../models/hadith_models.dart';

/// Service for accessing Kutub as-Sittah Hadith Encyclopedia.
class HadithService {
  final ApiIslamConfig config;
  final http.Client client;

  HadithService({required this.config, required this.client});

  Uri _buildUri(String path, [Map<String, dynamic>? queryParams]) {
    final cleanBase = config.baseUrl.endsWith('/')
        ? config.baseUrl.substring(0, config.baseUrl.length - 1)
        : config.baseUrl;
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
        throw ApiException(
          'Request failed with status ${res.statusCode}: ${res.body}',
          statusCode: res.statusCode,
        );
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw NetworkException('Network error during request: $e');
    }
  }

  /// Get list of all available Hadith books (Kutub as-Sittah + Nawawi 40).
  Future<List<HadithBook>> getBooks() async {
    final data = await _get('/api/v1/hadith/books');
    final list = data is List ? data : (data['books'] as List? ?? []);
    return list.map((e) => HadithBook.fromJson(e as Map<String, dynamic>)).toList();
  }

  /// Get details for a specific Hadith book.
  Future<HadithBook> getBook(String bookId) async {
    final data = await _get('/api/v1/hadith/book/$bookId');
    return HadithBook.fromJson(data as Map<String, dynamic>);
  }

  /// Get all chapters for a given Hadith book.
  Future<List<HadithChapter>> getChapters(String bookId) async {
    final data = await _get('/api/v1/hadith/book/$bookId/chapters');
    final list = data is List ? data : (data['chapters'] as List? ?? []);
    return list.map((e) => HadithChapter.fromJson(e as Map<String, dynamic>)).toList();
  }

  /// Get a specific chapter by number with Hadiths in Arabic, English, or both.
  Future<Map<String, dynamic>> getChapter(
    String bookId,
    int chapterNo, {
    String lang = 'both',
  }) async {
    final data = await _get('/api/v1/hadith/book/$bookId/chapter/$chapterNo', {'lang': lang});
    return data as Map<String, dynamic>;
  }

  /// Get a single Hadith by its number ($O(1)$ fast lookup).
  Future<HadithItem> getHadith(String bookId, int hadithNo) async {
    final data = await _get('/api/v1/hadith/book/$bookId/hadith/$hadithNo');
    return HadithItem.fromJson(data as Map<String, dynamic>);
  }

  /// Get a random Hadith, optionally filtered by book.
  Future<HadithItem> getRandomHadith({String? book}) async {
    final params = <String, dynamic>{};
    if (book != null && book.isNotEmpty) params['book'] = book;
    final data = await _get('/api/v1/hadith/random', params);
    return HadithItem.fromJson(data as Map<String, dynamic>);
  }

  /// Search across Hadiths with optional book, language, and limit filters.
  Future<HadithSearchResult> search(
    String query, {
    String? book,
    String lang = 'ar',
    int limit = 20,
  }) async {
    final params = <String, dynamic>{
      'query': query,
      'lang': lang,
      'limit': limit,
    };
    if (book != null && book.isNotEmpty) params['book'] = book;
    final data = await _get('/api/v1/hadith/search', params);
    return HadithSearchResult.fromJson(data as Map<String, dynamic>);
  }
}

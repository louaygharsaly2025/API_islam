// ============================================================================
// API_ISLAM Flutter / Dart Helper Client
// Copy this file directly into your Flutter project (e.g. lib/services/islamic_api.dart)
// ============================================================================

import 'dart:convert';
import 'package:http/http.dart' as http;

class IslamicApiClient {
  final String baseUrl;

  IslamicApiClient({this.baseUrl = "http://localhost:8000/api/v1"});

  // Helper method for GET requests with UTF-8 decoding
  Future<dynamic> _get(String path, [Map<String, String>? queryParams]) async {
    final uri = Uri.parse('$baseUrl$path').replace(queryParameters: queryParams);
    final response = await http.get(uri);
    if (response.statusCode == 200) {
      return jsonDecode(utf8.decode(response.bodyBytes))['data'];
    } else {
      throw Exception('API Error [${response.statusCode}]: ${response.body}');
    }
  }

  // --- Quran Methods ---
  
  /// Get list of all 114 Surahs
  Future<List<dynamic>> getSurahs({String? type}) async {
    final params = type != null ? {'revelation_type': type} : null;
    return await _get('/quran/surahs', params);
  }

  /// Get complete Surah by number (1 - 114)
  Future<Map<String, dynamic>> getSurah(int surahNumber) async {
    return await _get('/quran/surah/$surahNumber');
  }

  /// Search Quran verses by keyword
  Future<dynamic> searchQuran(String query) async {
    final uri = Uri.parse('$baseUrl/quran/search').replace(queryParameters: {'q': query});
    final res = await http.get(uri);
    return jsonDecode(utf8.decode(res.bodyBytes))['results'];
  }

  /// Get audio reciters list
  Future<List<dynamic>> getReciters() async {
    return await _get('/quran/reciters');
  }

  // --- Adhkar Methods ---

  /// Get all categories
  Future<List<dynamic>> getAdhkarCategories() async {
    return await _get('/adhkar/categories');
  }

  /// Get Adhkar by category ('morning', 'evening', 'sleep', 'after_prayer')
  Future<Map<String, dynamic>> getAdhkar(String category) async {
    return await _get('/adhkar/category/$category');
  }

  /// Get daily random dhikr
  Future<Map<String, dynamic>> getRandomDhikr() async {
    return await _get('/adhkar/random');
  }

  // --- Hadith Methods ---

  /// Get Hadiths by collection ('nawawi40')
  Future<Map<String, dynamic>> getHadithCollection(String collectionId) async {
    return await _get('/hadith/collection/$collectionId');
  }

  /// Get random Hadith
  Future<Map<String, dynamic>> getRandomHadith() async {
    return await _get('/hadith/random');
  }

  // --- Prayer Times Methods ---

  /// Calculate prayer times for GPS coordinates
  Future<Map<String, dynamic>> getPrayerTimes({
    required double latitude,
    required double longitude,
    String? date, // YYYY-MM-DD
    double timezone = 1.0,
    String method = "EGYPT",
  }) async {
    final params = {
      'latitude': latitude.toString(),
      'longitude': longitude.toString(),
      'timezone': timezone.toString(),
      'method': method,
      if (date != null) 'date': date,
    };
    return await _get('/prayer-times/calculate', params);
  }
}

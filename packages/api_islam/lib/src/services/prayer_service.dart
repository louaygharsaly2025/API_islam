import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config.dart';
import '../exceptions.dart';
import '../models/prayer_models.dart';

class PrayerService {
  final ApiIslamConfig config;
  final http.Client client;

  PrayerService({required this.config, required this.client});

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
        throw NotFoundException('Prayer resource not found at $path');
      } else {
        throw ApiException('Prayer request failed [${res.statusCode}]: ${res.body}', statusCode: res.statusCode);
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw NetworkException('Network error during Prayer request: $e');
    }
  }

  /// Get today's prayer times by coordinates (latitude and longitude).
  Future<PrayerTimesData> getPrayerTimes({
    required double latitude,
    required double longitude,
    int? method,
    String? date,
  }) async {
    final params = <String, dynamic>{
      'latitude': latitude,
      'longitude': longitude,
    };
    if (method != null) params['method'] = method;
    if (date != null) params['date'] = date;

    final data = await _get('/api/v1/prayers/times', params);
    return PrayerTimesData.fromJson(data as Map<String, dynamic>);
  }

  /// Get prayer times by city and country name.
  Future<PrayerTimesData> getPrayerTimesByCity({
    required String city,
    required String country,
    int? method,
    String? date,
  }) async {
    final params = <String, dynamic>{
      'city': city,
      'country': country,
    };
    if (method != null) params['method'] = method;
    if (date != null) params['date'] = date;

    final data = await _get('/api/v1/prayers/by-city', params);
    return PrayerTimesData.fromJson(data as Map<String, dynamic>);
  }

  /// Get Qibla direction and distance from coordinates.
  Future<QiblaData> getQibla({required double latitude, required double longitude}) async {
    final data = await _get('/api/v1/prayers/qibla', {
      'latitude': latitude,
      'longitude': longitude,
    });
    return QiblaData.fromJson(data as Map<String, dynamic>);
  }

  /// Get Hijri date from Gregorian date (or today).
  Future<HijriDate> getHijriDate({String? date}) async {
    final params = date != null ? {'date': date} : null;
    final data = await _get('/api/v1/prayers/hijri', params);
    final h = data['hijri'] as Map<String, dynamic>? ?? data as Map<String, dynamic>;
    return HijriDate.fromJson(h);
  }
}

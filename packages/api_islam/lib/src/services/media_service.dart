import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config.dart';
import '../exceptions.dart';
import '../models/radio_models.dart';
import '../models/mushaf_models.dart';

class MediaService {
  final ApiIslamConfig config;
  final http.Client client;

  MediaService({required this.config, required this.client});

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
        throw NotFoundException('Media resource not found at $path');
      } else {
        throw ApiException('Media request failed [${res.statusCode}]: ${res.body}', statusCode: res.statusCode);
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw NetworkException('Network error during Media request: $e');
    }
  }

  /// Get list of live Islamic radio stations.
  Future<List<IslamicRadio>> getRadios() async {
    final data = await _get('/api/v1/radios/all');
    final list = data is List ? data : (data['radios'] as List? ?? []);
    return list.map((e) => IslamicRadio.fromJson(e as Map<String, dynamic>)).toList();
  }

  /// Get Mushaf Page image metadata and URL.
  Future<MushafPage> getMushafPage(int pageNumber) async {
    final data = await _get('/api/v1/mushaf/page/$pageNumber');
    return MushafPage.fromJson(data as Map<String, dynamic>);
  }

  /// Get direct URL for a Mushaf page image.
  String getMushafPageImageUrl(int pageNumber) {
    final cleanBase = config.baseUrl.endsWith('/') ? config.baseUrl.substring(0, config.baseUrl.length - 1) : config.baseUrl;
    return '$cleanBase/api/v1/mushaf/page/$pageNumber/image';
  }
}

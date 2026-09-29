import 'package:http/http.dart' as http;
import 'config.dart';
import 'services/quran_service.dart';
import 'services/tajweed_service.dart';
import 'services/prayer_service.dart';
import 'services/azkar_service.dart';
import 'services/media_service.dart';
import 'services/tools_service.dart';

/// The central API_ISLAM Client.
class ApiIslam {
  final ApiIslamConfig config;
  final http.Client _client;

  late final QuranService quran;
  late final TajweedService tajweed;
  late final PrayerService prayers;
  late final AzkarService azkar;
  late final MediaService media;
  late final ToolsService tools;

  ApiIslam({
    String baseUrl = 'http://localhost:8000',
    Duration timeout = const Duration(seconds: 15),
    Map<String, String>? headers,
    http.Client? httpClient,
  })  : config = ApiIslamConfig(
          baseUrl: baseUrl,
          timeout: timeout,
          headers: headers ??
              const {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
        ),
        _client = httpClient ?? http.Client() {
    _initServices();
  }

  ApiIslam.withConfig(this.config, {http.Client? httpClient})
      : _client = httpClient ?? http.Client() {
    _initServices();
  }

  void _initServices() {
    quran = QuranService(config: config, client: _client);
    tajweed = TajweedService(config: config, client: _client);
    prayers = PrayerService(config: config, client: _client);
    azkar = AzkarService(config: config, client: _client);
    media = MediaService(config: config, client: _client);
    tools = ToolsService(config: config, client: _client);
  }

  /// Closes the underlying HTTP client.
  void close() {
    _client.close();
  }
}

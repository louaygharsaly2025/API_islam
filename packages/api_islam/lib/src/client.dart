import 'package:http/http.dart' as http;
import 'config.dart';
import 'services/quran_service.dart';
import 'services/hadith_service.dart';
import 'services/tajweed_service.dart';
import 'services/prayer_service.dart';
import 'services/azkar_service.dart';
import 'services/media_service.dart';
import 'services/tools_service.dart';

/// The central API_ISLAM Client for Flutter and Dart.
class ApiIslam {
  /// The client configuration.
  final ApiIslamConfig config;
  final http.Client _client;

  /// Quran service with 9 authentic Qira'at and 97 translations.
  late final QuranService quran;

  /// Kutub as-Sittah Hadith Encyclopedia service (34,100+ Hadiths).
  late final HadithService hadith;

  /// Colored Tajweed rules categorization service.
  late final TajweedService tajweed;

  /// Accurate prayer timings, Qibla direction, and Hijri calendar.
  late final PrayerService prayers;

  /// Hisn al-Muslim Azkar, 40 Rabbana Duas, and 99 Names of Allah.
  late final AzkarService azkar;

  /// Live Islamic Radios and Mushaf Page image streams.
  late final MediaService media;

  /// Zakat Calculator and Islamic calculation tools.
  late final ToolsService tools;

  /// Creates an [ApiIslam] instance with optional [baseUrl], [timeout], and [headers].
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

  /// Creates an [ApiIslam] client using a preconfigured [ApiIslamConfig].
  ApiIslam.withConfig(this.config, {http.Client? httpClient})
      : _client = httpClient ?? http.Client() {
    _initServices();
  }


  void _initServices() {
    quran = QuranService(config: config, client: _client);
    hadith = HadithService(config: config, client: _client);
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

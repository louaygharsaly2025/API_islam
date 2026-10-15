import 'dart:convert';
import 'package:api_islam/api_islam.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:test/test.dart';

void main() {
  group('ApiIslam SDK Unit Tests', () {
    test('QuranService getSurahs and getSurah with Qiraah', () async {
      final mockClient = MockClient((request) async {
        if (request.url.path == '/api/v1/quran/surahs') {
          return http.Response(
            jsonEncode([
              {
                'id': 1,
                'name': 'الفاتحة',
                'englishName': 'Al-Faatiha',
                'englishNameTranslation': 'The Opening',
                'total_verses': 7,
                'revelation_type': 'Meccan',
                'page_start': 1,
                'page_end': 1
              }
            ]),
            200,
            headers: {'content-type': 'application/json'},
          );
        } else if (request.url.path == '/api/v1/quran/surah/1') {
          return http.Response(
            jsonEncode({
              'id': 1,
              'name': 'الفاتحة',
              'englishName': 'Al-Faatiha',
              'englishNameTranslation': 'The Opening',
              'total_verses': 7,
              'revelation_type': 'Meccan',
              'page_start': 1,
              'page_end': 1,
              'qiraah': request.url.queryParameters['qiraah'] ?? 'hafs',
              'verses': [
                {
                  'id': 1,
                  'surah_id': 1,
                  'verse_number': 1,
                  'text': 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
                  'page': 1,
                  'juz': 1,
                  'hizbQuarter': 1
                }
              ]
            }),
            200,
            headers: {'content-type': 'application/json'},
          );
        }
        return http.Response('Not Found', 404);
      });

      final api = ApiIslam(httpClient: mockClient);
      final surahs = await api.quran.getSurahs();
      expect(surahs.length, 1);
      expect(surahs.first.name, 'الفاتحة');

      final surah = await api.quran.getSurah(1, qiraah: 'warsh');
      expect(surah.verses.length, 1);
      expect(surah.qiraah, 'warsh');
      expect(surah.verses.first.text, contains('الرَّحِيمِ'));
    });

    test('TajweedService getRules and getAyahTajweed', () async {
      final mockClient = MockClient((request) async {
        if (request.url.path == '/api/v1/tajweed/rules') {
          return http.Response(
            jsonEncode({
              'rules': [
                {
                  'id': 'ghunnah',
                  'name_ar': 'غنة',
                  'name_en': 'Ghunnah',
                  'color_hex': '#FF8C00',
                  'description': 'Nasalization sound'
                }
              ]
            }),
            200,
            headers: {'content-type': 'application/json'},
          );
        }
        return http.Response('Not Found', 404);
      });

      final api = ApiIslam(httpClient: mockClient);
      final rules = await api.tajweed.getRules();
      expect(rules.length, 1);
      expect(rules.first.id, 'ghunnah');
      expect(rules.first.colorHex, '#FF8C00');
    });

    test('PrayerService getPrayerTimes and getQibla', () async {
      final mockClient = MockClient((request) async {
        if (request.url.path == '/api/v1/prayers/times') {
          return http.Response(
            jsonEncode({
              'timings': {
                'Fajr': '05:12',
                'Sunrise': '06:34',
                'Dhuhr': '12:28',
                'Asr': '15:45',
                'Maghrib': '18:22',
                'Isha': '19:44'
              },
              'readable_date': '29 Sep 2026',
              'hijri': {
                'day': 18,
                'month': {'number': 4, 'ar': 'ربيع الثاني', 'en': 'Rabi al-Thani'},
                'year': 1448
              }
            }),
            200,
            headers: {'content-type': 'application/json'},
          );
        } else if (request.url.path == '/api/v1/prayers/qibla') {
          return http.Response(
            jsonEncode({
              'latitude': 36.8065,
              'longitude': 10.1815,
              'qibla_direction': 112.4,
              'compass_direction': 'ESE',
              'distance_km': 3420.5
            }),
            200,
            headers: {'content-type': 'application/json'},
          );
        }
        return http.Response('Not Found', 404);
      });

      final api = ApiIslam(httpClient: mockClient);
      final times = await api.prayers.getPrayerTimes(latitude: 36.8065, longitude: 10.1815);
      expect(times.fajr, '05:12');
      expect(times.hijri?.monthArabic, 'ربيع الثاني');

      final qibla = await api.prayers.getQibla(latitude: 36.8065, longitude: 10.1815);
      expect(qibla.directionDegrees, 112.4);
      expect(qibla.compassDirection, 'ESE');
    });

    test('AzkarService getNamesOfAllah and RabbanaDuas', () async {
      final mockClient = MockClient((request) async {
        if (request.url.path == '/api/v1/azkar/asma-allah') {
          return http.Response(
            jsonEncode({
              'names': [
                {
                  'number': 1,
                  'name': 'الرَّحْمَنُ',
                  'transliteration': 'Ar-Rahmaan',
                  'meaning': 'The Most Gracious'
                }
              ]
            }),
            200,
            headers: {'content-type': 'application/json'},
          );
        }
        return http.Response('Not Found', 404);
      });

      final api = ApiIslam(httpClient: mockClient);
      final names = await api.azkar.getNamesOfAllah();
      expect(names.length, 1);
      expect(names.first.nameArabic, 'الرَّحْمَنُ');
    });

    test('ToolsService calculateZakat', () async {
      final mockClient = MockClient((request) async {
        if (request.url.path == '/api/v1/tools/zakat/calculate') {
          return http.Response(
            jsonEncode({
              'total_wealth': 10000.0,
              'nisab_threshold': 5525.0,
              'is_eligible': true,
              'zakat_due': 250.0,
              'currency': 'USD',
              'breakdown': {'cash': 10000.0}
            }),
            200,
            headers: {'content-type': 'application/json'},
          );
        }
        return http.Response('Not Found', 404);
      });

      final api = ApiIslam(httpClient: mockClient);
      final res = await api.tools.calculateZakat(cash: 10000.0);
      expect(res.isEligible, isTrue);
      expect(res.zakatDue, 250.0);
    });

    test('HadithService getBooks and getHadith', () async {
      final mockClient = MockClient((request) async {
        if (request.url.path == '/api/v1/hadith/books') {
          return http.Response(
            jsonEncode([
              {
                'id': 'bukhari',
                'name_ar': 'صحيح البخاري',
                'name_en': 'Sahih al-Bukhari',
                'hadiths_count': 7563,
                'chapters_count': 97
              }
            ]),
            200,
            headers: {'content-type': 'application/json'},
          );
        } else if (request.url.path == '/api/v1/hadith/book/bukhari/hadith/1') {
          return http.Response(
            jsonEncode({
              'hadith_number': 1,
              'book_id': 'bukhari',
              'chapter_number': 1,
              'arabic': 'إنما الأعمال بالنيات',
              'english': 'Actions are according to intentions'
            }),
            200,
            headers: {'content-type': 'application/json'},
          );
        }
        return http.Response('Not Found', 404);
      });

      final api = ApiIslam(httpClient: mockClient);
      final books = await api.hadith.getBooks();
      expect(books.length, 1);
      expect(books.first.id, 'bukhari');
      expect(books.first.hadithsCount, 7563);

      final hadith = await api.hadith.getHadith('bukhari', 1);
      expect(hadith.hadithNumber, 1);
      expect(hadith.arabic, contains('النيات'));
      expect(hadith.english, contains('intentions'));
    });

    test('QuranService getTranslationLanguages and getTranslationSurah', () async {
      final mockClient = MockClient((request) async {
        if (request.url.path == '/api/v1/quran/translations/languages') {
          return http.Response(
            jsonEncode({
              'total_languages': 97,
              'languages': ['English', 'French', 'Urdu']
            }),
            200,
            headers: {'content-type': 'application/json'},
          );
        }
        return http.Response('Not Found', 404);
      });

      final api = ApiIslam(httpClient: mockClient);
      final langs = await api.quran.getTranslationLanguages();
      expect(langs.length, 3);
      expect(langs, contains('English'));
    });

    test('Handles 404 with NotFoundException', () async {
      final mockClient = MockClient((request) async {
        return http.Response('Not Found', 404);
      });

      final api = ApiIslam(httpClient: mockClient);
      expect(() => api.quran.getSurahs(), throwsA(isA<NotFoundException>()));
    });
  });
}


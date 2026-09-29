import 'package:api_islam/api_islam.dart';

void main() async {
  // Initialize the API client (pointing to your server instance)
  final api = ApiIslam(baseUrl: 'http://localhost:8000');

  print('========================================');
  print('       API_ISLAM Dart/Flutter SDK       ');
  print('========================================\n');

  try {
    // 1. Fetch Surahs List
    print('1. Fetching Surah Al-Fatihah with Warsh recitation:');
    final fatihah = await api.quran.getSurah(1, qiraah: 'warsh');
    print('   Surah: ${fatihah.info.name} (${fatihah.qiraah})');
    for (final v in fatihah.verses) {
      print('   [${v.verseNumber}] ${v.text}');
    }

    // 2. Fetch Prayer Times for Tunis
    print('\n2. Fetching Prayer Times & Qibla for Tunis (36.8065, 10.1815):');
    final prayerTimes = await api.prayers.getPrayerTimes(
      latitude: 36.8065,
      longitude: 10.1815,
    );
    print('   Fajr:    ${prayerTimes.fajr}');
    print('   Dhuhr:   ${prayerTimes.dhuhr}');
    print('   Asr:     ${prayerTimes.asr}');
    print('   Maghrib: ${prayerTimes.maghrib}');
    print('   Isha:    ${prayerTimes.isha}');
    print('   Hijri:   ${prayerTimes.hijri}');

    // 3. Qibla Direction
    final qibla = await api.prayers.getQibla(latitude: 36.8065, longitude: 10.1815);
    print('   Qibla Direction: ${qibla.directionDegrees}° (${qibla.compassDirection})');
    print('   Distance to Kaaba: ${qibla.distanceKm} km');

    // 4. Asma Allah Al-Husna
    print('\n3. Fetching First 3 Names of Allah:');
    final names = await api.azkar.getNamesOfAllah();
    for (final n in names.take(3)) {
      print('   #${n.number} ${n.nameArabic} - ${n.transliteration} (${n.meaningEnglish})');
    }

    // 5. Zakat Calculator
    print('\n4. Calculating Zakat for \$10,000 Cash:');
    final zakat = await api.tools.calculateZakat(cash: 10000.0);
    print('   Is Eligible: ${zakat.isEligible}');
    print('   Zakat Due:   ${zakat.zakatDue} ${zakat.currency}');
  } catch (e) {
    print('Error occurred: $e');
  } finally {
    api.close();
  }
}

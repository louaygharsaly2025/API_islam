/// Models for Holy Quran and Surahs/Ayahs.

class SurahInfo {
  final int id;
  final String name;
  final String englishName;
  final String englishNameTranslation;
  final int totalVerses;
  final String revelationType;
  final int pageStart;
  final int pageEnd;

  const SurahInfo({
    required this.id,
    required this.name,
    required this.englishName,
    required this.englishNameTranslation,
    required this.totalVerses,
    required this.revelationType,
    required this.pageStart,
    required this.pageEnd,
  });

  factory SurahInfo.fromJson(Map<String, dynamic> json) {
    return SurahInfo(
      id: json['id'] as int? ?? json['number'] as int? ?? 0,
      name: json['name'] as String? ?? '',
      englishName: json['englishName'] as String? ?? json['name_en'] as String? ?? '',
      englishNameTranslation: json['englishNameTranslation'] as String? ?? '',
      totalVerses: json['total_verses'] as int? ?? json['numberOfAyahs'] as int? ?? 0,
      revelationType: json['revelation_type'] as String? ?? json['revelationType'] as String? ?? '',
      pageStart: json['page_start'] as int? ?? 0,
      pageEnd: json['page_end'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'englishName': englishName,
        'englishNameTranslation': englishNameTranslation,
        'total_verses': totalVerses,
        'revelation_type': revelationType,
        'page_start': pageStart,
        'page_end': pageEnd,
      };
}

class Ayah {
  final int id;
  final int surahId;
  final int verseNumber;
  final String text;
  final int page;
  final int juz;
  final int hizbQuarter;
  final String? audioUrl;
  final String? translation;

  const Ayah({
    required this.id,
    required this.surahId,
    required this.verseNumber,
    required this.text,
    required this.page,
    required this.juz,
    required this.hizbQuarter,
    this.audioUrl,
    this.translation,
  });

  factory Ayah.fromJson(Map<String, dynamic> json) {
    return Ayah(
      id: json['id'] as int? ?? json['number'] as int? ?? 0,
      surahId: json['surah_id'] as int? ?? json['surahNumber'] as int? ?? 0,
      verseNumber: json['verse_number'] as int? ?? json['numberInSurah'] as int? ?? 0,
      text: json['text'] as String? ?? '',
      page: json['page'] as int? ?? 0,
      juz: json['juz'] as int? ?? 0,
      hizbQuarter: json['hizbQuarter'] as int? ?? 0,
      audioUrl: json['audio_url'] as String? ?? json['audio'] as String?,
      translation: json['translation'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'surah_id': surahId,
        'verse_number': verseNumber,
        'text': text,
        'page': page,
        'juz': juz,
        'hizbQuarter': hizbQuarter,
        'audio_url': audioUrl,
        'translation': translation,
      };
}

class SurahDetail {
  final SurahInfo info;
  final List<Ayah> verses;
  final String qiraah;

  const SurahDetail({
    required this.info,
    required this.verses,
    required this.qiraah,
  });

  factory SurahDetail.fromJson(Map<String, dynamic> json) {
    final info = SurahInfo.fromJson(json['info'] as Map<String, dynamic>? ?? json);
    final rawVerses = json['verses'] as List<dynamic>? ?? json['ayahs'] as List<dynamic>? ?? [];
    return SurahDetail(
      info: info,
      verses: rawVerses.map((e) => Ayah.fromJson(e as Map<String, dynamic>)).toList(),
      qiraah: json['qiraah'] as String? ?? 'hafs',
    );
  }
}

class QiraahInfo {
  final String id;
  final String nameArabic;
  final String nameEnglish;
  final String fontName;
  final String woff2Url;
  final String ttfUrl;

  const QiraahInfo({
    required this.id,
    required this.nameArabic,
    required this.nameEnglish,
    required this.fontName,
    required this.woff2Url,
    required this.ttfUrl,
  });

  factory QiraahInfo.fromJson(Map<String, dynamic> json) {
    return QiraahInfo(
      id: json['id'] as String? ?? '',
      nameArabic: json['name_ar'] as String? ?? json['name'] as String? ?? '',
      nameEnglish: json['name_en'] as String? ?? '',
      fontName: json['font_name'] as String? ?? '',
      woff2Url: json['woff2_url'] as String? ?? '',
      ttfUrl: json['ttf_url'] as String? ?? '',
    );
  }
}

class QuranSearchResult {
  final int count;
  final String query;
  final String qiraah;
  final List<Ayah> results;

  const QuranSearchResult({
    required this.count,
    required this.query,
    required this.qiraah,
    required this.results,
  });

  factory QuranSearchResult.fromJson(Map<String, dynamic> json) {
    final rawResults = json['results'] as List<dynamic>? ?? [];
    return QuranSearchResult(
      count: json['count'] as int? ?? rawResults.length,
      query: json['query'] as String? ?? '',
      qiraah: json['qiraah'] as String? ?? 'hafs',
      results: rawResults.map((e) => Ayah.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }
}

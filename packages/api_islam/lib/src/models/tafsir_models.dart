// Models for Quran Tafsir & Exegesis.

/// Information about a Tafsir book collection.
class TafsirBook {
  final String id;
  final String nameArabic;
  final String nameEnglish;
  final String language;
  final String author;

  const TafsirBook({
    required this.id,
    required this.nameArabic,
    required this.nameEnglish,
    required this.language,
    required this.author,
  });

  factory TafsirBook.fromJson(Map<String, dynamic> json) {
    return TafsirBook(
      id: json['id'] as String? ?? json['tafsir_id'] as String? ?? '',
      nameArabic: json['name_ar'] as String? ?? json['name'] as String? ?? '',
      nameEnglish: json['name_en'] as String? ?? json['english_name'] as String? ?? '',
      language: json['language'] as String? ?? 'ar',
      author: json['author'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name_ar': nameArabic,
        'name_en': nameEnglish,
        'language': language,
        'author': author,
      };
}

/// Tafsir explanation for a single Ayah.
class AyahTafsir {
  final String tafsirId;
  final int surahNumber;
  final int ayahNumber;
  final String text;

  const AyahTafsir({
    required this.tafsirId,
    required this.surahNumber,
    required this.ayahNumber,
    required this.text,
  });

  factory AyahTafsir.fromJson(Map<String, dynamic> json) {
    return AyahTafsir(
      tafsirId: json['tafsir_id'] as String? ?? '',
      surahNumber: json['surah_number'] as int? ?? json['surah'] as int? ?? 0,
      ayahNumber: json['ayah_number'] as int? ?? json['ayah'] as int? ?? 0,
      text: json['tafsir_text'] as String? ?? json['text'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'tafsir_id': tafsirId,
        'surah_number': surahNumber,
        'ayah_number': ayahNumber,
        'tafsir_text': text,
      };
}

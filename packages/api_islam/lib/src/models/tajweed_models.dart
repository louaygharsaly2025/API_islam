/// Models for Tajweed rules and colored text.

class TajweedRule {
  final String id;
  final String nameArabic;
  final String nameEnglish;
  final String colorHex;
  final String description;

  const TajweedRule({
    required this.id,
    required this.nameArabic,
    required this.nameEnglish,
    required this.colorHex,
    required this.description,
  });

  factory TajweedRule.fromJson(Map<String, dynamic> json) {
    return TajweedRule(
      id: json['id'] as String? ?? json['rule_id'] as String? ?? '',
      nameArabic: json['name_ar'] as String? ?? json['name'] as String? ?? '',
      nameEnglish: json['name_en'] as String? ?? '',
      colorHex: json['color_hex'] as String? ?? json['color'] as String? ?? '#000000',
      description: json['description'] as String? ?? '',
    );
  }
}

class TajweedSegment {
  final String text;
  final String? ruleId;
  final String? colorHex;

  const TajweedSegment({
    required this.text,
    this.ruleId,
    this.colorHex,
  });

  factory TajweedSegment.fromJson(Map<String, dynamic> json) {
    return TajweedSegment(
      text: json['text'] as String? ?? '',
      ruleId: json['rule'] as String? ?? json['rule_id'] as String?,
      colorHex: json['color'] as String?,
    );
  }
}

class TajweedAyah {
  final int surahId;
  final int ayahNumber;
  final String rawText;
  final List<TajweedSegment> segments;

  const TajweedAyah({
    required this.surahId,
    required this.ayahNumber,
    required this.rawText,
    required this.segments,
  });

  factory TajweedAyah.fromJson(Map<String, dynamic> json) {
    final rawSegments = json['segments'] as List<dynamic>? ?? [];
    return TajweedAyah(
      surahId: json['surah_id'] as int? ?? json['surah'] as int? ?? 0,
      ayahNumber: json['ayah_number'] as int? ?? json['ayah'] as int? ?? 0,
      rawText: json['text'] as String? ?? '',
      segments: rawSegments.map((e) => TajweedSegment.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }
}

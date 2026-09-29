/// Models for Azkar and Duas.

class ZekrItem {
  final int id;
  final String category;
  final String zekr;
  final String? description;
  final int count;
  final String? reference;
  final String? audioUrl;

  const ZekrItem({
    required this.id,
    required this.category,
    required this.zekr,
    this.description,
    required this.count,
    this.reference,
    this.audioUrl,
  });

  factory ZekrItem.fromJson(Map<String, dynamic> json) {
    return ZekrItem(
      id: json['id'] as int? ?? 0,
      category: json['category'] as String? ?? '',
      zekr: json['zekr'] as String? ?? json['text'] as String? ?? '',
      description: json['description'] as String?,
      count: int.tryParse(json['count']?.toString() ?? '1') ?? 1,
      reference: json['reference'] as String?,
      audioUrl: json['audio'] as String? ?? json['audio_url'] as String?,
    );
  }
}

class RabbanaDua {
  final int number;
  final String arabic;
  final String translation;
  final String referenceSurah;
  final String referenceAyah;

  const RabbanaDua({
    required this.number,
    required this.arabic,
    required this.translation,
    required this.referenceSurah,
    required this.referenceAyah,
  });

  factory RabbanaDua.fromJson(Map<String, dynamic> json) {
    return RabbanaDua(
      number: json['number'] as int? ?? json['id'] as int? ?? 0,
      arabic: json['arabic'] as String? ?? json['text'] as String? ?? '',
      translation: json['translation'] as String? ?? json['translation_en'] as String? ?? '',
      referenceSurah: json['surah'] as String? ?? json['reference_surah'] as String? ?? '',
      referenceAyah: json['ayah'] as String? ?? json['reference_ayah'] as String? ?? '',
    );
  }
}

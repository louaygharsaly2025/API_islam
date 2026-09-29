/// 99 Names of Allah (Asma' Allah Al-Husna).

class NameOfAllah {
  final int number;
  final String nameArabic;
  final String transliteration;
  final String meaningEnglish;

  const NameOfAllah({
    required this.number,
    required this.nameArabic,
    required this.transliteration,
    required this.meaningEnglish,
  });

  factory NameOfAllah.fromJson(Map<String, dynamic> json) {
    return NameOfAllah(
      number: json['number'] as int? ?? json['id'] as int? ?? 0,
      nameArabic: json['name'] as String? ?? json['name_ar'] as String? ?? '',
      transliteration: json['transliteration'] as String? ?? json['transliteration_en'] as String? ?? '',
      meaningEnglish: json['meaning'] as String? ?? json['meaning_en'] as String? ?? '',
    );
  }
}

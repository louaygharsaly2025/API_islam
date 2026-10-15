// 99 Names of Allah (Asma' Allah Al-Husna).

/// Model representing one of the 99 Beautiful Names of Allah.
class NameOfAllah {
  /// The number/order of the name (1-99).
  final int number;

  /// The name in Arabic script with tashkeel.
  final String nameArabic;

  /// The phonetic transliteration in English.
  final String transliteration;

  /// The English meaning and translation.
  final String meaningEnglish;

  /// Creates a [NameOfAllah] instance.
  const NameOfAllah({
    required this.number,
    required this.nameArabic,
    required this.transliteration,
    required this.meaningEnglish,
  });

  /// Creates a [NameOfAllah] from a JSON map.
  factory NameOfAllah.fromJson(Map<String, dynamic> json) {
    return NameOfAllah(
      number: json['number'] as int? ?? json['id'] as int? ?? 0,
      nameArabic: json['name'] as String? ?? json['name_ar'] as String? ?? '',
      transliteration: json['transliteration'] as String? ?? json['transliteration_en'] as String? ?? '',
      meaningEnglish: json['meaning'] as String? ?? json['meaning_en'] as String? ?? '',
    );
  }

  /// Converts this instance to a JSON map.
  Map<String, dynamic> toJson() => {
        'number': number,
        'name_ar': nameArabic,
        'transliteration': transliteration,
        'meaning_en': meaningEnglish,
      };
}

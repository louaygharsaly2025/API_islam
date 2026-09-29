/// Ruqyah Shariah Models.

class RuqyahItem {
  final int id;
  final String title;
  final String arabic;
  final String? translation;
  final int repeat;
  final String? reference;

  const RuqyahItem({
    required this.id,
    required this.title,
    required this.arabic,
    this.translation,
    required this.repeat,
    this.reference,
  });

  factory RuqyahItem.fromJson(Map<String, dynamic> json) {
    return RuqyahItem(
      id: json['id'] as int? ?? 0,
      title: json['title'] as String? ?? '',
      arabic: json['arabic'] as String? ?? json['text'] as String? ?? '',
      translation: json['translation'] as String?,
      repeat: int.tryParse(json['repeat']?.toString() ?? json['count']?.toString() ?? '1') ?? 1,
      reference: json['reference'] as String?,
    );
  }
}

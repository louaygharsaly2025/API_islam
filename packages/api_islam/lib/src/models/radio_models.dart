/// Islamic Live Radios Model.

class IslamicRadio {
  final int id;
  final String name;
  final String url;
  final String? country;
  final String? language;

  const IslamicRadio({
    required this.id,
    required this.name,
    required this.url,
    this.country,
    this.language,
  });

  factory IslamicRadio.fromJson(Map<String, dynamic> json) {
    return IslamicRadio(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? '',
      url: json['url'] as String? ?? json['stream_url'] as String? ?? '',
      country: json['country'] as String?,
      language: json['language'] as String?,
    );
  }
}

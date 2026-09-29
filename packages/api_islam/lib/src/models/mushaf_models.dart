/// Mushaf page and font models.

class MushafPage {
  final int pageNumber;
  final String imageUrl;
  final String? qiraah;
  final List<dynamic>? verses;

  const MushafPage({
    required this.pageNumber,
    required this.imageUrl,
    this.qiraah,
    this.verses,
  });

  factory MushafPage.fromJson(Map<String, dynamic> json) {
    return MushafPage(
      pageNumber: json['page_number'] as int? ?? json['page'] as int? ?? 1,
      imageUrl: json['image_url'] as String? ?? json['url'] as String? ?? '',
      qiraah: json['qiraah'] as String?,
      verses: json['verses'] as List<dynamic>?,
    );
  }
}

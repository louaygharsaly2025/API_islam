/// Models for Kutub as-Sittah Hadith Encyclopedia.

class HadithBook {
  final String id;
  final String nameArabic;
  final String nameEnglish;
  final int hadithsCount;
  final int chaptersCount;

  const HadithBook({
    required this.id,
    required this.nameArabic,
    required this.nameEnglish,
    required this.hadithsCount,
    required this.chaptersCount,
  });

  factory HadithBook.fromJson(Map<String, dynamic> json) {
    return HadithBook(
      id: json['id'] as String? ?? json['book_id'] as String? ?? '',
      nameArabic: json['name_ar'] as String? ?? json['name'] as String? ?? '',
      nameEnglish: json['name_en'] as String? ?? json['englishName'] as String? ?? '',
      hadithsCount: json['hadiths_count'] as int? ?? json['total_hadiths'] as int? ?? 0,
      chaptersCount: json['chapters_count'] as int? ?? json['total_chapters'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name_ar': nameArabic,
        'name_en': nameEnglish,
        'hadiths_count': hadithsCount,
        'chapters_count': chaptersCount,
      };
}

class HadithChapter {
  final int chapterNumber;
  final String titleArabic;
  final String titleEnglish;
  final int hadithsCount;

  const HadithChapter({
    required this.chapterNumber,
    required this.titleArabic,
    required this.titleEnglish,
    required this.hadithsCount,
  });

  factory HadithChapter.fromJson(Map<String, dynamic> json) {
    return HadithChapter(
      chapterNumber: json['chapter_number'] as int? ?? json['id'] as int? ?? int.tryParse(json['chapter_number']?.toString() ?? '') ?? 0,
      titleArabic: json['title_ar'] as String? ?? json['arabic'] as String? ?? '',
      titleEnglish: json['title_en'] as String? ?? json['english'] as String? ?? '',
      hadithsCount: json['hadiths_count'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
        'chapter_number': chapterNumber,
        'title_ar': titleArabic,
        'title_en': titleEnglish,
        'hadiths_count': hadithsCount,
      };
}

class HadithItem {
  final int hadithNumber;
  final String arabic;
  final String english;
  final String? bookId;
  final int? chapterNumber;

  const HadithItem({
    required this.hadithNumber,
    required this.arabic,
    required this.english,
    this.bookId,
    this.chapterNumber,
  });

  factory HadithItem.fromJson(Map<String, dynamic> json) {
    // English can sometimes be an object or string
    String parsedEnglish = '';
    final rawEn = json['english'];
    if (rawEn is String) {
      parsedEnglish = rawEn;
    } else if (rawEn is Map) {
      parsedEnglish = rawEn['narrator'] != null 
          ? '${rawEn['narrator']}: ${rawEn['text'] ?? ''}' 
          : rawEn['text']?.toString() ?? rawEn.toString();
    }

    return HadithItem(
      hadithNumber: json['hadith_number'] as int? ?? 
          json['hadithNumber'] as int? ?? 
          int.tryParse(json['id']?.toString() ?? '') ?? 0,
      arabic: json['arabic'] as String? ?? '',
      english: parsedEnglish,
      bookId: json['book_id'] as String? ?? json['book'] as String?,
      chapterNumber: json['chapter_number'] as int? ?? json['chapterId'] as int?,
    );
  }

  Map<String, dynamic> toJson() => {
        'hadith_number': hadithNumber,
        'arabic': arabic,
        'english': english,
        'book_id': bookId,
        'chapter_number': chapterNumber,
      };
}

class HadithSearchResult {
  final int count;
  final String query;
  final String? book;
  final List<HadithItem> results;

  const HadithSearchResult({
    required this.count,
    required this.query,
    this.book,
    required this.results,
  });

  factory HadithSearchResult.fromJson(Map<String, dynamic> json) {
    final rawResults = json['results'] as List<dynamic>? ?? [];
    return HadithSearchResult(
      count: json['count'] as int? ?? rawResults.length,
      query: json['query'] as String? ?? '',
      book: json['book'] as String?,
      results: rawResults.map((e) => HadithItem.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }
}

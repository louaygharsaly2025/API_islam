// Models for Kutub as-Sittah Hadith Encyclopedia.

/// Information about a Hadith book collection (e.g. Bukhari, Muslim).
class HadithBook {
  /// Unique identifier of the book (e.g., 'bukhari').
  final String id;

  /// Arabic title of the book.
  final String nameArabic;

  /// English title of the book.
  final String nameEnglish;

  /// Total count of Hadiths in this book.
  final int hadithsCount;

  /// Total count of chapters in this book.
  final int chaptersCount;

  /// Creates a [HadithBook] instance.
  const HadithBook({
    required this.id,
    required this.nameArabic,
    required this.nameEnglish,
    required this.hadithsCount,
    required this.chaptersCount,
  });

  /// Creates a [HadithBook] from a JSON map.
  factory HadithBook.fromJson(Map<String, dynamic> json) {
    return HadithBook(
      id: json['id'] as String? ?? json['book_id'] as String? ?? '',
      nameArabic: json['name_ar'] as String? ?? json['name'] as String? ?? '',
      nameEnglish: json['name_en'] as String? ?? json['englishName'] as String? ?? '',
      hadithsCount: json['hadiths_count'] as int? ?? json['total_hadiths'] as int? ?? 0,
      chaptersCount: json['chapters_count'] as int? ?? json['total_chapters'] as int? ?? 0,
    );
  }

  /// Converts this instance to a JSON map.
  Map<String, dynamic> toJson() => {
        'id': id,
        'name_ar': nameArabic,
        'name_en': nameEnglish,
        'hadiths_count': hadithsCount,
        'chapters_count': chaptersCount,
      };
}

/// A chapter within a Hadith collection.
class HadithChapter {
  /// The chapter number.
  final int chapterNumber;

  /// The chapter title in Arabic.
  final String titleArabic;

  /// The chapter title in English.
  final String titleEnglish;

  /// Total hadiths in this chapter.
  final int hadithsCount;

  /// Creates a [HadithChapter] instance.
  const HadithChapter({
    required this.chapterNumber,
    required this.titleArabic,
    required this.titleEnglish,
    required this.hadithsCount,
  });

  /// Creates a [HadithChapter] from a JSON map.
  factory HadithChapter.fromJson(Map<String, dynamic> json) {
    return HadithChapter(
      chapterNumber: json['chapter_number'] as int? ?? json['id'] as int? ?? int.tryParse(json['chapter_number']?.toString() ?? '') ?? 0,
      titleArabic: json['title_ar'] as String? ?? json['arabic'] as String? ?? '',
      titleEnglish: json['title_en'] as String? ?? json['english'] as String? ?? '',
      hadithsCount: json['hadiths_count'] as int? ?? 0,
    );
  }

  /// Converts this instance to a JSON map.
  Map<String, dynamic> toJson() => {
        'chapter_number': chapterNumber,
        'title_ar': titleArabic,
        'title_en': titleEnglish,
        'hadiths_count': hadithsCount,
      };
}

/// A single Hadith narration with Arabic text and English translation.
class HadithItem {
  /// The Hadith number in the collection.
  final int hadithNumber;

  /// The Arabic matn and isnad text.
  final String arabic;

  /// The English translation.
  final String english;

  /// The book identifier, if available.
  final String? bookId;

  /// The chapter number, if available.
  final int? chapterNumber;

  /// Creates a [HadithItem] instance.
  const HadithItem({
    required this.hadithNumber,
    required this.arabic,
    required this.english,
    this.bookId,
    this.chapterNumber,
  });

  /// Creates a [HadithItem] from a JSON map.
  factory HadithItem.fromJson(Map<String, dynamic> json) {
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

  /// Converts this instance to a JSON map.
  Map<String, dynamic> toJson() => {
        'hadith_number': hadithNumber,
        'arabic': arabic,
        'english': english,
        'book_id': bookId,
        'chapter_number': chapterNumber,
      };
}

/// Results of a Hadith search operation.
class HadithSearchResult {
  /// Total number of matching results.
  final int count;

  /// The original search query.
  final String query;

  /// The filtered book ID, if any.
  final String? book;

  /// The list of matching Hadiths.
  final List<HadithItem> results;

  /// Creates a [HadithSearchResult] instance.
  const HadithSearchResult({
    required this.count,
    required this.query,
    this.book,
    required this.results,
  });

  /// Creates a [HadithSearchResult] from a JSON map.
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

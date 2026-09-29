/// Models for Prayer Times, Qibla, and Hijri Calendar.

class PrayerTimesData {
  final String fajr;
  final String sunrise;
  final String dhuhr;
  final String asr;
  final String maghrib;
  final String isha;
  final String? imsak;
  final String? midnight;
  final String date;
  final HijriDate? hijri;

  const PrayerTimesData({
    required this.fajr,
    required this.sunrise,
    required this.dhuhr,
    required this.asr,
    required this.maghrib,
    required this.isha,
    this.imsak,
    this.midnight,
    required this.date,
    this.hijri,
  });

  factory PrayerTimesData.fromJson(Map<String, dynamic> json) {
    final timings = json['timings'] as Map<String, dynamic>? ?? json;
    final hijriJson = json['hijri'] as Map<String, dynamic>? ?? json['date']?['hijri'] as Map<String, dynamic>?;

    return PrayerTimesData(
      fajr: timings['Fajr'] as String? ?? timings['fajr'] as String? ?? '',
      sunrise: timings['Sunrise'] as String? ?? timings['sunrise'] as String? ?? '',
      dhuhr: timings['Dhuhr'] as String? ?? timings['dhuhr'] as String? ?? '',
      asr: timings['Asr'] as String? ?? timings['asr'] as String? ?? '',
      maghrib: timings['Maghrib'] as String? ?? timings['maghrib'] as String? ?? '',
      isha: timings['Isha'] as String? ?? timings['isha'] as String? ?? '',
      imsak: timings['Imsak'] as String? ?? timings['imsak'] as String?,
      midnight: timings['Midnight'] as String? ?? timings['midnight'] as String?,
      date: json['readable_date'] as String? ?? json['date']?['readable'] as String? ?? '',
      hijri: hijriJson != null ? HijriDate.fromJson(hijriJson) : null,
    );
  }
}

class HijriDate {
  final int day;
  final int month;
  final int year;
  final String monthArabic;
  final String monthEnglish;
  final List<String> holidays;

  const HijriDate({
    required this.day,
    required this.month,
    required this.year,
    required this.monthArabic,
    required this.monthEnglish,
    this.holidays = const [],
  });

  factory HijriDate.fromJson(Map<String, dynamic> json) {
    final monthObj = json['month'] as Map<String, dynamic>? ?? {};
    final rawHolidays = json['holidays'] as List<dynamic>? ?? [];

    return HijriDate(
      day: int.tryParse(json['day']?.toString() ?? '1') ?? 1,
      month: int.tryParse(monthObj['number']?.toString() ?? json['month']?.toString() ?? '1') ?? 1,
      year: int.tryParse(json['year']?.toString() ?? '1448') ?? 1448,
      monthArabic: monthObj['ar'] as String? ?? json['month_ar'] as String? ?? '',
      monthEnglish: monthObj['en'] as String? ?? json['month_en'] as String? ?? '',
      holidays: rawHolidays.map((e) => e.toString()).toList(),
    );
  }

  @override
  String toString() => '$day $monthArabic $year هـ';
}

class QiblaData {
  final double latitude;
  final double longitude;
  final double directionDegrees;
  final String compassDirection;
  final double distanceKm;

  const QiblaData({
    required this.latitude,
    required this.longitude,
    required this.directionDegrees,
    required this.compassDirection,
    required this.distanceKm,
  });

  factory QiblaData.fromJson(Map<String, dynamic> json) {
    return QiblaData(
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
      directionDegrees: (json['direction'] as num? ?? json['qibla_direction'] as num?)?.toDouble() ?? 0.0,
      compassDirection: json['compass_direction'] as String? ?? '',
      distanceKm: (json['distance_to_kaaba_km'] as num? ?? json['distance_km'] as num?)?.toDouble() ?? 0.0,
    );
  }
}

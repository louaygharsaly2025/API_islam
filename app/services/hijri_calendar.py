"""
Hijri Calendar and Islamic Events Service.
Provides accurate Gregorian <-> Hijri conversions and Islamic Occasions calendar.
"""
import math
from datetime import datetime, date

class HijriCalendarService:
    HIJRI_MONTHS = [
        {"number": 1, "name_ar": "محرّم", "name_en": "Muharram", "days": 30},
        {"number": 2, "name_ar": "صفر", "name_en": "Safar", "days": 29},
        {"number": 3, "name_ar": "ربيع الأول", "name_en": "Rabi' al-Awwal", "days": 30},
        {"number": 4, "name_ar": "ربيع الثاني", "name_en": "Rabi' al-Thani", "days": 29},
        {"number": 5, "name_ar": "جمادى الأولى", "name_en": "Jumada al-Awwal", "days": 30},
        {"number": 6, "name_ar": "جمادى الآخرة", "name_en": "Jumada al-Thani", "days": 29},
        {"number": 7, "name_ar": "رجب", "name_en": "Rajab", "days": 30},
        {"number": 8, "name_ar": "شعبان", "name_en": "Sha'ban", "days": 29},
        {"number": 9, "name_ar": "رمضان", "name_en": "Ramadan", "days": 30},
        {"number": 10, "name_ar": "شوّال", "name_en": "Shawwal", "days": 29},
        {"number": 11, "name_ar": "ذو القعدة", "name_en": "Dhu al-Qi'dah", "days": 30},
        {"number": 12, "name_ar": "ذو الحجة", "name_en": "Dhu al-Hijjah", "days": 29}
    ]

    DAYS_AR = ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"]
    DAYS_EN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    @classmethod
    def gregorian_to_jd(cls, year, month, day):
        if month <= 2:
            year -= 1
            month += 12
        a = math.floor(year / 100)
        b = 2 - a + math.floor(a / 4)
        return math.floor(365.25 * (year + 4716)) + math.floor(30.6001 * (month + 1)) + day + b - 1524.5

    @classmethod
    def jd_to_hijri(cls, jd, adjustment_days=0):
        jd = math.floor(jd) + 0.5 + adjustment_days
        l = jd - 1948440 + 10632
        n = math.floor((l - 1) / 10631)
        l = l - 10631 * n + 354
        j = (math.floor((10985 - l) / 5316)) * (math.floor((50 * l) / 17719)) + (math.floor(l / 5670)) * (math.floor((43 * l) / 15238))
        l = l - (math.floor((30 - j) / 15)) * (math.floor((17719 * j) / 50)) - (math.floor(j / 16)) * (math.floor((15238 * j) / 43)) + 29
        m = math.floor((24 * l) / 709)
        d = l - math.floor((709 * m) / 24)
        y = 30 * n + j - 30

        month_num = int(m)
        month_info = cls.HIJRI_MONTHS[month_num - 1] if 1 <= month_num <= 12 else cls.HIJRI_MONTHS[0]

        return {
            "day": int(d),
            "month": month_num,
            "month_name_ar": month_info["name_ar"],
            "month_name_en": month_info["name_en"],
            "year": int(y),
            "formatted_ar": f"{int(d)} {month_info['name_ar']} {int(y)} هـ",
            "formatted_en": f"{int(d)} {month_info['name_en']} {int(y)} AH"
        }

    @classmethod
    def convert_gregorian(cls, target_date=None, adjustment_days=0):
        if target_date is None:
            target_date = date.today()
        elif isinstance(target_date, str):
            target_date = datetime.strptime(target_date, "%Y-%m-%d").date()

        jd = cls.gregorian_to_jd(target_date.year, target_date.month, target_date.day)
        hijri = cls.jd_to_hijri(jd, adjustment_days)

        weekday_idx = target_date.weekday()

        return {
            "gregorian": {
                "date": target_date.strftime("%Y-%m-%d"),
                "day_name_ar": cls.DAYS_AR[weekday_idx],
                "day_name_en": cls.DAYS_EN[weekday_idx],
                "year": target_date.year,
                "month": target_date.month,
                "day": target_date.day
            },
            "hijri": hijri
        }

    @classmethod
    def get_islamic_events(cls, hijri_year: int = None):
        if hijri_year is None:
            today_hijri = cls.convert_gregorian()["hijri"]
            hijri_year = today_hijri["year"]

        events = [
            {"hijri_date": f"{hijri_year}-01-01", "name_ar": "رأس السنة الهجرية", "name_en": "Islamic New Year", "description": "بداية العام الهجري الجديد"},
            {"hijri_date": f"{hijri_year}-01-10", "name_ar": "يوم عاشوراء", "name_en": "Day of Ashura", "description": "يوم نجّى الله فيه موسى وقومه"},
            {"hijri_date": f"{hijri_year}-03-12", "name_ar": "المولد النبوي الشريف", "name_en": "Mawlid al-Nabi", "description": "مولد النبي محمد صلى الله عليه وسلم"},
            {"hijri_date": f"{hijri_year}-07-27", "name_ar": "ذكرى الإسراء والمعراج", "name_en": "Isra and Mi'raj", "description": "رحلة الإسراء من المسجد الحرام إلى الأقصى ثم المعراج"},
            {"hijri_date": f"{hijri_year}-08-15", "name_ar": "ليلة النصف من شعبان", "name_en": "Mid-Sha'ban", "description": "ليلة تحويل القبلة وفضل الدعاء"},
            {"hijri_date": f"{hijri_year}-09-01", "name_ar": "بداية شهر رمضان المبارك", "name_en": "First day of Ramadan", "description": "بداية شهر الصيام والقرآن"},
            {"hijri_date": f"{hijri_year}-09-27", "name_ar": "ليلة القدر (رجاءً)", "name_en": "Laylat al-Qadr (27th)", "description": "ليلة خير من ألف شهر"},
            {"hijri_date": f"{hijri_year}-10-01", "name_ar": "عيد الفطر المبارك", "name_en": "Eid al-Fitr", "description": "أول أيام عيد الفطر السعيد"},
            {"hijri_date": f"{hijri_year}-12-01", "name_ar": "بداية العشر الأوائل من ذي الحجة", "name_en": "First Ten Days of Dhu al-Hijjah", "description": "أفضل أيام الدنيا للعمل الصالح"},
            {"hijri_date": f"{hijri_year}-12-09", "name_ar": "يوم عرفة (وقفة عرفات)", "name_en": "Day of Arafah", "description": "ركن الحج الأعظم ويوم مغفرة الذنوب"},
            {"hijri_date": f"{hijri_year}-12-10", "name_ar": "عيد الأضحى المبارك", "name_en": "Eid al-Adha", "description": "أول أيام عيد النحر المبارك"},
            {"hijri_date": f"{hijri_year}-12-11", "name_ar": "أيام التشريق", "name_en": "Days of Tashreeq", "description": "أيام أكل وشرب وذكر لله تعالى"}
        ]
        return {
            "hijri_year": hijri_year,
            "events_count": len(events),
            "events": events
        }

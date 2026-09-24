"""
Solar Astronomical Prayer Times Calculator.
Calculates accurate Islamic Prayer Times based on geographic coordinates, date, and calculation convention.
"""
import math
from datetime import datetime, date

def fix_angle(a):
    a = a - 360.0 * (math.floor(a / 360.0))
    return a + 360.0 if a < 0 else a

def fix_hour(a):
    a = a - 24.0 * (math.floor(a / 24.0))
    return a + 24.0 if a < 0 else a

def d_sin(d): return math.sin(math.radians(d))
def d_cos(d): return math.cos(math.radians(d))
def d_tan(d): return math.tan(math.radians(d))
def d_arcsin(x): return math.degrees(math.asin(max(min(x, 1.0), -1.0)))
def d_arccos(x): return math.degrees(math.acos(max(min(x, 1.0), -1.0)))
def d_arctan2(y, x): return math.degrees(math.atan2(y, x))
def d_arccot(x): return math.degrees(math.atan(1.0 / x))

class PrayerCalculator:
    METHODS = {
        "MWL": {"name": "Muslim World League", "fajr": 18.0, "isha": 17.0},
        "ISNA": {"name": "Islamic Society of North America", "fajr": 15.0, "isha": 15.0},
        "EGYPT": {"name": "Egyptian General Authority of Survey", "fajr": 19.5, "isha": 17.5},
        "MAKKAH": {"name": "Umm Al-Qura University, Makkah", "fajr": 18.5, "isha_min": 90},
        "KARACHI": {"name": "University of Islamic Sciences, Karachi", "fajr": 18.0, "isha": 18.0},
        "TEHRAN": {"name": "Institute of Geophysics, University of Tehran", "fajr": 17.7, "isha": 14.0, "maghrib": 4.5},
        "GULF": {"name": "Gulf Region", "fajr": 19.5, "isha_min": 90}
    }

    @staticmethod
    def get_julian_date(y, m, d):
        if m <= 2:
            y -= 1
            m += 12
        a = math.floor(y / 100)
        b = 2 - a + math.floor(a / 4)
        return math.floor(365.25 * (y + 4716)) + math.floor(30.6001 * (m + 1)) + d + b - 1524.5

    @classmethod
    def sun_position(cls, jd):
        d = jd - 2451545.0
        g = fix_angle(357.529 + 0.98560028 * d)
        q = fix_angle(280.459 + 0.98564736 * d)
        l = fix_angle(q + 1.915 * d_sin(g) + 0.020 * d_sin(2 * g))
        e = 23.439 - 0.00000036 * d
        dec = d_arcsin(d_sin(e) * d_sin(l))
        ra = fix_angle(d_arctan2(d_cos(e) * d_sin(l), d_cos(l)))
        eq_t = (q - ra) / 15.0
        if eq_t > 12:
            eq_t -= 24
        elif eq_t < -12:
            eq_t += 24
        return dec, eq_t

    @classmethod
    def hour_angle_for_angle(cls, angle, lat, dec):
        val = (-d_sin(angle) - d_sin(lat) * d_sin(dec)) / (d_cos(lat) * d_cos(dec))
        if val > 1.0 or val < -1.0:
            return None
        return (1.0 / 15.0) * d_arccos(val)

    @classmethod
    def hour_angle_for_asr(cls, factor, lat, dec):
        alt = d_arccot(factor + d_tan(abs(lat - dec)))
        val_cos = (d_sin(alt) - d_sin(lat) * d_sin(dec)) / (d_cos(lat) * d_cos(dec))
        if val_cos > 1.0 or val_cos < -1.0:
            return None
        return (1.0 / 15.0) * d_arccos(val_cos)

    @classmethod
    def float_to_time_str(cls, time_float):
        if time_float is None:
            return "--:--"
        time_float = fix_hour(time_float + 0.5 / 60.0)
        hours = math.floor(time_float)
        minutes = math.floor((time_float - hours) * 60)
        return f"{int(hours):02d}:{int(minutes):02d}"

    @classmethod
    def calculate(cls, lat, lng, target_date=None, timezone_offset=1.0, method="EGYPT", asr_school="Shafi"):
        if target_date is None:
            target_date = date.today()
        elif isinstance(target_date, str):
            target_date = datetime.strptime(target_date, "%Y-%m-%d").date()

        jd = cls.get_julian_date(target_date.year, target_date.month, target_date.day)
        dec, eq_t = cls.sun_position(jd)

        # Midday (Dhuhr)
        dhuhr = fix_hour(12.0 + timezone_offset - (lng / 15.0) - eq_t)

        method_params = cls.METHODS.get(method.upper(), cls.METHODS["EGYPT"])
        fajr_angle = method_params.get("fajr", 19.5)
        isha_angle = method_params.get("isha", 17.5)

        # Sunrise & Sunset (approx 0.833 deg depression)
        t_sun = cls.hour_angle_for_angle(0.833, lat, dec)
        sunrise = fix_hour(dhuhr - t_sun) if t_sun is not None else None
        sunset = fix_hour(dhuhr + t_sun) if t_sun is not None else None

        # Fajr
        t_fajr = cls.hour_angle_for_angle(fajr_angle, lat, dec)
        fajr = fix_hour(dhuhr - t_fajr) if t_fajr is not None else None

        # Asr
        factor = 2 if asr_school.lower() == "hanafi" else 1
        t_asr = cls.hour_angle_for_asr(factor, lat, dec)
        asr = fix_hour(dhuhr + t_asr) if t_asr is not None else None

        # Maghrib
        if "maghrib" in method_params:
            t_maghrib = cls.hour_angle_for_angle(method_params["maghrib"], lat, dec)
            maghrib = fix_hour(dhuhr + t_maghrib) if t_maghrib is not None else sunset
        else:
            maghrib = sunset

        # Isha
        if "isha_min" in method_params:
            isha = fix_hour(maghrib + (method_params["isha_min"] / 60.0)) if maghrib is not None else None
        else:
            t_isha = cls.hour_angle_for_angle(isha_angle, lat, dec)
            isha = fix_hour(dhuhr + t_isha) if t_isha is not None else None

        # Imsak (10 min before Fajr)
        imsak = fix_hour(fajr - (10.0 / 60.0)) if fajr is not None else None

        # Midnight (midpoint between Sunset and Sunrise next morning)
        midnight = fix_hour(sunset + (fix_hour(sunrise + 24.0 - sunset) / 2.0)) if sunset and sunrise else None

        return {
            "latitude": lat,
            "longitude": lng,
            "date": target_date.strftime("%Y-%m-%d"),
            "timezone": f"UTC+{timezone_offset}" if timezone_offset >= 0 else f"UTC{timezone_offset}",
            "method": {
                "id": method.upper(),
                "name": method_params.get("name", method),
                "fajr_angle": fajr_angle,
                "isha_angle": isha_angle if "isha" in method_params else None,
                "asr_school": asr_school
            },
            "timings": {
                "Imsak": cls.float_to_time_str(imsak),
                "Fajr": cls.float_to_time_str(fajr),
                "Sunrise": cls.float_to_time_str(sunrise),
                "Dhuhr": cls.float_to_time_str(dhuhr),
                "Asr": cls.float_to_time_str(asr),
                "Sunset": cls.float_to_time_str(sunset),
                "Maghrib": cls.float_to_time_str(maghrib),
                "Isha": cls.float_to_time_str(isha),
                "Midnight": cls.float_to_time_str(midnight)
            }
        }

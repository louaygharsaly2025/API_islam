"""
Qibla Direction and Distance Calculator.
Calculates the exact direction towards the Holy Kaaba in Makkah (21.422487, 39.826206)
from any geographic coordinates on Earth using the Great-Circle navigation formula.
"""
import math

class QiblaCalculator:
    # Coordinates of the Holy Kaaba in Makkah
    KAABA_LAT = 21.422487
    KAABA_LNG = 39.826206
    EARTH_RADIUS_KM = 6371.0

    @classmethod
    def calculate(cls, lat: float, lng: float):
        """
        Calculate Qibla bearing (in degrees clockwise from True North: 0° - 360°)
        and distance to the Kaaba in kilometers.
        """
        phi1 = math.radians(lat)
        phi2 = math.radians(cls.KAABA_LAT)
        delta_lambda = math.radians(cls.KAABA_LNG - lng)

        # Great circle forward azimuth formula
        y = math.sin(delta_lambda) * math.cos(phi2)
        x = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(delta_lambda)
        
        bearing = math.degrees(math.atan2(y, x))
        # Normalize to 0° - 360°
        bearing = (bearing + 360.0) % 360.0

        # Great circle distance (Haversine formula)
        delta_phi = math.radians(cls.KAABA_LAT - lat)
        a = math.sin(delta_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        distance_km = cls.EARTH_RADIUS_KM * c

        # Compass cardinal direction representation
        cardinals = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
        idx = int((bearing + 11.25) / 22.5) % 16
        cardinal_en = cardinals[idx]

        cardinals_ar = {
            "N": "الشمال", "NNE": "شمال شمال شرق", "NE": "شمال شرق", "ENE": "شرق شمال شرق",
            "E": "الشرق", "ESE": "شرق جنوب شرق", "SE": "جنوب شرق", "SSE": "جنوب جنوب شرق",
            "S": "الجنوب", "SSW": "جنوب جنوب غرب", "SW": "جنوب غرب", "WSW": "غرب جنوب غرب",
            "W": "الغرب", "WNW": "غرب شمال غرب", "NW": "شمال غرب", "NNW": "شمال شمال غرب"
        }

        return {
            "latitude": lat,
            "longitude": lng,
            "direction_degrees": round(bearing, 2),
            "compass_direction": cardinal_en,
            "compass_direction_ar": cardinals_ar.get(cardinal_en, ""),
            "distance_km": round(distance_km, 2),
            "kaaba_coordinates": {
                "latitude": cls.KAABA_LAT,
                "longitude": cls.KAABA_LNG
            }
        }

"""
Helper script to initialize clean, accurate baseline Islamic datasets.
"""
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

surahs_metadata = [
    {"number": 1, "name_arabic": "الفاتحة", "name_english": "Al-Faatiha", "name_translation": "The Opening", "revelation_type": "Meccan", "total_verses": 7},
    {"number": 2, "name_arabic": "البقرة", "name_english": "Al-Baqara", "name_translation": "The Cow", "revelation_type": "Medinan", "total_verses": 286},
    {"number": 3, "name_arabic": "آل عمران", "name_english": "Aal-i-Imraan", "name_translation": "The Family of Imraan", "revelation_type": "Medinan", "total_verses": 200},
    {"number": 4, "name_arabic": "النساء", "name_english": "An-Nisaa", "name_translation": "The Women", "revelation_type": "Medinan", "total_verses": 176},
    {"number": 5, "name_arabic": "المائدة", "name_english": "Al-Maaida", "name_translation": "The Table", "revelation_type": "Medinan", "total_verses": 120},
    {"number": 6, "name_arabic": "الأنعام", "name_english": "Al-An'aam", "name_translation": "The Cattle", "revelation_type": "Meccan", "total_verses": 165},
    {"number": 7, "name_arabic": "الأعراف", "name_english": "Al-A'raaf", "name_translation": "The Heights", "revelation_type": "Meccan", "total_verses": 206},
    {"number": 8, "name_arabic": "الأنفال", "name_english": "Al-Anfaal", "name_translation": "The Spoils of War", "revelation_type": "Medinan", "total_verses": 75},
    {"number": 9, "name_arabic": "التوبة", "name_english": "At-Tawba", "name_translation": "The Repentance", "revelation_type": "Medinan", "total_verses": 129},
    {"number": 10, "name_arabic": "يونس", "name_english": "Yunus", "name_translation": "Jonas", "revelation_type": "Meccan", "total_verses": 109},
    {"number": 11, "name_arabic": "هود", "name_english": "Hud", "name_translation": "Hud", "revelation_type": "Meccan", "total_verses": 123},
    {"number": 12, "name_arabic": "يوسف", "name_english": "Yusuf", "name_translation": "Joseph", "revelation_type": "Meccan", "total_verses": 111},
    {"number": 13, "name_arabic": "الرعد", "name_english": "Ar-Ra'd", "name_translation": "The Thunder", "revelation_type": "Medinan", "total_verses": 43},
    {"number": 14, "name_arabic": "إبراهيم", "name_english": "Ibrahim", "name_translation": "Abraham", "revelation_type": "Meccan", "total_verses": 52},
    {"number": 15, "name_arabic": "الحجر", "name_english": "Al-Hijr", "name_translation": "The Rock", "revelation_type": "Meccan", "total_verses": 99},
    {"number": 16, "name_arabic": "النحل", "name_english": "An-Nahl", "name_translation": "The Bee", "revelation_type": "Meccan", "total_verses": 128},
    {"number": 17, "name_arabic": "الإسراء", "name_english": "Al-Israa", "name_translation": "The Night Journey", "revelation_type": "Meccan", "total_verses": 111},
    {"number": 18, "name_arabic": "الكهف", "name_english": "Al-Kahf", "name_translation": "The Cave", "revelation_type": "Meccan", "total_verses": 110},
    {"number": 19, "name_arabic": "مريم", "name_english": "Maryam", "name_translation": "Mary", "revelation_type": "Meccan", "total_verses": 98},
    {"number": 20, "name_arabic": "طه", "name_english": "Taa-Haa", "name_translation": "Taa-Haa", "revelation_type": "Meccan", "total_verses": 135},
    {"number": 21, "name_arabic": "الأنبياء", "name_english": "Al-Anbiya", "name_translation": "The Prophets", "revelation_type": "Meccan", "total_verses": 112},
    {"number": 22, "name_arabic": "الحج", "name_english": "Al-Hajj", "name_translation": "The Pilgrimage", "revelation_type": "Medinan", "total_verses": 78},
    {"number": 23, "name_arabic": "المؤمنون", "name_english": "Al-Muminoon", "name_translation": "The Believers", "revelation_type": "Meccan", "total_verses": 118},
    {"number": 24, "name_arabic": "النور", "name_english": "An-Noor", "name_translation": "The Light", "revelation_type": "Medinan", "total_verses": 64},
    {"number": 25, "name_arabic": "الفرقان", "name_english": "Al-Furqaan", "name_translation": "The Criterion", "revelation_type": "Meccan", "total_verses": 77},
    {"number": 26, "name_arabic": "الشعراء", "name_english": "Ash-Shu'araa", "name_translation": "The Poets", "revelation_type": "Meccan", "total_verses": 227},
    {"number": 27, "name_arabic": "النمل", "name_english": "An-Naml", "name_translation": "The Ant", "revelation_type": "Meccan", "total_verses": 93},
    {"number": 28, "name_arabic": "القصص", "name_english": "Al-Qasas", "name_translation": "The Stories", "revelation_type": "Meccan", "total_verses": 88},
    {"number": 29, "name_arabic": "العنكبوت", "name_english": "Al-Ankaboot", "name_translation": "The Spider", "revelation_type": "Meccan", "total_verses": 69},
    {"number": 30, "name_arabic": "الروم", "name_english": "Ar-Room", "name_translation": "The Romans", "revelation_type": "Meccan", "total_verses": 60},
    {"number": 31, "name_arabic": "لقمان", "name_english": "Luqman", "name_translation": "Luqman", "revelation_type": "Meccan", "total_verses": 34},
    {"number": 32, "name_arabic": "السجدة", "name_english": "As-Sajda", "name_translation": "The Prostration", "revelation_type": "Meccan", "total_verses": 30},
    {"number": 33, "name_arabic": "الأحزاب", "name_english": "Al-Ahzaab", "name_translation": "The Clans", "revelation_type": "Medinan", "total_verses": 73},
    {"number": 34, "name_arabic": "سبإ", "name_english": "Saba", "name_translation": "Sheba", "revelation_type": "Meccan", "total_verses": 54},
    {"number": 35, "name_arabic": "فاطر", "name_english": "Faatir", "name_translation": "The Originator", "revelation_type": "Meccan", "total_verses": 45},
    {"number": 36, "name_arabic": "يس", "name_english": "Yaseen", "name_translation": "Yaseen", "revelation_type": "Meccan", "total_verses": 83},
    {"number": 37, "name_arabic": "الصافات", "name_english": "As-Saaffaat", "name_translation": "Those drawn up in Ranks", "revelation_type": "Meccan", "total_verses": 182},
    {"number": 38, "name_arabic": "ص", "name_english": "Saad", "name_translation": "The Letter Saad", "revelation_type": "Meccan", "total_verses": 88},
    {"number": 39, "name_arabic": "الزمر", "name_english": "Az-Zumar", "name_translation": "The Groups", "revelation_type": "Meccan", "total_verses": 75},
    {"number": 40, "name_arabic": "غافر", "name_english": "Ghafir", "name_translation": "The Forgiver", "revelation_type": "Meccan", "total_verses": 85},
    {"number": 41, "name_arabic": "فصلت", "name_english": "Fussilat", "name_translation": "Explained in Detail", "revelation_type": "Meccan", "total_verses": 54},
    {"number": 42, "name_arabic": "الشورى", "name_english": "Ash-Shura", "name_translation": "Consultation", "revelation_type": "Meccan", "total_verses": 53},
    {"number": 43, "name_arabic": "الزخرف", "name_english": "Az-Zukhruf", "name_translation": "Ornaments of gold", "revelation_type": "Meccan", "total_verses": 89},
    {"number": 44, "name_arabic": "الدخان", "name_english": "Ad-Dukhaan", "name_translation": "The Smoke", "revelation_type": "Meccan", "total_verses": 59},
    {"number": 45, "name_arabic": "الجاثية", "name_english": "Al-Jaathiya", "name_translation": "Crouching", "revelation_type": "Meccan", "total_verses": 37},
    {"number": 46, "name_arabic": "الأحقاف", "name_english": "Al-Ahqaf", "name_translation": "The Dunes", "revelation_type": "Meccan", "total_verses": 35},
    {"number": 47, "name_arabic": "محمد", "name_english": "Muhammad", "name_translation": "Muhammad", "revelation_type": "Medinan", "total_verses": 38},
    {"number": 48, "name_arabic": "الفتح", "name_english": "Al-Fath", "name_translation": "The Victory", "revelation_type": "Medinan", "total_verses": 29},
    {"number": 49, "name_arabic": "الحجرات", "name_english": "Al-Hujuraat", "name_translation": "The Inner Apartments", "revelation_type": "Medinan", "total_verses": 18},
    {"number": 50, "name_arabic": "ق", "name_english": "Qaaf", "name_translation": "The Letter Qaaf", "revelation_type": "Meccan", "total_verses": 45},
    {"number": 51, "name_arabic": "الذاريات", "name_english": "Adh-Dhaariyaat", "name_translation": "The Winnowing Winds", "revelation_type": "Meccan", "total_verses": 60},
    {"number": 52, "name_arabic": "الطور", "name_english": "At-Toor", "name_translation": "The Mount", "revelation_type": "Meccan", "total_verses": 49},
    {"number": 53, "name_arabic": "النجم", "name_english": "An-Najm", "name_translation": "The Star", "revelation_type": "Meccan", "total_verses": 62},
    {"number": 54, "name_arabic": "القمر", "name_english": "Al-Qamar", "name_translation": "The Moon", "revelation_type": "Meccan", "total_verses": 55},
    {"number": 55, "name_arabic": "الرحمن", "name_english": "Ar-Rahmaan", "name_translation": "The Beneficent", "revelation_type": "Medinan", "total_verses": 78},
    {"number": 56, "name_arabic": "الواقعة", "name_english": "Al-Waaqia", "name_translation": "The Inevitable", "revelation_type": "Meccan", "total_verses": 96},
    {"number": 57, "name_arabic": "الحديد", "name_english": "Al-Hadid", "name_translation": "The Iron", "revelation_type": "Medinan", "total_verses": 29},
    {"number": 58, "name_arabic": "المجادلة", "name_english": "Al-Mujaadila", "name_translation": "The Pleading Woman", "revelation_type": "Medinan", "total_verses": 22},
    {"number": 59, "name_arabic": "الحشر", "name_english": "Al-Hashr", "name_translation": "The Exile", "revelation_type": "Medinan", "total_verses": 24},
    {"number": 60, "name_arabic": "الممتحنة", "name_english": "Al-Mumtahana", "name_translation": "She that is to be examined", "revelation_type": "Medinan", "total_verses": 13},
    {"number": 61, "name_arabic": "الصف", "name_english": "As-Saff", "name_translation": "The Ranks", "revelation_type": "Medinan", "total_verses": 14},
    {"number": 62, "name_arabic": "الجمعة", "name_english": "Al-Jumu'a", "name_translation": "Friday", "revelation_type": "Medinan", "total_verses": 11},
    {"number": 63, "name_arabic": "المنافقون", "name_english": "Al-Munaafiqoon", "name_translation": "The Hypocrites", "revelation_type": "Medinan", "total_verses": 11},
    {"number": 64, "name_arabic": "التغابن", "name_english": "At-Taghaabun", "name_translation": "Mutual Disillusion", "revelation_type": "Medinan", "total_verses": 18},
    {"number": 65, "name_arabic": "الطلاق", "name_english": "At-Talaaq", "name_translation": "Divorce", "revelation_type": "Medinan", "total_verses": 12},
    {"number": 66, "name_arabic": "التحريم", "name_english": "At-Tahrim", "name_translation": "The Prohibition", "revelation_type": "Medinan", "total_verses": 12},
    {"number": 67, "name_arabic": "الملك", "name_english": "Al-Mulk", "name_translation": "The Sovereignty", "revelation_type": "Meccan", "total_verses": 30},
    {"number": 68, "name_arabic": "القلم", "name_english": "Al-Qalam", "name_translation": "The Pen", "revelation_type": "Meccan", "total_verses": 52},
    {"number": 69, "name_arabic": "الحاقة", "name_english": "Al-Haaqqa", "name_translation": "The Reality", "revelation_type": "Meccan", "total_verses": 52},
    {"number": 70, "name_arabic": "المعارج", "name_english": "Al-Ma'aarij", "name_translation": "The Ascending Stairways", "revelation_type": "Meccan", "total_verses": 44},
    {"number": 71, "name_arabic": "نوح", "name_english": "Nooh", "name_translation": "Noah", "revelation_type": "Meccan", "total_verses": 28},
    {"number": 72, "name_arabic": "الجن", "name_english": "Al-Jinn", "name_translation": "The Jinn", "revelation_type": "Meccan", "total_verses": 28},
    {"number": 73, "name_arabic": "المزمل", "name_english": "Al-Muzzammil", "name_translation": "The Enshrouded One", "revelation_type": "Meccan", "total_verses": 20},
    {"number": 74, "name_arabic": "المدثر", "name_english": "Al-Muddaththir", "name_translation": "The Cloaked One", "revelation_type": "Meccan", "total_verses": 56},
    {"number": 75, "name_arabic": "القيامة", "name_english": "Al-Qiyaama", "name_translation": "The Resurrection", "revelation_type": "Meccan", "total_verses": 40},
    {"number": 76, "name_arabic": "الإنسان", "name_english": "Al-Insaan", "name_translation": "Man", "revelation_type": "Medinan", "total_verses": 31},
    {"number": 77, "name_arabic": "المرسلات", "name_english": "Al-Mursalaat", "name_translation": "The Emissaries", "revelation_type": "Meccan", "total_verses": 50},
    {"number": 78, "name_arabic": "النبإ", "name_english": "An-Naba", "name_translation": "The Tidings", "revelation_type": "Meccan", "total_verses": 40},
    {"number": 79, "name_arabic": "النازعات", "name_english": "An-Naazi'aat", "name_translation": "Those who drag forth", "revelation_type": "Meccan", "total_verses": 46},
    {"number": 80, "name_arabic": "عبس", "name_english": "Abasa", "name_translation": "He frowned", "revelation_type": "Meccan", "total_verses": 42},
    {"number": 81, "name_arabic": "التكوير", "name_english": "At-Takwir", "name_translation": "The Overthrowing", "revelation_type": "Meccan", "total_verses": 29},
    {"number": 82, "name_arabic": "الانفطار", "name_english": "Al-Infitaar", "name_translation": "The Cleaving", "revelation_type": "Meccan", "total_verses": 19},
    {"number": 83, "name_arabic": "المطففين", "name_english": "Al-Mutaffifin", "name_translation": "Defrauding", "revelation_type": "Meccan", "total_verses": 36},
    {"number": 84, "name_arabic": "الانشقاق", "name_english": "Al-Inshiqaaq", "name_translation": "The Splitting Open", "revelation_type": "Meccan", "total_verses": 25},
    {"number": 85, "name_arabic": "البروج", "name_english": "Al-Burooj", "name_translation": "The Constellations", "revelation_type": "Meccan", "total_verses": 22},
    {"number": 86, "name_arabic": "الطارق", "name_english": "At-Taariq", "name_translation": "The Morning Star", "revelation_type": "Meccan", "total_verses": 17},
    {"number": 87, "name_arabic": "الأعلى", "name_english": "Al-A'laa", "name_translation": "The Most High", "revelation_type": "Meccan", "total_verses": 19},
    {"number": 88, "name_arabic": "الغاشية", "name_english": "Al-Ghaashiya", "name_translation": "The Overwhelming", "revelation_type": "Meccan", "total_verses": 26},
    {"number": 89, "name_arabic": "الفجر", "name_english": "Al-Fajr", "name_translation": "The Dawn", "revelation_type": "Meccan", "total_verses": 30},
    {"number": 90, "name_arabic": "البلد", "name_english": "Al-Balad", "name_translation": "The City", "revelation_type": "Meccan", "total_verses": 20},
    {"number": 91, "name_arabic": "الشمس", "name_english": "Ash-Shams", "name_translation": "The Sun", "revelation_type": "Meccan", "total_verses": 15},
    {"number": 92, "name_arabic": "الليل", "name_english": "Al-Lail", "name_translation": "The Night", "revelation_type": "Meccan", "total_verses": 21},
    {"number": 93, "name_arabic": "الضحى", "name_english": "Ad-Dhuhaa", "name_translation": "The Morning Hours", "revelation_type": "Meccan", "total_verses": 11},
    {"number": 94, "name_arabic": "الشرح", "name_english": "Ash-Sharh", "name_translation": "The Consolation", "revelation_type": "Meccan", "total_verses": 8},
    {"number": 95, "name_arabic": "التين", "name_english": "At-Teen", "name_translation": "The Fig", "revelation_type": "Meccan", "total_verses": 8},
    {"number": 96, "name_arabic": "العلق", "name_english": "Al-Alaq", "name_translation": "The Clot", "revelation_type": "Meccan", "total_verses": 19},
    {"number": 97, "name_arabic": "القدر", "name_english": "Al-Qadr", "name_translation": "The Power, Fate", "revelation_type": "Meccan", "total_verses": 5},
    {"number": 98, "name_arabic": "البينة", "name_english": "Al-Bayyina", "name_translation": "The Clear Proof", "revelation_type": "Medinan", "total_verses": 8},
    {"number": 99, "name_arabic": "الزلزلة", "name_english": "Az-Zalzala", "name_translation": "The Earthquake", "revelation_type": "Medinan", "total_verses": 8},
    {"number": 100, "name_arabic": "العاديات", "name_english": "Al-Aadiyaat", "name_translation": "The Courser", "revelation_type": "Meccan", "total_verses": 11},
    {"number": 101, "name_arabic": "القارعة", "name_english": "Al-Qaari'a", "name_translation": "The Calamity", "revelation_type": "Meccan", "total_verses": 11},
    {"number": 102, "name_arabic": "التكاثر", "name_english": "At-Takaathur", "name_translation": "Competition in increase", "revelation_type": "Meccan", "total_verses": 8},
    {"number": 103, "name_arabic": "العصر", "name_english": "Al-Asr", "name_translation": "The Declining Day, Epoch", "revelation_type": "Meccan", "total_verses": 3},
    {"number": 104, "name_arabic": "الهمزة", "name_english": "Al-Humaza", "name_translation": "The Traducer", "revelation_type": "Meccan", "total_verses": 9},
    {"number": 105, "name_arabic": "الفيل", "name_english": "Al-Feel", "name_translation": "The Elephant", "revelation_type": "Meccan", "total_verses": 5},
    {"number": 106, "name_arabic": "قريش", "name_english": "Quraish", "name_translation": "Quraysh", "revelation_type": "Meccan", "total_verses": 4},
    {"number": 107, "name_arabic": "الماعون", "name_english": "Al-Maa'oon", "name_translation": "Almsgiving", "revelation_type": "Meccan", "total_verses": 7},
    {"number": 108, "name_arabic": "الكوثر", "name_english": "Al-Kawthar", "name_translation": "Abundance", "revelation_type": "Meccan", "total_verses": 3},
    {"number": 109, "name_arabic": "الكافرون", "name_english": "Al-Kaafiroon", "name_translation": "The Disbelievers", "revelation_type": "Meccan", "total_verses": 6},
    {"number": 110, "name_arabic": "النصر", "name_english": "An-Nasr", "name_translation": "Divine Support", "revelation_type": "Medinan", "total_verses": 3},
    {"number": 111, "name_arabic": "المسد", "name_english": "Al-Masad", "name_translation": "The Palm Fibre", "revelation_type": "Meccan", "total_verses": 5},
    {"number": 112, "name_arabic": "الإخلاص", "name_english": "Al-Ikhlaas", "name_translation": "Sincerity", "revelation_type": "Meccan", "total_verses": 4},
    {"number": 113, "name_arabic": "الفلق", "name_english": "Al-Falaq", "name_translation": "The Dawn", "revelation_type": "Meccan", "total_verses": 5},
    {"number": 114, "name_arabic": "الناس", "name_english": "An-Naas", "name_translation": "Mankind", "revelation_type": "Meccan", "total_verses": 6}
]

# Write Surahs Info
os.makedirs(os.path.join(DATA_DIR, "quran"), exist_ok=True)
with open(os.path.join(DATA_DIR, "quran", "surahs_info.json"), "w", encoding="utf-8") as f:
    json.dump(surahs_metadata, f, ensure_ascii=False, indent=2)

# Sample Surahs with full ayat
surah_1 = {
    "number": 1,
    "name_arabic": "الفاتحة",
    "name_english": "Al-Faatiha",
    "name_translation": "The Opening",
    "revelation_type": "Meccan",
    "total_verses": 7,
    "bismillah_pre": False,
    "verses": [
        {"number": 1, "number_in_surah": 1, "juz": 1, "page": 1, "text_uthmani": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "text_simple": "بسم الله الرحمن الرحيم", "translation_en": "In the name of Allah, the Entirely Merciful, the Especially Merciful.", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3"},
        {"number": 2, "number_in_surah": 2, "juz": 1, "page": 1, "text_uthmani": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", "text_simple": "الحمد لله رب العالمين", "translation_en": "[All] praise is [due] to Allah, Lord of the worlds -", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3"},
        {"number": 3, "number_in_surah": 3, "juz": 1, "page": 1, "text_uthmani": "الرَّحْمَٰنِ الرَّحِيمِ", "text_simple": "الرحمن الرحيم", "translation_en": "The Entirely Merciful, the Especially Merciful,", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3"},
        {"number": 4, "number_in_surah": 4, "juz": 1, "page": 1, "text_uthmani": "مَالِكِ يَوْمِ الدِّينِ", "text_simple": "مالك يوم الدين", "translation_en": "Sovereign of the Day of Recompense.", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3"},
        {"number": 5, "number_in_surah": 5, "juz": 1, "page": 1, "text_uthmani": "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", "text_simple": "إياك نعبد وإياك نستعين", "translation_en": "It is You we worship and You we ask for help.", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5.mp3"},
        {"number": 6, "number_in_surah": 6, "juz": 1, "page": 1, "text_uthmani": "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", "text_simple": "اهدنا الصراط المستقيم", "translation_en": "Guide us to the straight path -", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3"},
        {"number": 7, "number_in_surah": 7, "juz": 1, "page": 1, "text_uthmani": "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", "text_simple": "صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين", "translation_en": "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/7.mp3"}
    ]
}

surah_112 = {
    "number": 112,
    "name_arabic": "الإخلاص",
    "name_english": "Al-Ikhlaas",
    "name_translation": "Sincerity",
    "revelation_type": "Meccan",
    "total_verses": 4,
    "bismillah_pre": True,
    "verses": [
        {"number": 6222, "number_in_surah": 1, "juz": 30, "page": 604, "text_uthmani": "قُلْ هُوَ اللَّهُ أَحَدٌ", "text_simple": "قل هو الله أحد", "translation_en": "Say, He is Allah, [who is] One,", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6222.mp3"},
        {"number": 6223, "number_in_surah": 2, "juz": 30, "page": 604, "text_uthmani": "اللَّهُ الصَّمَدُ", "text_simple": "الله الصمد", "translation_en": "Allah, the Eternal Refuge.", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6223.mp3"},
        {"number": 6224, "number_in_surah": 3, "juz": 30, "page": 604, "text_uthmani": "لَمْ يَلِدْ وَلَمْ يُولَدْ", "text_simple": "لم يلد ولم يولد", "translation_en": "He neither begets nor is born,", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6224.mp3"},
        {"number": 6225, "number_in_surah": 4, "juz": 30, "page": 604, "text_uthmani": "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", "text_simple": "ولم يكن له كفوا أحد", "translation_en": "Nor is there to Him any equivalent.", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6225.mp3"}
    ]
}

surah_113 = {
    "number": 113,
    "name_arabic": "الفلق",
    "name_english": "Al-Falaq",
    "name_translation": "The Daybreak",
    "revelation_type": "Meccan",
    "total_verses": 5,
    "bismillah_pre": True,
    "verses": [
        {"number": 6226, "number_in_surah": 1, "juz": 30, "page": 604, "text_uthmani": "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", "text_simple": "قل أعوذ برب الفلق", "translation_en": "Say, I seek refuge in the Lord of daybreak", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6226.mp3"},
        {"number": 6227, "number_in_surah": 2, "juz": 30, "page": 604, "text_uthmani": "مِن شَرِّ مَا خَلَقَ", "text_simple": "من شر ما خلق", "translation_en": "From the evil of that which He created", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6227.mp3"},
        {"number": 6228, "number_in_surah": 3, "juz": 30, "page": 604, "text_uthmani": "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", "text_simple": "ومن شر غاسق إذا وقب", "translation_en": "And from the evil of darkness when it settles", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6228.mp3"},
        {"number": 6229, "number_in_surah": 4, "juz": 30, "page": 604, "text_uthmani": "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", "text_simple": "ومن شر النفاثات في العقد", "translation_en": "And from the evil of the blowers in knots", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6229.mp3"},
        {"number": 6230, "number_in_surah": 5, "juz": 30, "page": 604, "text_uthmani": "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", "text_simple": "ومن شر حاسد إذا حسد", "translation_en": "And from the evil of an envier when he envies.", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6230.mp3"}
    ]
}

surah_114 = {
    "number": 114,
    "name_arabic": "الناس",
    "name_english": "An-Naas",
    "name_translation": "Mankind",
    "revelation_type": "Meccan",
    "total_verses": 6,
    "bismillah_pre": True,
    "verses": [
        {"number": 6231, "number_in_surah": 1, "juz": 30, "page": 604, "text_uthmani": "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", "text_simple": "قل أعوذ برب الناس", "translation_en": "Say, I seek refuge in the Lord of mankind,", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6231.mp3"},
        {"number": 6232, "number_in_surah": 2, "juz": 30, "page": 604, "text_uthmani": "مَلِكِ النَّاسِ", "text_simple": "ملك الناس", "translation_en": "The Sovereign of mankind,", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6232.mp3"},
        {"number": 6233, "number_in_surah": 3, "juz": 30, "page": 604, "text_uthmani": "إِلَٰهِ النَّاسِ", "text_simple": "إله الناس", "translation_en": "The God of mankind,", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6233.mp3"},
        {"number": 6234, "number_in_surah": 4, "juz": 30, "page": 604, "text_uthmani": "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", "text_simple": "من شر الوسواس الخناس", "translation_en": "From the evil of the retreating whisperer -", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6234.mp3"},
        {"number": 6235, "number_in_surah": 5, "juz": 30, "page": 604, "text_uthmani": "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", "text_simple": "الذي يوسوس في صدور الناس", "translation_en": "Who whispers into the breasts of mankind -", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6235.mp3"},
        {"number": 6236, "number_in_surah": 6, "juz": 30, "page": 604, "text_uthmani": "مِنَ الْجِنَّةِ وَالنَّاسِ", "text_simple": "من الجنة والناس", "translation_en": "From among the jinn and mankind.", "audio_url": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6236.mp3"}
    ]
}

os.makedirs(os.path.join(DATA_DIR, "quran", "surahs"), exist_ok=True)
for s in [surah_1, surah_112, surah_113, surah_114]:
    with open(os.path.join(DATA_DIR, "quran", "surahs", f"{s['number']}.json"), "w", encoding="utf-8") as f:
        json.dump(s, f, ensure_ascii=False, indent=2)

# Reciters
reciters = [
    {"id": "ar.alafasy", "name_ar": "مشاري راشد العفاسي", "name_en": "Mishary Rashid Alafasy", "bitrate": "128kbps", "format": "mp3", "subfolder": "ar.alafasy"},
    {"id": "ar.abdulbasit", "name_ar": "عبد الباسط عبد الصمد (مرتل)", "name_en": "Abdul Basit Abdul Samad", "bitrate": "192kbps", "format": "mp3", "subfolder": "ar.abdulbasitmurattal"},
    {"id": "ar.sudais", "name_ar": "عبد الرحمن السديس", "name_en": "Abdur-Rahman as-Sudais", "bitrate": "192kbps", "format": "mp3", "subfolder": "ar.abdurrahmaansudais"},
    {"id": "ar.ghamidi", "name_ar": "سعد الغامدي", "name_en": "Saad Al-Ghamdi", "bitrate": "128kbps", "format": "mp3", "subfolder": "ar.saadalghamidi"},
    {"id": "ar.husary", "name_ar": "محمود خليل الحصري", "name_en": "Mahmoud Khalil Al-Husary", "bitrate": "128kbps", "format": "mp3", "subfolder": "ar.husary"}
]
os.makedirs(os.path.join(DATA_DIR, "quran", "audio"), exist_ok=True)
with open(os.path.join(DATA_DIR, "quran", "audio", "reciters.json"), "w", encoding="utf-8") as f:
    json.dump(reciters, f, ensure_ascii=False, indent=2)

# Adhkar
os.makedirs(os.path.join(DATA_DIR, "adhkar"), exist_ok=True)
adhkar_categories = [
    {"id": "morning", "title_ar": "أذكار الصباح", "title_en": "Morning Remembrance", "count": 4},
    {"id": "evening", "title_ar": "أذكار المساء", "title_en": "Evening Remembrance", "count": 4},
    {"id": "sleep", "title_ar": "أذكار النوم", "title_en": "Remembrance before sleep", "count": 3},
    {"id": "after_prayer", "title_ar": "أذكار بعد الصلاة", "title_en": "Remembrance after prayer", "count": 4}
]
with open(os.path.join(DATA_DIR, "adhkar", "categories.json"), "w", encoding="utf-8") as f:
    json.dump(adhkar_categories, f, ensure_ascii=False, indent=2)

adhkar_morning = {
    "category_id": "morning",
    "category_name_ar": "أذكار الصباح",
    "category_name_en": "Morning Remembrance",
    "description": "أذكار تقال بعد صلاة الفجر إلى شروق الشمس",
    "items": [
        {
            "id": 1,
            "arabic_text": "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
            "translation_en": "We have entered the morning and kingdom belongs to Allah, and all praise is for Allah. None has the right to be worshipped except Allah alone, without partner.",
            "repeat_count": 1,
            "reference": "صحيح مسلم",
            "benefit": "من قالها حين يصبح وحين يمسي كفته من كل شيء"
        },
        {
            "id": 2,
            "arabic_text": "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.",
            "translation_en": "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and unto You is the resurrection.",
            "repeat_count": 1,
            "reference": "سنن الترمذي",
            "benefit": "بركة اليوم وحفظ النفس"
        },
        {
            "id": 3,
            "arabic_text": "اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لا يَغْفِرُ الذُّنُوبَ إِلا أَنْتَ.",
            "translation_en": "O Allah, You are my Lord, none has the right to be worshipped except You, You created me and I am Your servant...",
            "repeat_count": 1,
            "reference": "صحيح البخاري (سيد الاستغفار)",
            "benefit": "من قالها موقناً بها حين يمسي فمات دخل الجنة، وكذلك إذا أصبح"
        },
        {
            "id": 4,
            "arabic_text": "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ.",
            "translation_en": "Glory is to Allah and praise is to Him, by the number of His creation and by His pleasure and by the weight of His Throne and by the ink of His words.",
            "repeat_count": 3,
            "reference": "صحيح مسلم",
            "benefit": "تعدل ساعات طويلة من الذكر"
        }
    ]
}
with open(os.path.join(DATA_DIR, "adhkar", "morning.json"), "w", encoding="utf-8") as f:
    json.dump(adhkar_morning, f, ensure_ascii=False, indent=2)

adhkar_evening = {
    "category_id": "evening",
    "category_name_ar": "أذكار المساء",
    "category_name_en": "Evening Remembrance",
    "description": "أذكار تقال بعد صلاة العصر إلى غروب الشمس",
    "items": [
        {
            "id": 1,
            "arabic_text": "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
            "translation_en": "We have reached the evening and the kingdom belongs to Allah...",
            "repeat_count": 1,
            "reference": "صحيح مسلم",
            "benefit": "حفظ وحرز حتى يصبح"
        },
        {
            "id": 2,
            "arabic_text": "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
            "translation_en": "I seek refuge in the perfect words of Allah from the evil of what He has created.",
            "repeat_count": 3,
            "reference": "صحيح مسلم",
            "benefit": "لم يضره شيء حتى يصبح"
        },
        {
            "id": 3,
            "arabic_text": "بِسْمِ اللَّهِ الَّذِي لا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.",
            "translation_en": "In the Name of Allah, with whose name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.",
            "repeat_count": 3,
            "reference": "سنن أبي داود والترمذي",
            "benefit": "حماية من كل مكروه وفجأة بلاء"
        },
        {
            "id": 4,
            "arabic_text": "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.",
            "translation_en": "Glory is to Allah and praise is to Him.",
            "repeat_count": 100,
            "reference": "صحيح مسلم",
            "benefit": "حُطت خطاياه وإن كانت مثل زبد البحر"
        }
    ]
}
with open(os.path.join(DATA_DIR, "adhkar", "evening.json"), "w", encoding="utf-8") as f:
    json.dump(adhkar_evening, f, ensure_ascii=False, indent=2)

# Hadith: 40 Nawawi Sample & Structure
os.makedirs(os.path.join(DATA_DIR, "hadith"), exist_ok=True)
hadith_nawawi = {
    "collection_id": "nawawi40",
    "title_ar": "الأربعون النووية",
    "title_en": "An-Nawawi's Forty Hadiths",
    "author": "الإمام يحيى بن شرف النووي",
    "total_hadiths": 5,
    "hadiths": [
        {
            "number": 1,
            "narrator": "عن أمير المؤمنين أبي حفص عمر بن الخطاب رضي الله عنه",
            "arabic_text": "سمعت رسول الله صلى الله عليه وسلم يقول: «إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى، فمن كانت هجرته إلى الله ورسوله فهجرته إلى الله ورسوله، ومن كانت هجرته لدنيا يصيبها أو امرأة ينكحها فهجرته إلى ما هاجر إليه».",
            "english_text": "I heard the Messenger of Allah (pbuh) say: Actions are according to intentions, and everyone will get what was intended...",
            "grade": "صحيح",
            "reference": "رواه البخاري ومسلم"
        },
        {
            "number": 2,
            "narrator": "عن عمر بن الخطاب رضي الله عنه أيضا",
            "arabic_text": "بينما نحن عند رسول الله صلى الله عليه وسلم ذات يوم إذ طلع علينا رجل شديد بياض الثياب شديد سواد الشعر... قال: فأخبرني عن الإسلام؟ فقال رسول الله صلى الله عليه وسلم: «الإسلام أن تشهد أن لا إله إلا الله وأن محمدا رسول الله، وتقيم الصلاة، وتؤتي الزكاة، وتصوم رمضان، وتحج البيت إن استطعت إليه سبيلا»...",
            "english_text": "While we were one day sitting with the Messenger of Allah (pbuh), there appeared before us a man dressed in extremely white clothes...",
            "grade": "صحيح",
            "reference": "رواه مسلم (حديث جبريل المشهور)"
        },
        {
            "number": 3,
            "narrator": "عن أبي عبد الرحمن عبد الله بن عمر بن الخطاب رضي الله عنهما",
            "arabic_text": "سمعت رسول الله صلى الله عليه وسلم يقول: «بني الإسلام على خمس: شهادة أن لا إله إلا الله وأن محمدا رسول الله، وإقام الصلاة، وإيتاء الزكاة، وحج البيت، وصوم رمضان».",
            "english_text": "Islam is built upon five pillars: testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, establishing prayer, paying zakah, Hajj to the House, and fasting Ramadan.",
            "grade": "صحيح",
            "reference": "رواه البخاري ومسلم"
        },
        {
            "number": 4,
            "narrator": "عن أبي هريرة رضي الله عنه",
            "arabic_text": "أن رسول الله صلى الله عليه وسلم قال: «من كان يؤمن بالله واليوم الآخر فليقل خيرا أو ليصمت، ومن كان يؤمن بالله واليوم الآخر فليكرم جاره، ومن كان يؤمن بالله واليوم الآخر فليكرم ضيفه».",
            "english_text": "Let him who believes in Allah and the Last Day speak good, or keep silent; and let him who believes in Allah and the Last Day be generous to his neighbor; and let him who believes in Allah and the Last Day be generous to his guest.",
            "grade": "صحيح",
            "reference": "رواه البخاري ومسلم"
        },
        {
            "number": 5,
            "narrator": "عن أبي حمزة أنس بن مالك رضي الله عنه خادم رسول الله صلى الله عليه وسلم",
            "arabic_text": "عن النبي صلى الله عليه وسلم قال: «لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه».",
            "english_text": "None of you truly believes until he loves for his brother what he loves for himself.",
            "grade": "صحيح",
            "reference": "رواه البخاري ومسلم"
        }
    ]
}
with open(os.path.join(DATA_DIR, "hadith", "nawawi40.json"), "w", encoding="utf-8") as f:
    json.dump(hadith_nawawi, f, ensure_ascii=False, indent=2)

# Prayer Times Calculation Methods
os.makedirs(os.path.join(DATA_DIR, "prayer_times"), exist_ok=True)
prayer_methods = {
    "methods": [
        {"id": "MWL", "name": "Muslim World League (رابطة العالم الإسلامي)", "fajr_angle": 18.0, "isha_angle": 17.0, "region": "Europe, Far East, Parts of US"},
        {"id": "ISNA", "name": "Islamic Society of North America (ISNA)", "fajr_angle": 15.0, "isha_angle": 15.0, "region": "North America"},
        {"id": "EGYPT", "name": "Egyptian General Authority of Survey (الهيئة العامة المصرية للمساحة)", "fajr_angle": 19.5, "isha_angle": 17.5, "region": "Africa, Middle East, Tunisia, Egypt"},
        {"id": "MAKKAH", "name": "Umm Al-Qura University, Makkah (جامعة أم القرى بمكة المكرمة)", "fajr_angle": 18.5, "isha_interval_min": 90, "region": "Arabian Peninsula"},
        {"id": "KARACHI", "name": "University of Islamic Sciences, Karachi", "fajr_angle": 18.0, "isha_angle": 18.0, "region": "Pakistan, Afghanistan, Bangladesh, India"},
        {"id": "TEHRAN", "name": "Institute of Geophysics, University of Tehran", "fajr_angle": 17.7, "isha_angle": 14.0, "maghrib_angle": 4.5, "region": "Iran, Some Shia communities"},
        {"id": "GULF", "name": "Gulf Region (منطقة الخليج)", "fajr_angle": 19.5, "isha_interval_min": 90, "region": "Gulf Countries"}
    ]
}
with open(os.path.join(DATA_DIR, "prayer_times", "methods.json"), "w", encoding="utf-8") as f:
    json.dump(prayer_methods, f, ensure_ascii=False, indent=2)

print("Datasets successfully initialized!")

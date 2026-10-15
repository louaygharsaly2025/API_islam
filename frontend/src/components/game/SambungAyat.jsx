import React, { useState } from "react";
import { Link } from "react-router-dom";

function SambungAyat() {
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("surah");

    const surahs = [
        { number: 1, name: "الفاتحة", latin: "Al-Fatihah", translation: "Pembukaan", verses: 7 },
        { number: 2, name: "البقرة", latin: "Al-Baqarah", translation: "Sapi Betina", verses: 286 },
        { number: 3, name: "آل عمران", latin: "Ali Imran", translation: "Keluarga Imran", verses: 200 },
        { number: 4, name: "النساء", latin: "An-Nisa", translation: "Wanita", verses: 176 },
        { number: 5, name: "المائدة", latin: "Al-Maidah", translation: "Hidangan", verses: 120 },
        { number: 6, name: "الأنعام", latin: "Al-An'am", translation: "Binatang Ternak", verses: 165 },
        { number: 7, name: "الأعراف", latin: "Al-A'raf", translation: "Tempat Tertinggi", verses: 206 },
        { number: 8, name: "الأنفال", latin: "Al-Anfal", translation: "Rampasan Perang", verses: 75 },
        { number: 9, name: "التوبة", latin: "At-Taubah", translation: "Pengampunan", verses: 129 },
        { number: 10, name: "يونس", latin: "Yunus", translation: "Yunus", verses: 109 },
        { number: 11, name: "هود", latin: "Hud", translation: "Hud", verses: 123 },
        { number: 12, name: "يوسف", latin: "Yusuf", translation: "Yusuf", verses: 111 },
        { number: 13, name: "الرعد", latin: "Ar-Ra'd", translation: "Guruh", verses: 43 },
        { number: 14, name: "إبراهيم", latin: "Ibrahim", translation: "Ibrahim", verses: 52 },
        { number: 15, name: "الحجر", latin: "Al-Hijr", translation: "Bukit Batu", verses: 99 },
        { number: 16, name: "النحل", latin: "An-Nahl", translation: "Lebah", verses: 128 },
        { number: 17, name: "الإسراء", latin: "Al-Isra", translation: "Perjalanan Malam", verses: 111 },
        { number: 18, name: "الكهف", latin: "Al-Kahf", translation: "Penghuni Gua", verses: 110 },
        { number: 19, name: "مريم", latin: "Maryam", translation: "Maryam", verses: 98 },
        { number: 20, name: "طه", latin: "Taha", translation: "Taha", verses: 135 },
        { number: 21, name: "الأنبياء", latin: "Al-Anbiya", translation: "Para Nabi", verses: 112 },
        { number: 22, name: "الحج", latin: "Al-Hajj", translation: "Haji", verses: 78 },
        { number: 23, name: "المؤمنون", latin: "Al-Mu'minun", translation: "Orang-Orang Mukmin", verses: 118 },
        { number: 24, name: "النور", latin: "An-Nur", translation: "Cahaya", verses: 64 },
        { number: 25, name: "الفرقان", latin: "Al-Furqan", translation: "Pembeda", verses: 77 },
        { number: 26, name: "الشعراء", latin: "Ash-Shu'ara", translation: "Penyair", verses: 227 },
        { number: 27, name: "النمل", latin: "An-Naml", translation: "Semut", verses: 93 },
        { number: 28, name: "القصص", latin: "Al-Qasas", translation: "Kisah-Kisah", verses: 88 },
        { number: 29, name: "العنكبوت", latin: "Al-Ankabut", translation: "Laba-Laba", verses: 69 },
        { number: 30, name: "الروم", latin: "Ar-Rum", translation: "Bangsa Romawi", verses: 60 },
        { number: 31, name: "لقمان", latin: "Luqman", translation: "Luqman", verses: 34 },
        { number: 32, name: "السجدة", latin: "As-Sajdah", translation: "Sujud", verses: 30 },
        { number: 33, name: "الأحزاب", latin: "Al-Ahzab", translation: "Golongan yang Bersekutu", verses: 73 },
        { number: 34, name: "سبأ", latin: "Saba", translation: "Saba'", verses: 54 },
        { number: 35, name: "فاطر", latin: "Fatir", translation: "Pencipta", verses: 45 },
        { number: 36, name: "يس", latin: "Yasin", translation: "Yasin", verses: 83 },
        { number: 37, name: "الصافات", latin: "As-Saffat", translation: "Barisan-Barisan", verses: 182 },
        { number: 38, name: "ص", latin: "Sad", translation: "Sad", verses: 88 },
        { number: 39, name: "الزمر", latin: "Az-Zumar", translation: "Rombongan", verses: 75 },
        { number: 40, name: "غافر", latin: "Ghafir", translation: "Yang Mengampuni", verses: 85 },
        { number: 41, name: "فصلت", latin: "Fussilat", translation: "Yang Dijelaskan", verses: 54 },
        { number: 42, name: "الشورى", latin: "Ash-Shura", translation: "Musyawarah", verses: 53 },
        { number: 43, name: "الزخرف", latin: "Az-Zukhruf", translation: "Perhiasan", verses: 89 },
        { number: 44, name: "الدخان", latin: "Ad-Dukhan", translation: "Kabut", verses: 59 },
        { number: 45, name: "الجاثية", latin: "Al-Jasiyah", translation: "Yang Berlutut", verses: 37 },
        { number: 46, name: "الأحقاف", latin: "Al-Ahqaf", translation: "Bukit-Bukit Pasir", verses: 35 },
        { number: 47, name: "محمد", latin: "Muhammad", translation: "Muhammad", verses: 38 },
        { number: 48, name: "الفتح", latin: "Al-Fath", translation: "Kemenangan", verses: 29 },
        { number: 49, name: "الحجرات", latin: "Al-Hujurat", translation: "Kamar-Kamar", verses: 18 },
        { number: 50, name: "ق", latin: "Qaf", translation: "Qaf", verses: 45 },
        { number: 51, name: "الذاريات", latin: "Adh-Dhariyat", translation: "Angin yang Menerbangkan", verses: 60 },
        { number: 52, name: "الطور", latin: "At-Tur", translation: "Bukit", verses: 49 },
        { number: 53, name: "النجم", latin: "An-Najm", translation: "Bintang", verses: 62 },
        { number: 54, name: "القمر", latin: "Al-Qamar", translation: "Bulan", verses: 55 },
        { number: 55, name: "الرحمن", latin: "Ar-Rahman", translation: "Yang Maha Pengasih", verses: 78 },
        { number: 56, name: "الواقعة", latin: "Al-Waqi'ah", translation: "Hari Kiamat", verses: 96 },
        { number: 57, name: "الحديد", latin: "Al-Hadid", translation: "Besi", verses: 29 },
        { number: 58, name: "المجادلة", latin: "Al-Mujadilah", translation: "Wanita yang Mengajukan Gugatan", verses: 22 },
        { number: 59, name: "الحشر", latin: "Al-Hashr", translation: "Pengusiran", verses: 24 },
        { number: 60, name: "الممتحنة", latin: "Al-Mumtahanah", translation: "Wanita yang Diuji", verses: 13 },
        { number: 61, name: "الصف", latin: "As-Saff", translation: "Barisan", verses: 14 },
        { number: 62, name: "الجمعة", latin: "Al-Jumu'ah", translation: "Hari Jum'at", verses: 11 },
        { number: 63, name: "المنافقون", latin: "Al-Munafiqun", translation: "Orang-Orang Munafik", verses: 11 },
        { number: 64, name: "التغابن", latin: "At-Taghabun", translation: "Hari Dinampakkan Kesalahan-Kesalahan", verses: 18 },
        { number: 65, name: "الطلاق", latin: "At-Talaq", translation: "Talak", verses: 12 },
        { number: 66, name: "التحريم", latin: "At-Tahrim", translation: "Mengharamkan", verses: 12 },
        { number: 67, name: "الملك", latin: "Al-Mulk", translation: "Kerajaan", verses: 30 },
        { number: 68, name: "القلم", latin: "Al-Qalam", translation: "Pena", verses: 52 },
        { number: 69, name: "الحاقة", latin: "Al-Haqqah", translation: "Hari Kiamat", verses: 52 },
        { number: 70, name: "المعارج", latin: "Al-Ma'arij", translation: "Tempat Naik", verses: 44 },
        { number: 71, name: "نوح", latin: "Nuh", translation: "Nuh", verses: 28 },
        { number: 72, name: "الجن", latin: "Al-Jinn", translation: "Jin", verses: 28 },
        { number: 73, name: "المزمل", latin: "Al-Muzzammil", translation: "Orang yang Berselimut", verses: 20 },
        { number: 74, name: "المدثر", latin: "Al-Muddaththir", translation: "Orang yang Berkemul", verses: 56 },
        { number: 75, name: "القيامة", latin: "Al-Qiyamah", translation: "Hari Kiamat", verses: 40 },
        { number: 76, name: "الانسان", latin: "Al-Insan", translation: "Manusia", verses: 31 },
        { number: 77, name: "المرسلات", latin: "Al-Mursalat", translation: "Malaikat yang Diutus", verses: 50 },
        { number: 78, name: "النبأ", latin: "An-Naba", translation: "Berita Besar", verses: 40 },
        { number: 79, name: "النازعات", latin: "An-Nazi'at", translation: "Malaikat yang Mencabut", verses: 46 },
        { number: 80, name: "عبس", latin: "Abasa", translation: "Bermuka Masam", verses: 42 },
        { number: 81, name: "التكوير", latin: "At-Takwir", translation: "Menggulung", verses: 29 },
        { number: 82, name: "الانفطار", latin: "Al-Infitar", translation: "Terbelah", verses: 19 },
        { number: 83, name: "المطففين", latin: "Al-Mutaffifin", translation: "Orang-Orang yang Curang", verses: 36 },
        { number: 84, name: "الانشقاق", latin: "Al-Inshiqaq", translation: "Terbelah", verses: 25 },
        { number: 85, name: "البروج", latin: "Al-Buruj", translation: "Gugusan Bintang", verses: 22 },
        { number: 86, name: "الطارق", latin: "At-Tariq", translation: "Yang Datang di Malam Hari", verses: 17 },
        { number: 87, name: "الأعلى", latin: "Al-A'la", translation: "Yang Paling Tinggi", verses: 19 },
        { number: 88, name: "الغاشية", latin: "Al-Ghashiyah", translation: "Hari Pembalasan", verses: 26 },
        { number: 89, name: "الفجر", latin: "Al-Fajr", translation: "Fajar", verses: 30 },
        { number: 90, name: "البلد", latin: "Al-Balad", translation: "Negeri", verses: 20 },
        { number: 91, name: "الشمس", latin: "Ash-Shams", translation: "Matahari", verses: 15 },
        { number: 92, name: "الليل", latin: "Al-Layl", translation: "Malam", verses: 21 },
        { number: 93, name: "الضحى", latin: "Ad-Duha", translation: "Waktu Matahari Sepenggalahan Naik", verses: 11 },
        { number: 94, name: "الشرح", latin: "Ash-Sharh", translation: "Melapangkan", verses: 8 },
        { number: 95, name: "التين", latin: "At-Tin", translation: "Buah Tin", verses: 8 },
        { number: 96, name: "العلق", latin: "Al-Alaq", translation: "Segumpal Darah", verses: 19 },
        { number: 97, name: "القدر", latin: "Al-Qadr", translation: "Kemuliaan", verses: 5 },
        { number: 98, name: "البينة", latin: "Al-Bayyinah", translation: "Bukti", verses: 8 },
        { number: 99, name: "الزلزلة", latin: "Az-Zalzalah", translation: "Kegoncangan", verses: 8 },
        { number: 100, name: "العاديات", latin: "Al-Adiyat", translation: "Kuda yang Berlari Kencang", verses: 11 },
        { number: 101, name: "القارعة", latin: "Al-Qari'ah", translation: "Hari Kiamat", verses: 11 },
        { number: 102, name: "التكاثر", latin: "At-Takathur", translation: "Bermegah-Megahan", verses: 8 },
        { number: 103, name: "العصر", latin: "Al-Asr", translation: "Masa", verses: 3 },
        { number: 104, name: "الهمزة", latin: "Al-Humazah", translation: "Pengumpat", verses: 9 },
        { number: 105, name: "الفيل", latin: "Al-Fil", translation: "Gajah", verses: 5 },
        { number: 106, name: "قريش", latin: "Quraish", translation: "Quraisy", verses: 4 },
        { number: 107, name: "الماعون", latin: "Al-Ma'un", translation: "Barang-Barang yang Berguna", verses: 7 },
        { number: 108, name: "الكوثر", latin: "Al-Kawthar", translation: "Nikmat yang Berlimpah", verses: 3 },
        { number: 109, name: "الكافرون", latin: "Al-Kafirun", translation: "Orang-Orang Kafir", verses: 6 },
        { number: 110, name: "النصر", latin: "An-Nasr", translation: "Pertolongan", verses: 3 },
        { number: 111, name: "المسد", latin: "Al-Masad", translation: "Gejolak Api", verses: 5 },
        { number: 112, name: "الإخلاص", latin: "Al-Ikhlas", translation: "Ikhlas", verses: 4 },
        { number: 113, name: "الفلق", latin: "Al-Falaq", translation: "Waktu Subuh", verses: 5 },
        { number: 114, name: "الناس", latin: "An-Nas", translation: "Manusia", verses: 6 }
    ];

    // 🔹 Data Juz 1–30
    const juz = Array.from({ length: 30 }, (_, i) => ({
        number: i + 1,
        name: `Juz ${i + 1}`,
    }));

    return (
        <div>
            {/* Card */}
            <button
                onClick={() => setShowModal(true)}
                className="flex flex-col items-center justify-center h-32 w-full p-3 text-center transition bg-white border border-[#e5e9f0] rounded-xl shadow-sm hover:shadow-md"
            >
                <div className="flex items-center justify-center w-10 h-10 p-1 bg-[#fcfeff] border border-[#e5e9f0] rounded-lg">
                    <i className="text-lg text-[#355485] ri-link-m"></i>
                </div>
                <h3 className="mt-2 text-sm font-medium text-[#355485]">Sambung Ayat</h3>
                <p className="mt-0 text-xs text-[#6d9bbc]">Mulai Game</p>
            </button>

            {/* Bottom Sheet */}
            {showModal && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-lg max-h-[75vh] overflow-hidden max-w-xl mx-auto">
                        {/* Header */}
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">
                                Pilih Surah atau Juz
                            </h3>
                            <button onClick={() => setShowModal(false)}>
                                <i className="ri-close-line text-xl text-gray-500"></i>
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b">
                            <button
                                onClick={() => setActiveTab("surah")}
                                className={`flex-1 py-2 font-medium text-sm ${activeTab === "surah"
                                        ? "border-b-2 border-[#355485] text-[#355485]"
                                        : "text-gray-500"
                                    }`}
                            >
                                Surah
                            </button>
                            <button
                                onClick={() => setActiveTab("juz")}
                                className={`flex-1 py-2 font-medium text-sm ${activeTab === "juz"
                                        ? "border-b-2 border-[#355485] text-[#355485]"
                                        : "text-gray-500"
                                    }`}
                            >
                                Juz
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-[60vh] p-3">
                            {activeTab === "surah" ? (
                                <div className="space-y-2">
                                    {surahs.map((s) => (
                                        <Link
                                            key={s.number}
                                            to={`/game/sambung-ayat/surah/${s.number}`}
                                            className="flex items-center justify-between px-4 py-2 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                                            onClick={() => setShowModal(false)}
                                        >
                                            <div>
                                                <h3 className="text-sm font-mushaf font-medium text-gray-800">
                                                    {s.number}. {s.name}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    {s.latin} - {s.translation} ({s.verses} ayat)
                                                </p>
                                            </div>
                                            <i className="ri-arrow-right-s-line text-gray-400"></i>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    {juz.map((j) => (
                                        <Link
                                            key={j.number}
                                            to={`/game/sambung-ayat/juz/${j.number}`}
                                            className="px-4 py-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition text-sm font-medium text-gray-800 text-center"
                                            onClick={() => setShowModal(false)}
                                        >
                                            {j.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default SambungAyat;

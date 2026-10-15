import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../../components/BottomNav";

export default function SelfDev() {
    const todayKey = new Date().toLocaleDateString("id-ID");

    // Habit Tracker
    const [habits, setHabits] = useState(() => {
        const saved = localStorage.getItem("habits");
        return saved
            ? JSON.parse(saved)
            : { sholat: false, dzikir: false, quran: false, sedekah: false };
    });

    const [weeklyStats, setWeeklyStats] = useState(() => {
        const saved = localStorage.getItem("weeklyStats");
        return saved ? JSON.parse(saved) : {};
    });

    // Journal Syukur
    const [journal, setJournal] = useState("");
    const [savedJournal, setSavedJournal] = useState(localStorage.getItem("journal") || "");


    // Mood Tracker
    const [moods, setMoods] = useState(() => {
        const saved = localStorage.getItem("moods");
        return saved ? JSON.parse(saved) : {};
    });

    const motivasiList = [
        "“Jangan bersedih, Allah selalu bersama kita.” (QS. At-Taubah: 40)",
        "“Barangsiapa bertakwa kepada Allah, niscaya Dia akan memberikan jalan keluar.” (QS. At-Talaq: 2)",
        "“Sesungguhnya setelah kesulitan ada kemudahan.” (QS. Al-Insyirah: 6)",
        "“Allah tidak membebani seseorang melainkan sesuai kesanggupannya.” (QS. Al-Baqarah: 286)",
        "“Dekatkan diri pada Allah, maka hatimu akan tenang.”",
    ];
    const [randomMotivasi, setRandomMotivasi] = useState("");

    useEffect(() => {
        setRandomMotivasi(
            motivasiList[Math.floor(Math.random() * motivasiList.length)]
        );
    }, []);

    // Save habits
    useEffect(() => {
        localStorage.setItem("habits", JSON.stringify(habits));
        // update statistik mingguan
        setWeeklyStats((prev) => {
            const updated = { ...prev, [todayKey]: habits };
            localStorage.setItem("weeklyStats", JSON.stringify(updated));
            return updated;
        });
    }, [habits]);

    // Toggle habit
    const toggleHabit = (key) => {
        setHabits((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // Journal
    const handleSaveJournal = () => {
        if (!journal.trim()) return;
        localStorage.setItem("journal", journal);
        setSavedJournal(journal);
        setJournal("");
    };

    // Mood
    const handleMood = (emoji) => {
        const updated = { ...moods, [todayKey]: emoji };
        setMoods(updated);
        localStorage.setItem("moods", JSON.stringify(updated));
    };

    // Progress
    const totalHabits = Object.keys(habits).length;
    const completedHabits = Object.values(habits).filter(Boolean).length;
    const progressPercent = Math.round((completedHabits / totalHabits) * 100);

    return (
        <div className="min-h-screen pb-10 bg-gray-50">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
                <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-4">
                    <Link
                        to="/"
                        className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]"
                    >
                        <i className="ri-arrow-left-line"></i> SelfDev
                    </Link>
                    <button className="text-[#355485]">
                        <i className="ri-settings-5-line text-xl"></i>
                    </button>
                </div>
            </div>

            {/* Isi konten */}
            <div className="max-w-xl mx-auto px-3 border-x border-gray-200 pt-[60px] space-y-5">

                {/* Habit Tracker */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h2 className="font-semibold text-[#355485] mb-3">Habit Tracker</h2>
                    <div className="space-y-2">
                        {Object.keys(habits).map((key) => (
                            <label
                                key={key}
                                className="flex items-center justify-between px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                            >
                                <span className="capitalize">
                                    {key === "sholat" && "Shalat 5 Waktu"}
                                    {key === "dzikir" && "Dzikir Pagi & Petang"}
                                    {key === "quran" && "Baca Qur’an"}
                                    {key === "sedekah" && "Sedekah"}
                                </span>
                                <input
                                    type="checkbox"
                                    checked={habits[key]}
                                    onChange={() => toggleHabit(key)}
                                    className="w-5 h-5 accent-[#355485]"
                                />
                            </label>
                        ))}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-[#355485] h-2 rounded-full transition-all"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Progress Ibadah: {progressPercent}%
                        </p>
                    </div>
                </div>

                {/* Mood Tracker */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h2 className="font-semibold text-[#355485] mb-3">Mood Hari Ini</h2>
                    <div className="flex gap-3 text-2xl mb-2">
                        {["😊", "😐", "😔", "🥹", "😭", "🥳", "😡"].map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => handleMood(emoji)}
                                className="hover:scale-110 transition"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                    {moods[todayKey] && (
                        <p className="text-sm text-gray-600">Mood hari ini: {moods[todayKey]}</p>
                    )}
                </div>

                {/* Journal Syukur */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h2 className="font-semibold text-[#355485] mb-3">Journal Syukur</h2>
                    <textarea
                        placeholder="Hari ini aku bersyukur atas..."
                        value={journal}
                        onChange={(e) => setJournal(e.target.value)}
                        className="w-full p-2 border rounded-lg text-sm mb-2"
                        rows={3}
                    />
                    <button
                        onClick={handleSaveJournal}
                        className="px-4 py-2 bg-[#355485] text-white rounded-lg text-sm"
                    >
                        Simpan
                    </button>
                    {savedJournal && (
                        <p className="mt-2 text-sm text-gray-600 italic">
                            Terakhir disimpan: "{savedJournal}"
                        </p>
                    )}
                </div>

                {/* Motivasi Harian */}
                <div className="bg-gradient-to-r from-[#355485] to-[#4f90c6] rounded-xl shadow-sm p-4 text-white">
                    <h2 className="font-semibold mb-2">💡 Motivasi Harian</h2>
                    <p className="text-sm leading-relaxed">{randomMotivasi}</p>
                </div>

                {/* Video Motivasi Islami */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h2 className="font-semibold text-[#355485] mb-3">🎥 Motivasi Islami</h2>
                    <video
                        controls
                        className="w-full rounded-lg shadow"
                        src="https://res.cloudinary.com/dbssvz2pe/video/upload/v1756547203/Video-171_liyqnx.mp4"
                    />
                </div>
            </div>\
            <BottomNav />
        </div>
    );
}

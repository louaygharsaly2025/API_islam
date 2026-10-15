import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Helper format tanggal
function formatTanggal(timestamp, short = false) {
    const date = new Date(timestamp);

    const bulanMapPendek = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    const bulanMapPanjang = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const hari = date.getDate();
    const bulan = short ? bulanMapPendek[date.getMonth()] : bulanMapPanjang[date.getMonth()];
    const tahun = date.getFullYear();

    const jam = date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    });

    return `${hari} ${bulan} ${tahun} • ${jam}`;
}

function Bookmark() {
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        const savedBookmarks = JSON.parse(localStorage.getItem("quran-bookmarks")) || [];
        setBookmarks(savedBookmarks);
    }, []);

    const removeBookmark = (surahId) => {
        const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.surahId !== surahId);
        setBookmarks(updatedBookmarks);
        localStorage.setItem("quran-bookmarks", JSON.stringify(updatedBookmarks));
    };

    return (
        <div className="min-h-screen bg-[#fcfeff]">
            <div className="max-w-xl mx-auto px-2 py-3 mb-[60px">
                {/* Empty state */}
                {bookmarks.length === 0 ? (
                    <div className="text-center py-14">
                        <i className="ri-bookmark-line text-5xl text-[#cbdde9] mb-4"></i>
                        <p className="text-[#6d9bbc] mb-4">Belum ada surah yang di-bookmark</p>
                        <Link
                            to="/quran"
                            className="px-4 py-2 bg-[#355485] text-white rounded-lg shadow hover:bg-[#4f90c6] transition"
                        >
                            Jelajahi Surah
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {bookmarks.map((bookmark, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 rounded-xl shadow-sm border border-gray-200 bg-[#fcfeff]"
                            >
                                {/* Left: icon + info surah */}
                                <Link to={`/quran/surah/${bookmark.surahId}`} className="flex items-center flex-1 gap-3">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#cbdde9]">
                                        <i className="ri-book-open-line text-[#355485] text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#355485]">
                                            {bookmark.surahName}
                                            <span className="text-[#6d9bbc] ml-1 font-mushaf ">
                                                ({bookmark.surahNameArabic})
                                            </span>
                                        </h3>
                                        <p className="text-xs text-[#6d9bbc] mt-0.5">
                                            {bookmark.totalVerses} ayat • {formatTanggal(bookmark.timestamp, true)}
                                        </p>
                                    </div>
                                </Link>

                                {/* Right: remove button */}
                                <button
                                    onClick={() => removeBookmark(bookmark.surahId)}
                                    className="ml-3 text-red-500 p-2 transition"
                                >
                                    <i className="ri-delete-bin-5-line text-lg"></i>
                                </button>
                            </div>
                        ))}
                    </div>

                )}
            </div>
        </div>
    );
}

export default Bookmark;

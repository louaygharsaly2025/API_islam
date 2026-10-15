import React from "react";
import { Link } from "react-router-dom";

export default function PerHalamanList() {
    const juzList = Array.from({ length: 30 }, (_, i) => i + 1); // [1,2,...30]

    return (
        <div className="min-h-screen bg-gray-50 pb-6">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
                <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-3">
                    <Link
                        to="/quran"
                        className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]"
                    >
                        <i className="ri-arrow-left-line"></i> Quran Per Halaman
                    </Link>
                    <Link to="/settings">
                        <button className="text-[#355485] hover:text-[#4f90c6] transition">
                            <i className="ri-settings-5-line text-xl"></i>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Isi konten */}
            <div className="max-w-xl mx-auto px-4 border-x border-gray-200 pt-[70px]">
                <h1 className="text-xl font-bold text-[#355485] mb-4">
                    Daftar Juz Al-Qur'an
                </h1>

                {/* Grid Juz */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {juzList.map((juz) => (
                        <Link
                            key={juz}
                            to={`/quran/perhalaman/juz/${juz}`}
                            className="rounded-xl bg-white border border-[#d7e3ec] shadow-sm hover:shadow-md transition p-4 text-center group"
                        >
                            <p className="text-lg font-bold text-[#355485] group-hover:text-[#4f90c6]">
                                Juz {juz}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Klik untuk baca</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

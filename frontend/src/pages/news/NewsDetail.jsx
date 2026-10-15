import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function NewsDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { item } = location.state || {};

    if (!item) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Data tidak ditemukan
            </div>
        );
    }

    // Fungsi helper buat render konten
    const renderContent = (content) => {
        if (!content) return null;

        // Kalau konten berupa array -> render per paragraf
        if (Array.isArray(content)) {
            return content.map((p, i) => (
                <p key={i} className="mb-4 text-gray-700 leading-relaxed text-justify">
                    {p}
                </p>
            ));
        }

        // Kalau konten string dengan line break -> split jadi paragraf
        if (typeof content === "string" && content.includes("\n")) {
            return content.split(/\n\s*\n/).map((p, i) => (
                <p key={i} className="mb-4 text-gray-700 leading-relaxed text-justify">
                    {p}
                </p>
            ));
        }

        // Default render biasa
        return (
            <p className="text-gray-700 leading-relaxed text-justify">
                {content}
            </p>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-xl mx-auto flex items-center gap-3 px-4 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-700 flex items-center"
                    >
                        <i className="ri-arrow-left-s-line text-xl mr-1"></i>
                        <span className="font-medium text-gray-800 text-[15px]">Kembali</span>
                    </button>
                </div>
            </div>

            {/* Konten */}
            <div className="max-w-xl mx-auto px-4 pt-[70px]">
                {item.thumbnail && (
                    <img
                        src={item.thumbnail}
                        alt="thumbnail"
                        className="w-full h-56 object-cover rounded-xl mb-4 shadow-md"
                    />
                )}

                {item.tag && (
                    <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-[#cbdde9] text-[#355485] text-xs font-medium rounded-full">
                            {item.tag}
                        </span>
                    </div>
                )}

                <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {item.title}
                </h2>

                <div className="flex items-center text-xs text-[#6d9bbc] mb-5">
                    <i className="ri-calendar-event-line mr-1"></i>
                    <span>
                        {new Date(item.pubDate).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                </div>

                <div className="px-0.5 mb-4">
                    {renderContent(item.content || item.description)}
                </div>

                {/* Tombol aksi */}
                <div className="flex justify-between items-center mt-6">
                    <button className="flex items-center text-sm text-[#355485]">
                        <i className="ri-heart-line mr-1"></i>
                        Simpan
                    </button>
                    <button className="flex items-center text-sm text-[#355485]">
                        <i className="ri-share-line mr-1"></i>
                        Bagikan
                    </button>
                </div>
            </div>
        </div>
    );
}

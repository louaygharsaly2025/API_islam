import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function NewsList() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch("/data/news.json");
                const data = await res.json();
                if (data.success && data.data?.posts) {
                    setNews(data.data.posts);
                }
            } catch (err) {
                console.error("Gagal fetch berita:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return (
        <div className="min-h-screen pb-2 bg-gray-50">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
                <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-4">
                    <Link
                        to="/"
                        className="flex items-center font-semibold gap-2 text-gray-800 text-[15px]"
                    >
                        <i className="ri-arrow-left-line"></i> News Islamic
                    </Link>
                    <button className="text-gray-600 hover:text-gray-800">
                        <i className="ri-settings-5-line text-xl"></i>
                    </button>
                </div>
            </div>

            {/* Isi konten */}
            <div className="max-w-xl mx-auto px-3 border-x border-gray-200 pt-[70px]">
                {loading && (
                    <p className="text-center text-gray-500 py-6">Memuat berita...</p>
                )}

                {!loading && news.length === 0 && (
                    <p className="text-center text-gray-500 py-6">
                        Tidak ada berita tersedia
                    </p>
                )}

                {news.map((item, i) => (
                    <Link
                        key={i}
                        to={`/news/${i}`}
                        state={{ item }}
                        className="flex items-center bg-white shadow-sm border-y border-gray-200 py-3 mb-3"
                    >
                        {/* Kiri */}
                        <div className="flex-1 px-2">
                            <span className="inline-block px-2 py-0.5 bg-[#cbdde9] text-[#355485] text-[11px] font-medium rounded mb-2">
                                {item.tag}
                            </span>
                            <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-1 line-clamp-2">
                                {item.title}
                            </h3>
                            <p className="text-xs text-[#6d9bbc]">
                                {new Date(item.pubDate).toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>

                        {/* Kanan: thumbnail */}
                        {item.thumbnail && (
                            <div className="w-[80px] h-[80px] flex-shrink-0 mr-2">
                                <img
                                    src={item.thumbnail}
                                    alt="thumbnail"
                                    className="w-full h-full object-cover rounded-md"
                                />
                            </div>
                        )}
                    </Link>

                ))}
            </div>
        </div>
    );
}

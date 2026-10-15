import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/data/news.json");
        const data = await res.json();
        if (data.success && data.data?.posts) {
          setNews(data.data.posts.slice(0, 3)); // ambil cuma 5 berita
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
    <div>
      {/* News Islamic */}
      <div className="px-4 pt-2">
        <div className="flex justify-between items-center mb-1">
          <h2 className="font-semibold text-[#355485]">News Islamic</h2>
          <Link to="/news">
            <i className="ri-arrow-right-s-line text-xl text-[#6d9bbc]"></i>
          </Link>
        </div>

        {loading && (
          <p className="text-center text-sm text-gray-500 py-4">Memuat berita...</p>
        )}

        {!loading &&
          news.map((item, i) => (
            <Link
              key={i}
              to={`/news/${i}`}
              state={{ item }}
              className="flex items-center bg-white shadow-sm border-y border-gray-200 py-3 mb-2"
            >
              {/* Kiri: tag + title + date */}
              <div className="flex-1 px-1">
                <span className="inline-block px-2 py-0.5 bg-[#cbdde9] text-[#355485] text-[11px] font-medium rounded mb-2">
                  {item.tag}
                </span>
                <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-1 line-clamp-2 mr-2">
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
                <div className="w-[75px] h-[75px] flex-shrink-0 mr-1">
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

export default NewsSection;

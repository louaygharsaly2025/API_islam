import React, { useState } from "react";
import { Link } from "react-router-dom";

function FeatureGrid() {
  const [showMore, setShowMore] = useState(false);

  // Fitur utama (sering dipakai)
  const mainMenus = [
    { label: "Al-Quran", icon: "ri-book-2-line", link: "/quran" },
    { label: "Game", icon: "ri-gamepad-line", link: "/game" },
    { label: "SelvDef", icon: "ri-service-line", link: "/selfdev" },
    { label: "Jadwal Sholat", icon: "ri-time-line", link: "/jadwal-sholat" },
    { label: "Tasbih", icon: "ri-heart-2-line", link: "/tasbih" },
    { label: "Dzikir", icon: "ri-heart-pulse-line", link: "/dzikir" },
    { label: "Quotes", icon: "ri-chat-quote-line", link: "/quotes" },
    { label: "More", icon: "ri-apps-line", action: () => setShowMore(true) },
  ];

  // Kategori (muncul di modal More)
  const categories = [
    {
      label: "Ibadah & Spiritualitas",
      icon: "ri-moon-clear-line",
      link: "/fitur/ibadah",
      sub: ["Puasa Sunnah", "Kiblat", "Kajian", "Shalat Dhuha Tracker"],
    },
    {
      label: "Edukasi Islami",
      icon: "ri-book-open-line",
      link: "/fitur/edukasi",
      sub: ["Hadits", "Asmaul Husna", "Sejarah Islam", "Doa Harian"],
    },
    {
      label: "Amal & Kebaikan",
      icon: "ri-hand-coin-line",
      link: "/fitur/amal",
      sub: ["Shadaqah Tracker", "Catatan Amal", "Infaq Harian"],
    },
    {
      label: "Self Development",
      icon: "ri-lightbulb-line",
      link: "/fitur/selfdev",
      sub: ["Habit Tracker", "Motivasi Harian", "Catatan Pribadi"],
    },
    {
      label: "Gaya Hidup",
      icon: "ri-calendar-line",
      link: "/fitur/lifestyle",
      sub: ["Kalender Hijriah", "Agenda Islami", "Checklist Aktivitas"],
    },
    {
      label: "Perpustakaan",
      icon: "ri-book-shelf-line",
      link: "/library",
      sub: ["Kumpulan Buku", "Artikel Islami", "Tafsir & Tafsir Modern"],
    },
    {
      label: "Keluarga",
      icon: "ri-group-line",
      link: "/fitur/keluarga",
      sub: ["Parenting Islami", "Doa untuk Anak", "Kisah Keluarga Muslim"],
    },
    {
      label: "Kesehatan",
      icon: "ri-health-book-line",
      link: "/fitur/kesehatan",
      sub: ["Tips Sehat Islami", "Olahraga Sunnah", "Pola Makan Halal"],
    },
    {
      label: "Keuangan",
      icon: "ri-wallet-3-line",
      link: "/fitur/keuangan",
      sub: ["Catatan Keuangan", "Zakat", "Rencana Infaq"],
    },
    {
      label: "Komunitas",
      icon: "ri-community-line",
      link: "/fitur/komunitas",
      sub: ["Forum Muslim", "Event Kajian", "Berbagi Doa"],
    },
  ];

  return (
    <div className="px-2">
      {/* Grid fitur utama */}
      <div className="grid grid-cols-4 gap-3 py-2">
        {mainMenus.map((m, i) =>
          m.action ? (
            <button
              key={i}
              onClick={m.action}
              className="flex flex-col items-center text-center hover:opacity-80 transition"
            >
              <div className="w-[55px] h-[55px] flex items-center justify-center rounded-[13px] bg-[#f0f1f2]">
                <i className={`${m.icon} text-[22px] text-[#355485]`} />
              </div>
              <p className="text-xs mt-1 text-[#44515f]">{m.label}</p>
            </button>
          ) : (
            <Link
              key={i}
              to={m.link}
              className="flex flex-col items-center text-center hover:opacity-80 transition"
            >
              <div className="w-[55px] h-[55px] flex items-center justify-center rounded-[13px] bg-[#f0f1f2]">
                <i className={`${m.icon} text-[22px] text-[#355485]`} />
              </div>
              <p className="text-xs mt-1 text-[#44515f]">{m.label}</p>
            </Link>
          )
        )}
      </div>

      {/* Modal More */}
      {showMore && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setShowMore(false)}
          />
          <div className="fixed mb-[50px] bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-xl max-h-[70vh] overflow-y-auto max-w-xl mx-auto">
            {/* Header Modal */}
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Kategori Fitur</h3>
              <button onClick={() => setShowMore(false)}>
                <i className="ri-close-line text-xl text-gray-500"></i>
              </button>
            </div>

            {/* Grid kategori */}
            <div className="grid grid-cols-5 mb-3 gap-4 p-4">
              {categories.map((cat, i) => (
                <Link
                  key={i}
                  to={cat.link}
                  className="flex flex-col items-center text-center hover:opacity-80 transition"
                >
                  <div className="w-[55px] h-[55px] flex items-center justify-center rounded-[13px] bg-[#f0f1f2]">
                    <i className={`${cat.icon} text-[22px] text-[#355485]`} />
                  </div>
                  <p className="text-xs mt-1 text-[#44515f] font-medium text-center">
                    {cat.label}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default FeatureGrid;

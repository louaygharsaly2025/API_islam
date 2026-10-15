import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../../components/BottomNav";
import Donate from "../../components/Donate";

export default function DzikirPage() {
  useEffect(() => {
    document.title = "Dzikir - Islamic";
  }, []);

  const now = new Date();
  const hour = now.getHours();

  let recommended = {
    title: "Dzikir Harian",
    desc: "Dzikir kapan saja, di mana saja",
    icon: "ri-heart-pulse-line",
    color: "text-white",
    to: "/dzikir/harian",
    bg: "bg-[#355485]",
  };

  if (hour >= 4 && hour < 10) {
    recommended = {
      title: "Dzikir Pagi",
      desc: "Subhanallah, Alhamdulillah, Allahu Akbar 33x",
      icon: "ri-sun-line",
      color: "text-yellow-300",
      to: "/dzikir/almasurat/pagi",
      bg: "bg-gradient-to-r from-[#355485] to-[#4f90c6]",
    };
  } else if (hour >= 16 && hour < 20) {
    recommended = {
      title: "Dzikir Sore",
      desc: "Dzikir menjelang malam, penuh berkah",
      icon: "ri-moon-line",
      color: "text-indigo-300",
      to: "/dzikir/almasurat/petang",
      bg: "bg-gradient-to-r from-[#4f90c6] to-[#6d9bbc]",
    };
  }

  return (
    <div className="min-h-screen pb-[60px] bg-[#fcfeff]">
      <div className="max-w-xl mx-auto px-3 border-x border-gray-200">
        {/* HEADER */}
        <div className="fixed top-0 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 border-b border-gray-200 bg-white px-3 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-[15px] font-semibold text-[#355485]"
            >
              <i className="ri-arrow-left-line"></i>
              Dzikir
            </Link>
            <button className="text-gray-600 hover:text-gray-800">
              <i className="ri-settings-5-line text-xl"></i>
            </button>
          </div>
        </div>

        <div className="pt-[70px] space-y-3">
          <section className="my-4 px-3">
            <p className="font-mushaf text-xl text-[#355485] text-center leading-relaxed">
              مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لاَ يَذْكُرُهُ مَثَلُ الحَيِّ وَالمَيِّتِ
            </p>
            <p className="mt-3 text-[14px] text-[#355485] text-center">
              “Perumpamaan orang yang berdzikir (mengingat) Rabbnya dan yang tidak bagaikan orang yang hidup dan orang yang mati.”
            </p>
          </section>
          <hr />
          <section className="px-2">
            <h2 className="text-lg font-semibold text-[#355485] mb-3">
              ✨ Rekomendasi Waktu Ini
            </h2>
            <Link
              to={recommended.to}
              className={`flex items-center p-5 rounded-2xl shadow-md text-white ${recommended.bg}`}
            >
              <div className={`text-4xl ${recommended.color} flex-shrink-0`}>
                <i className={recommended.icon}></i>
              </div>
              <div className="ml-4 text-left">
                <h3 className="text-base font-semibold">{recommended.title}</h3>
                <p className="text-sm opacity-90 mt-0.5">{recommended.desc}</p>
              </div>
              <i className="ri-arrow-right-s-line text-xl ml-auto text-white/70"></i>
            </Link>
          </section>

          {/* === MENU DZIKIR === */}
          <section className="px-2">
            <h2 className="text-lg font-semibold text-[#355485] mb-4">
              📿 Pilihan Dzikir
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  title: "Al-Ma'surat",
                  desc: "Dzikir waktu pagi & waktu petang",
                  icon: "ri-time-line",
                  color: "text-purple-500",
                  bg: "bg-[#f0f1f2]",
                  to: "/dzikir/almasurat",
                },
                {
                  title: "Setelah Shalat",
                  desc: "Dzikir rutin selesai shalat",
                  icon: "ri-sun-line",
                  color: "text-yellow-500",
                  bg: "bg-[#f0f1f2]",
                  to: "/dzikir/setelah-shalat",
                },
                {
                  title: "Sebelum Tidur",
                  desc: "Dzikir malam & doa tidur",
                  icon: "ri-moon-line",
                  color: "text-blue-500",
                  bg: "bg-[#f0f1f2]",
                  to: "/dzikir/sebelum-tidur",
                },
                {
                  title: "Dzikir Harian",
                  desc: "Bisa kapan saja, di mana saja",
                  icon: "ri-heart-pulse-line",
                  color: "text-teal-500",
                  bg: "bg-[#f0f1f2]",
                  to: "/dzikir/harian",
                },
                {
                  title: "Istighfar",
                  desc: "Memohon ampunan Allah",
                  icon: "ri-refresh-line",
                  color: "text-emerald-500",
                  bg: "bg-[#f0f1f2]",
                  to: "/dzikir/istighfar",
                },
                {
                  title: "Saat Aktivitas",
                  desc: "Ketika makan, masuk rumah, dll",
                  icon: "ri-hand-heart-line",
                  color: "text-pink-500",
                  bg: "bg-[#f0f1f2]",
                  to: "/dzikir/aktivitas",
                },
              ].map((dz, i) => (
                <Link
                  key={i}
                  to={dz.to}
                  className={`p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition text-center ${dz.bg}`}
                >
                  <div className={`text-3xl ${dz.color} mb-2`}>
                    <i className={dz.icon}></i>
                  </div>
                  <h3 className="text-sm font-semibold text-[#44515f] mb-0.5">
                    {dz.title}
                  </h3>
                  <p className="text-xs text-[#6d9bbc]">{dz.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="px-4">
          </section>
        </div>
      </div>
      <BottomNav/>
    </div>
  );
}

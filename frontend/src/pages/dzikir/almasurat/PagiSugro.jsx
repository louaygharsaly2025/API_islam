import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function DzikirPagiSugro() {
  const [dzikirData, setDzikirData] = useState([]);

  // 🔹 State untuk Settings
  const [showSettings, setShowSettings] = useState(false);
  const [hideTranslation, setHideTranslation] = useState(false);
  const [arabicFontSize, setArabicFontSize] = useState("text-[20px]");
  const [transFontSize, setTransFontSize] = useState("text-[15px]");

  useEffect(() => {
    fetch("/data/dzikir/dzikir-sugro-pagi.json")
      .then((response) => response.json())
      .then((data) => setDzikirData(data))
      .catch((error) => console.error("Error fetching data:", error));
      
  }, []);

  if (dzikirData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfeff]">
        <div className="text-center">
          <i className="ri-loader-2-line animate-spin text-3xl text-[#6d9bbc]"></i>
          <p className="mt-2 text-[#6d9bbc] font-medium">Memuat data dzikir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfeff]">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
        <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-4">
          <Link
            to="/dzikir/almasurat"
            className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]"
          >
            <i className="ri-arrow-left-line"></i> Dzikir Pagi
          </Link>
          <button
            className="text-[#355485]"
            onClick={() => setShowSettings(true)}
          >
            <i className="ri-settings-5-line text-xl"></i>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-4 pt-[75px] pb-2">
        {/* Header Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#355485] mb-1">
            Dzikir Pagi Sugro
          </h1>
          <p className="text-sm text-[#6d9bbc] flex justify-center items-center gap-1">
            <i className="ri-sun-line"></i> Al-Ma&apos;surat
          </p>
        </div>

        {/* Dzikir List */}
        <div className="space-y-3">
          {dzikirData.map((dzikir) => (
            <div
              key={dzikir.id}
              className=" px-2 shadow-sm border-b border-[#e5e9f0]"
            >
              <h2 className="text-lg font-semibold text-[#355485] mb-3 text-center">
                {dzikir.title}
              </h2>
              <div className="text-center">
                {/* Core (Arab) */}
                <p
                  className={`${arabicFontSize} leading-[2.5rem] mb-4 text-gray-800 font-mushaf`}
                >
                  {dzikir.core}
                </p>

                {/* Translation (opsional ditampilkan) */}
                {!hideTranslation && (
                  <p
                    className={`${transFontSize} text-justify text-[#44515f] mb-3`}
                  >
                    {dzikir.terjemah}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⚙️ Bottom Sheet Settings */}
      {showSettings && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowSettings(false)}
          ></div>
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl z-50 max-w-xl mx-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#355485] text-lg">
                Pengaturan Dzikir
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            {/* Toggle hide translation */}
            <div className="mb-6 flex items-center justify-between">
              <span className="text-gray-700">Sembunyikan Terjemah</span>
              <button
                onClick={() => setHideTranslation(!hideTranslation)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${hideTranslation ? "bg-[#355485]" : "bg-gray-300"
                  }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${hideTranslation ? "translate-x-6" : "translate-x-0"
                    }`}
                ></div>
              </button>
            </div>

            {/* Font size Arabic */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Ukuran Font Arab
              </label>
              <select
                value={arabicFontSize}
                onChange={(e) => setArabicFontSize(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="text-[18px]">Kecil</option>
                <option value="text-[20px]">Sedang</option>
                <option value="text-[24px]">Besar</option>
              </select>
            </div>

            {/* Font size translation */}
            <div>
              <label className="block text-gray-700 mb-2">
                Ukuran Font Terjemah
              </label>
              <select
                value={transFontSize}
                onChange={(e) => setTransFontSize(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="text-[13px]">Kecil</option>
                <option value="text-[15px]">Sedang</option>
                <option value="text-[17px]">Besar</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

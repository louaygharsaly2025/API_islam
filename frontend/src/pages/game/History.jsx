import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function History() {
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem("gameHistory")) || [];
    setHistory(savedHistory);
  };

  const handleDelete = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    localStorage.setItem("gameHistory", JSON.stringify(newHistory));
    setHistory(newHistory);
    setShowModal(false);
    setActiveIndex(null);
  };

  const getJuzNumber = (rec) => {
    if (!rec) return null;
    if (rec.juzNumber != null) return rec.juzNumber;
    if (typeof rec.juz === "string") {
      const m = rec.juz.match(/\d+/);
      if (m) return Number(m[0]);
    }
    return null;
  };

  return (
    <div className="pb-6 bg-[#fcfeff] min-h-screen">
      {history.length === 0 ? (
        <div className="text-center py-12 text-[#6d9bbc]">
          <i className="ri-time-line text-5xl mb-3"></i>
          <p className="text-sm">Belum ada riwayat permainan</p>
          <Link
            to="/juz30"
            className="inline-block mt-5 px-4 py-2 rounded-lg bg-[#355485] text-white hover:bg-[#2c456d] transition"
          >
            Main game sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((record, index) => {
            const percent = Math.round((record.score / record.total) * 100);
            const labelKanan = record?.juz
              ? record.juz
              : record?.surahName
                ? `Surah ${record.surahName}`
                : "";

            return (
              <div
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  setShowModal(true);
                }}
                className="flex items-center border border-[#e5e9f0] rounded-xl cursor-pointer transition bg-white hover:shadow-md"
              >
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-[#355485]">
                        {record.date}
                      </div>
                      <div className="text-sm text-[#6d9bbc]">
                        {record.game} {labelKanan && <span>— {labelKanan}</span>}
                      </div>
                      <div className="text-sm text-gray-500">
                        Skor: {record.score}/{record.total}
                      </div>
                    </div>
                    <div
                      className={`text-lg font-bold ${percent >= 40
                          ? "text-green-600"
                          : percent >= 20
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                    >
                      {percent}%
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className={`h-2 rounded-full ${percent >= 40
                          ? "bg-green-500"
                          : percent >= 20
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && activeIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center border border-[#e5e9f0]">
            <h3 className="text-lg font-semibold text-[#355485] mb-4">
              Aksi Riwayat
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Apa yang ingin kamu lakukan untuk riwayat ini?
            </p>

            <div className="flex gap-3 justify-center">
              {/* Hapus */}
              <button
                onClick={() => handleDelete(activeIndex)}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Hapus
              </button>

              {/* Ulangi */}
              {(() => {
                const rec = history[activeIndex];
                const juzNo = getJuzNumber(rec);
                const surahNo = rec?.surahNumber;

                if (juzNo != null) {
                  return (
                    <Link
                      to={`/game/sambung-ayat/juz/${juzNo}`}
                      className="px-4 py-2 rounded-md bg-[#355485] text-white hover:bg-[#2c456d]"
                      onClick={() => setShowModal(false)}
                    >
                      Ulangi
                    </Link>
                  );
                }

                if (surahNo != null) {
                  return (
                    <Link
                      to={`/game/sambung-ayat/surah/${surahNo}`}
                      className="px-4 py-2 rounded-md bg-[#355485] text-white hover:bg-[#2c456d]"
                      onClick={() => setShowModal(false)}
                    >
                      Ulangi
                    </Link>
                  );
                }

                return null;
              })()}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-5 text-sm text-[#6d9bbc] hover:text-[#355485]"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

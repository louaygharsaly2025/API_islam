import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function JadwalSholat() {
  const [cityId, setCityId] = useState(localStorage.getItem("cityId") || "");
  const [cityName, setCityName] = useState(localStorage.getItem("cityName") || "");
  const [today, setToday] = useState(new Date());
  const [jadwal, setJadwal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [nextPrayer, setNextPrayer] = useState("");
  const [progress, setProgress] = useState(0);
  const [circleColor, setCircleColor] = useState("#355485");

  // modal pilih kota
  const [showCityModal, setShowCityModal] = useState(false);
  const [cities, setCities] = useState([]);
  const [searchCity, setSearchCity] = useState("");

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // fetch daftar kota
  const fetchCities = async () => {
    try {
      const res = await fetch("https://api.myquran.com/v2/sholat/kota/semua");
      const json = await res.json();
      if (json.status) setCities(json.data);
    } catch (err) {
      console.error("Error fetch kota:", err);
    }
  };

  // fetch jadwal
  const fetchJadwal = async (date, id) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.myquran.com/v2/sholat/jadwal/${id}/${formatDate(date)}`
      );
      const json = await res.json();
      if (json.status) {
        setJadwal(json.data.jadwal);
        setCityName(`${json.data.lokasi}, ${json.data.daerah}`);
      }
    } catch (err) {
      console.error("Error fetch jadwal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cityId) fetchJadwal(today, cityId);
  }, [today, cityId]);

  // hitung countdown
  useEffect(() => {
    if (!jadwal) return;

    const getTimeDiff = (time) => {
      const [h, m] = time.split(":").map(Number);
      const target = new Date(today);
      target.setHours(h, m, 0, 0);

      // Jika waktu sudah lewat hari ini, set ke besok
      if (target <= new Date()) {
        target.setDate(target.getDate() + 1);
      }
      return target - new Date();
    };

    const prayerTimes = [
      { name: "Subuh", time: jadwal.subuh },
      { name: "Dzuhur", time: jadwal.dzuhur },
      { name: "Ashar", time: jadwal.ashar },
      { name: "Maghrib", time: jadwal.maghrib },
      { name: "Isya", time: jadwal.isya },
    ];

    const tick = () => {
      const now = new Date();
      let next = null;
      let minDiff = Infinity;

      // Cari waktu sholat berikutnya
      for (const prayer of prayerTimes) {
        const [h, m] = prayer.time.split(":").map(Number);
        const target = new Date(today);
        target.setHours(h, m, 0, 0);

        if (target <= now) {
          target.setDate(target.getDate() + 1);
        }

        const diff = target - now;
        if (diff < minDiff) {
          minDiff = diff;
          next = prayer;
        }
      }

      if (next) {
        const diff = minDiff;
        const hours = Math.floor(diff / 1000 / 3600);
        const minutes = Math.floor((diff / 1000 % 3600) / 60);
        const seconds = Math.floor(diff / 1000 % 60);

        setTimeLeft(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}:${String(seconds).padStart(2, "0")}`
        );
        setNextPrayer(next.name);

        // Hitung progress dan warna
        const [h, m] = next.time.split(":").map(Number);
        const targetTime = new Date(today);
        targetTime.setHours(h, m, 0, 0);

        if (targetTime <= now) {
          targetTime.setDate(targetTime.getDate() + 1);
        }

        // Cari waktu sholat sebelumnya
        let prevPrayer = null;
        const currentIndex = prayerTimes.findIndex(p => p.name === next.name);
        if (currentIndex > 0) {
          prevPrayer = prayerTimes[currentIndex - 1];
        } else {
          // Jika subuh, maka waktu sebelumnya adalah isya kemarin
          const [prevH, prevM] = prayerTimes[4].time.split(":").map(Number);
          prevPrayer = {
            name: "Isya",
            time: prayerTimes[4].time
          };
        }

        const [prevH, prevM] = prevPrayer.time.split(":").map(Number);
        const prevTime = new Date(today);
        prevTime.setHours(prevH, prevM, 0, 0);

        if (next.name === "Subuh" && prevPrayer.name === "Isya") {
          prevTime.setDate(prevTime.getDate() - 1);
        }

        const totalDuration = targetTime - prevTime;
        const elapsed = now - prevTime;
        const progressPercent = Math.min(100, (elapsed / totalDuration) * 100);
        setProgress(progressPercent);

        // Set warna berdasarkan waktu tersisa
        if (diff < 10 * 60 * 1000) { // < 10 menit
          setCircleColor("#ef4444");
        } else if (diff < 30 * 60 * 1000) { // < 30 menit
          setCircleColor("#f97316");
        } else {
          setCircleColor("#355485");
        }
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [jadwal, today]);

  // next / prev hari
  const changeDay = (offset) => {
    const newDate = new Date(today);
    newDate.setDate(today.getDate() + offset);
    setToday(newDate);
  };

  // pilih kota
  const selectCity = (city) => {
    setCityId(city.id);
    setCityName(city.lokasi);
    localStorage.setItem("cityId", city.id);
    localStorage.setItem("cityName", city.lokasi);
    setShowCityModal(false);
  };

  return (
    <div className="min-h-screen bg-[#fcfeff]">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
        <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-4">
          <Link
            to="/"
            className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]"
          >
            <i className="ri-arrow-left-line"></i> Jadwal Sholat
          </Link>
          <button
            onClick={() => {
              fetchCities();
              setShowCityModal(true);
            }}
            className="text-[#355485]"
          >
            <i className="ri-settings-5-line text-xl"></i>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-3 pt-[70px] pb-6">
        {!cityId ? (
          <div className="text-center py-12 text-gray-500">
            <i className="ri-map-pin-line text-3xl mb-2"></i>
            <p>Pilih kota dulu lewat tombol setting</p>
          </div>
        ) : loading ? (
          <div className="text-center py-12 text-[#6d9bbc]">
            <i className="ri-loader-2-line animate-spin text-3xl"></i>
            <p className="mt-2">Memuat jadwal...</p>
          </div>
        ) : jadwal ? (
          <>
            {/* Card Utama */}
            <div className=" p-5 mb-6 text-center">
              <h2 className="text-lg font-semibold text-[#355485] mb-2">
                Next : {nextPrayer}
              </h2>
              <div className="relative w-40 h-40 mx-auto my-4">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(${circleColor} ${progress}%, #e5e9f0 ${progress}%)`,
                  }}
                ></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-gray-700">
                    {timeLeft}
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#6d9bbc]">{cityName}</p>

              {/* Tanggal & navigasi */}
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={() => changeDay(-1)}
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <i className="ri-arrow-left-s-line text-xl"></i>
                </button>
                <p className="text-sm font-medium text-gray-800">{jadwal.tanggal}</p>
                <button
                  onClick={() => changeDay(1)}
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <i className="ri-arrow-right-s-line text-xl"></i>
                </button>
              </div>
            </div>

            {/* List Waktu Sholat */}
            <div className="divide-y divide-gray-100 rounded-xl overflow-hidden">
              {[
                { name: "Imsak", time: jadwal.imsak, icon: "ri-timer-line" },
                { name: "Subuh", time: jadwal.subuh, icon: "ri-moon-clear-line" },
                { name: "Dzuhur", time: jadwal.dzuhur, icon: "ri-sun-fill" },
                { name: "Ashar", time: jadwal.ashar, icon: "ri-cloud-line" },
                    { name: "Maghrib", time: jadwal.maghrib, icon: "ri-sun-cloudy-line" },
                { name: "Isya", time: jadwal.isya, icon: "ri-moon-line" },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-4 ${nextPrayer === item.name ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <i
                      className={`${item.icon} text-xl ${nextPrayer === item.name
                        ? "text-[#355485]"
                        : "text-[#6d9bbc]"
                        }`}
                    ></i>
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </div>
                  <span className="text-gray-700 font-semibold">{item.time}</span>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* Modal Pilih Kota */}
      {showCityModal && (
        <>
          <div
            onClick={() => setShowCityModal(false)}
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-xl max-h-[70vh] overflow-hidden max-w-xl mx-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Pilih Kota</h3>
              <button onClick={() => setShowCityModal(false)}>
                <i className="ri-close-line text-xl text-gray-500"></i>
              </button>
            </div>
            <div className="p-4">
              <div className="relative mb-3">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Cari kota..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div className="max-h-[50vh] overflow-y-auto space-y-2">
                {cities
                  .filter((c) =>
                    c.lokasi.toLowerCase().includes(searchCity.toLowerCase())
                  )
                  .map((c) => (
                    <div
                      key={c.id}
                      onClick={() => selectCity(c)}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      {c.lokasi}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
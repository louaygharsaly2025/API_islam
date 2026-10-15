// src/pages/Home.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

/* =========================================================================
   HOME PAGE (single-file components)
   Semua komponen ada di bawah dalam 1 file ini
   ====================================================================== */

export default function Home() {
  const [showSplash, setShowSplash] = useState(false);

  // Splash hanya sekali per TAB (pakai sessionStorage)
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("splashShown");
    if (!alreadyShown) {
      setShowSplash(true);
      const t = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("splashShown", "true");
      }, 2500);
      return () => clearTimeout(t);
    }
  }, []);

  if (showSplash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <img
            src="/logo-splash.png"
            alt="Ihsanly Logo"
            className="w-32 h-32 mb-1 animate-pulse"
            style={{ animation: "pulse 2s infinite" }}
          />
          <h1 className="text-2xl font-bold text-gray-800">Ihsanly</h1>
          <p className="text-gray-600">Daily Muslim</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      <PrayerTimeManager>
        {({ nextPrayer, nextPrayerTime, countdown, selectedCity, handleCitySelect, prayerTimes }) => (
          <>
            <NavbarWaktuSholat
              onCitySelect={handleCitySelect}
              nextPrayer={nextPrayer}
              nextPrayerTime={nextPrayerTime}
              countdown={countdown}
              selectedCity={selectedCity}
            />

            <div className="container mx-auto max-w-xl px-4 border-x border-gray-200 pt-2">
              <DateDisplay />
              <AyahOfTheDay />
              <FeatureGrid />
              <InstallBanner />
              <VidMotivasi />
              <PrayerReminder nextPrayer={nextPrayer} />
              <PrayerSchedule
                prayerTimes={prayerTimes}
                nextPrayer={nextPrayer}
                selectedCity={selectedCity}
              />
              <IslamicTips />
              <QuranReminder />
              <QuickMenu />
              <HybridCalendar />
              <Recommendations />
              <NewsSection />
              <Donate />
            </div>
          </>
        )}
      </PrayerTimeManager>

      <BottomNav />
    </div>
  );
}

/* =========================================================================
   COMPONENTS (inline)
   ====================================================================== */

/* ---------- BottomNav ---------- */
function BottomNav() {
  const location = useLocation();
  const items = [
    { to: "/", icon: "ri-home-4-line", activeIcon: "ri-home-4-fill", label: "Home" },
    { to: "/quran", icon: "ri-book-2-line", activeIcon: "ri-book-2-fill", label: "Qur'an" },
    { to: "/dzikir", icon: "ri-heart-2-line", activeIcon: "ri-heart-2-fill", label: "Dzikir" },
    { to: "/jadwal-sholat", icon: "ri-moon-line", activeIcon: "ri-moon-fill", label: "Sholat" },
    { to: "/more", icon: "ri-grid-line", activeIcon: "ri-grid-fill", label: "Menu" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-xl mx-auto grid grid-cols-5">
        {items.map((it) => {
          const active = location.pathname === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              className="py-2.5 text-center text-gray-600 hover:text-gray-800"
            >
              <i className={`${active ? it.activeIcon : it.icon} text-xl`} />
              <div className={`text-[11px] ${active ? "text-gray-900 font-medium" : ""}`}>
                {it.label}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* ---------- NavbarWaktuSholat ---------- */
function NavbarWaktuSholat({ onCitySelect, nextPrayer, nextPrayerTime, countdown, selectedCity }) {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCityModal, setShowCityModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch daftar kota sekali
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const r = await fetch("https://api.myquran.com/v2/sholat/kota/semua");
        const d = await r.json();
        if (d.status) {
          setCities(d.data);
          setFilteredCities(d.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Show/hide on scroll
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y === 0) setIsVisible(false);
      else if (y < lastScrollY) setIsVisible(true);
      else setIsVisible(false);
      setLastScrollY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  // Search kota
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setFilteredCities(cities);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredCities(cities.filter((c) => c.lokasi.toLowerCase().includes(q)));
  }, [searchQuery, cities]);

  const handleCityChange = (cityName, cityId) => {
    setShowCityModal(false);
    setSearchQuery("");
    setFilteredCities(cities);
    onCitySelect?.(cityId, cityName);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full bg-white transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
          } z-40`}
      >
        <div className="max-w-xl mx-auto flex justify-between items-center px-4 py-3 text-gray-800 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Link to="/" className="bg-gray-100 p-2 rounded-lg">
              <span className="text-xl">🕌</span>
            </Link>
            <div>
              <h2 className="text-sm font-semibold">Waktu Sholat</h2>
              <button
                onClick={() => setShowCityModal(true)}
                className="text-xs text-gray-700"
                disabled={isLoading}
              >
                {selectedCity || "Pilih Kota"}
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">
              {nextPrayer} | {nextPrayerTime}
            </p>
            <p className="text-xs text-gray-600">- {countdown}</p>
          </div>
        </div>
      </div>

      {showCityModal && (
        <div className="fixed inset-0 z-50 p-4">
          <div
            className="absolute inset-0 bg-gray-900/50"
            onClick={() => {
              setShowCityModal(false);
              setSearchQuery("");
              setFilteredCities(cities);
            }}
          />
          <div className="relative bg-white rounded-lg w-full max-w-md mx-auto overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Pilih Kota</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowCityModal(false);
                  setSearchQuery("");
                  setFilteredCities(cities);
                }}
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                placeholder="Cari kota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div className="max-h-72 overflow-y-auto">
              {filteredCities.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Tidak ada kota ditemukan</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredCities.map((city) => (
                    <button
                      key={city.id}
                      className={`w-full p-3 text-left text-gray-700 hover:bg-gray-50 pl-6`}
                      onClick={() => handleCityChange(city.lokasi, city.id)}
                    >
                      {city.lokasi}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- PrayerTimeManager (container) ---------- */
function PrayerTimeManager({ children }) {
  const [prayerTimes, setPrayerTimes] = useState({
    Subuh: "--:--",
    Dzuhur: "--:--",
    Ashar: "--:--",
    Maghrib: "--:--",
    Isya: "--:--",
  });
  const [nextPrayer, setNextPrayer] = useState("Memuat...");
  const [nextPrayerTime, setNextPrayerTime] = useState("--:--");
  const [countdown, setCountdown] = useState("--:--:--");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCityId, setSelectedCityId] = useState(null);

  // Load saved city
  useEffect(() => {
    const savedCity = localStorage.getItem("selectedCity");
    const savedCityId = localStorage.getItem("selectedCityId");
    if (savedCity && savedCityId) {
      setSelectedCity(savedCity);
      setSelectedCityId(parseInt(savedCityId, 10));
    }
  }, []);

  const handleCitySelect = (cityId, cityName) => {
    setSelectedCityId(cityId);
    setSelectedCity(cityName);
    localStorage.setItem("selectedCity", cityName);
    localStorage.setItem("selectedCityId", cityId.toString());
  };

  // Fetch jadwal setiap menit dan hitung countdown setiap detik
  useEffect(() => {
    if (!selectedCityId) return;

    let countdownTimer = null;

    const fetchTimes = async () => {
      try {
        const now = new Date();
        const y = now.getFullYear();
        const m = (now.getMonth() + 1).toString().padStart(2, "0");
        const d = now.getDate().toString().padStart(2, "0");
        const r = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${selectedCityId}/${y}-${m}-${d}`);
        const data = await r.json();
        if (data.status) {
          const j = data.data.jadwal;
          const newTimes = {
            Subuh: j.subuh,
            Dzuhur: j.dzuhur,
            Ashar: j.ashar,
            Maghrib: j.maghrib,
            Isya: j.isya,
          };
          setPrayerTimes(newTimes);

          // Tentukan sholat berikutnya
          const next = getNextSholat(newTimes);
          setNextPrayer(next.name);
          setNextPrayerTime(next.time);

          // Clear interval sebelumnya
          if (countdownTimer) clearInterval(countdownTimer);

          // Set countdown
          countdownTimer = setInterval(() => {
            const diff = diffTo(next); // detik
            if (diff <= 0) {
              clearInterval(countdownTimer);
              // Re-fetch untuk update jadwal & next sholat
              fetchTimes();
            } else {
              setCountdown(formatHMS(diff));
            }
          }, 1000);
        }
      } catch (e) {
        console.error(e);
      }
    };

    // initial fetch
    fetchTimes();
    const minuteRefetch = setInterval(fetchTimes, 60000);

    return () => {
      clearInterval(minuteRefetch);
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [selectedCityId]);

  const getNextSholat = (times) => {
    const order = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"];
    const nowSec = nowInSeconds();
    for (const name of order) {
      const sec = timeToSeconds(times[name]);
      if (sec > nowSec) return { name, time: times[name], totalSeconds: sec };
    }
    // Jika sudah lewat Isya -> Subuh besok
    const subuhSecTomorrow = timeToSeconds(times["Subuh"]) + 24 * 3600;
    return { name: "Subuh", time: times["Subuh"], totalSeconds: subuhSecTomorrow };
  };

  const diffTo = (next) => {
    const nowSec = nowInSeconds();
    const target = next.totalSeconds ?? timeToSeconds(next.time);
    const adj = target < nowSec ? target + 24 * 3600 : target;
    return Math.max(0, adj - nowSec);
  };

  const nowInSeconds = () => {
    const n = new Date();
    return n.getHours() * 3600 + n.getMinutes() * 60 + n.getSeconds();
  };
  const timeToSeconds = (hhmm) => {
    if (!hhmm || !hhmm.includes(":")) return 0;
    const [h, m] = hhmm.split(":").map(Number);
    return h * 3600 + m * 60;
  };
  const formatHMS = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return children({
    prayerTimes,
    nextPrayer,
    nextPrayerTime,
    countdown,
    selectedCity,
    handleCitySelect,
  });
}

/* ---------- DateDisplay ---------- */
function DateDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [hijriDate, setHijriDate] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const t = new Date();
        const day = t.getDate();
        const month = t.getMonth() + 1;
        const year = t.getFullYear();
        const r = await fetch(`https://api.aladhan.com/v1/gToH?date=${day}-${month}-${year}`);
        const data = await r.json();
        if (data.code === 200) {
          const h = data.data.hijri;
          setHijriDate(`${h.day} ${h.month.en} ${h.year} H`);
        } else {
          setHijriDate("Hijri date unavailable");
        }
      } catch {
        setHijriDate("Hijri date unavailable");
      }
    })();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    setGreeting(
      hour >= 1 && hour < 11
        ? "Selamat Pagi"
        : hour < 16
          ? "Selamat Siang"
          : hour < 18
            ? "Selamat Sore"
            : "Selamat Malam"
    );
  }, [currentTime]);

  const formattedTime = [
    currentTime.getHours().toString().padStart(2, "0"),
    currentTime.getMinutes().toString().padStart(2, "0"),
    currentTime.getSeconds().toString().padStart(2, "0"),
  ].join(":");

  const formattedDate = currentTime.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="text-center mb-6 pt-5">
      <h1 className="text-2xl font-bold text-gray-800">{greeting}</h1>
      <p className="text-gray-600 text-sm mt-1">{formattedDate}</p>
      <p className="text-gray-600 text-xs">{hijriDate || "Memuat tanggal Hijriyah..."}</p>
      <p className="text-3xl font-semibold text-gray-900 mt-2 tracking-wide">{formattedTime}</p>
    </div>
  );
}

/* ---------- AyahOfTheDay ---------- */
function AyahOfTheDay() {
  const FALLBACK_AYAH = {
    surahNumber: 112,
    surahName: "Al-Ikhlas",
    ayahNumber: 1,
    arabicText: "قُلْ هُوَ اللّٰهُ اَحَدٌۚ",
    translation: "Katakanlah (Muhammad), 'Dialah Allah, Yang Maha Esa.'",
    tafsir: "Allah menyuruh Nabi Muhammad menjawab pertanyaan tentang sifat Tuhannya",
  };

  const [randomAyah, setRandomAyah] = useState(FALLBACK_AYAH);
  const [showTafsir, setShowTafsir] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const getRandomAyah = useCallback(async () => {
    try {
      const randomSurah = Math.floor(Math.random() * 114) + 1;
      const response = await fetch(`/data/surah/${randomSurah}.json`);
      if (!response.ok) throw new Error("Failed to fetch surah");
      const surahData = await response.json();
      const surah = surahData[randomSurah.toString()];
      const totalAyah = parseInt(surah.number_of_ayah);
      const randomAyahNumber = Math.floor(Math.random() * totalAyah) + 1;

      setRandomAyah({
        surahNumber: surah.number,
        surahName: surah.name_latin,
        ayahNumber: randomAyahNumber,
        arabicText: surah.text[randomAyahNumber.toString()],
        translation: surah.translations.id.text[randomAyahNumber.toString()],
        tafsir: surah.tafsir.id.kemenag.text[randomAyahNumber.toString()],
      });
    } catch (e) {
      console.error(e);
      setRandomAyah(FALLBACK_AYAH);
    }
  }, []);

  useEffect(() => {
    getRandomAyah();
  }, [getRandomAyah]);

  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-4 shadow-sm">
        {/* arabnya */}
        <p className="text-2xl text-center text-gray-800 leading-loose font-mushaf">
          {randomAyah.arabicText}
        </p>
        <div className="text-xs text-center text-gray-600 mt-3">
          {randomAyah.surahName} : {randomAyah.ayahNumber} |
          <button onClick={() => setShowTafsir(true)} className="hover:text-blue-600 mx-1">
            Tafsir
          </button>
          -
          <button onClick={() => setShowTranslation(true)} className="hover:text-blue-600 mx-1">
            Terjemah
          </button>
        </div>
      </div>

      {/* Modal Tafsir */}
      {showTafsir && (
        <Modal title={`Tafsir ${randomAyah.surahName} Ayat ${randomAyah.ayahNumber}`} onClose={() => setShowTafsir(false)}>
          <p className="text-gray-700 text-sm text-justify">{randomAyah.tafsir}</p>
        </Modal>
      )}

      {/* Modal Terjemah */}
      {showTranslation && (
        <Modal title={`Terjemah ${randomAyah.surahName} Ayat ${randomAyah.ayahNumber}`} onClose={() => setShowTranslation(false)}>
          <p className="text-xl text-center text-gray-800 mb-4 font-['Scheherazade',serif]">{randomAyah.arabicText}</p>
          <p className="text-gray-700 text-sm text-justify">"{randomAyah.translation}"</p>
        </Modal>
      )}
    </>
  );
}

/* ---------- Modal Utility ---------- */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button className="text-gray-500 hover:text-gray-700 text-xl" onClick={onClose}>
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------- FeatureGrid ---------- */
function FeatureGrid() {
  const features = [
    { to: "/quran", icon: "📖", label: "Qur'an", color: "text-green-500" },
    { to: "/game", icon: "🎮", label: "Game", color: "text-purple-500" },
    { to: "/dzikir", icon: "📿", label: "Dzikir", color: "text-blue-500" },
    { to: "/kiblat", icon: "🕋", label: "Kiblat", color: "text-yellow-500" },
    { to: "/jadwal-sholat", icon: "🕌", label: "Sholat", color: "text-indigo-500" },
  ];
  return (
    <div className="mb-2">
      <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar">
        {features.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="flex flex-col items-center min-w-[80px] p-3 bg-white border border-gray-300 rounded-xl shadow-sm"
          >
            <div className={`text-2xl ${it.color} mb-1`}>{it.icon}</div>
            <span className="text-xs text-center text-gray-700">{it.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ---------- InstallBanner (PWA) ---------- */
function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
      if (!isStandalone) setVisible(true);
    };
    const appInstalled = () => setVisible(false);

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", appInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", appInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="mb-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-green-500 to-emerald-600 p-4 shadow-md text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-xl p-2">
            <span className="text-2xl">📲</span>
          </div>
          <div>
            <p className="font-bold text-base">Install Ihsanly</p>
            <p className="text-sm text-white/90">Rasakan pengalaman lebih cepat dengan aplikasi</p>
          </div>
        </div>
        <button
          onClick={handleInstall}
          className="ml-4 px-4 py-2 rounded-lg bg-white text-green-700 font-semibold text-sm shadow hover:bg-gray-100"
        >
          Install
        </button>
      </div>
    </div>
  );
}

/* ---------- VidMotivasi (placeholder ringan) ---------- */
function VidMotivasi() {
  // Placeholder section; sesuaikan ke rute / data aslinya kalau ada
  return (
    <div className="mb-4 bg-white rounded-xl border p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="text-2xl">🎬</div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">Video Motivasi Hari Ini</h3>
          <p className="text-xs text-gray-600">Cuplikan singkat motivasi Islami</p>
        </div>
        <Link to="/video" className="text-green-700 text-sm font-medium hover:underline">
          Lihat
        </Link>
      </div>
    </div>
  );
}

/* ---------- PrayerReminder ---------- */
function PrayerReminder({ nextPrayer }) {
  return (
    <div className="mb-4 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
      <div className="flex items-center">
        <div className="text-xl text-yellow-600 mr-2">⏰</div>
        <div>
          <h3 className="font-medium text-yellow-800">Pengingat Sholat</h3>
          <p className="text-xs text-yellow-700">Sholat {nextPrayer} dalam waktu dekat</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- PrayerSchedule ---------- */
function PrayerSchedule({ prayerTimes, nextPrayer, selectedCity }) {
  const items = [
    { name: "Subuh", time: prayerTimes?.Subuh },
    { name: "Dzuhur", time: prayerTimes?.Dzuhur },
    { name: "Ashar", time: prayerTimes?.Ashar },
    { name: "Maghrib", time: prayerTimes?.Maghrib },
    { name: "Isya", time: prayerTimes?.Isya },
  ];

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Jadwal Sholat</h2>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          {selectedCity || "Pilih Kota"}
        </span>
      </div>
      <div className="bg-white rounded-2xl border p-3 shadow-sm">
        <div className="grid grid-cols-5 gap-2">
          {items.map((pr) => {
            const active = nextPrayer === pr.name;
            return (
              <div
                key={pr.name}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition ${active ? "bg-blue-50 border border-blue-400" : ""
                  }`}
              >
                <span className="text-xs font-medium text-gray-700">{pr.name}</span>
                <span className={`text-sm font-semibold ${active ? "text-blue-600" : "text-gray-800"}`}>
                  {pr.time || "-"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- IslamicTips ---------- */
function IslamicTips() {
  const [tip, setTip] = useState("");
  useEffect(() => {
    const tips = [
      "Jangan lupa bersedekah hari ini, meski sedikit",
      "Bacalah Al-Qur'an minimal 1 ayat setiap hari",
      "Jaga sholat berjamaah untuk pahala yang berlipat",
      "Perbanyak istighfar untuk menghapus dosa-dosa",
      "Tersenyum adalah sedekah yang mudah dilakukan",
      "Jaga lisan dari perkataan yang tidak bermanfaat",
      "Bersyukurlah atas nikmat yang Allah berikan",
      "Saling memaafkan adalah ciri orang yang bertakwa",
      "Hormati orang tua untuk mendapatkan ridha Allah",
      "Jangan menunda sholat ketika sudah masuk waktunya",
    ];
    setTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);
  return (
    <div className="mb-6 bg-white p-4 rounded-xl border border-green-300 shadow-sm">
      <span className="inline-block text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full mb-2">
        💡 Islami Tips Harian
      </span>
      <p className="text-sm text-gray-700">{tip}</p>
    </div>
  );
}

/* ---------- QuranReminder ---------- */
function QuranReminder() {
  return (
    <div className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-5 text-white shadow-md">
      <h2 className="text-lg font-semibold mb-1">Ingat Baca Qur'an</h2>
      <p className="text-sm opacity-90 mb-4">Luangkan waktumu sebentar untuk membaca Al-Qur'an hari ini.</p>
      <div className="flex items-center space-x-3">
        <Link
          to="/quran"
          className="px-4 py-2 bg-white text-green-700 font-medium text-sm rounded-lg shadow hover:bg-gray-100 transition"
        >
          Baca Sekarang
        </Link>
        <button className="px-4 py-2 border border-white/70 text-white font-medium text-sm rounded-lg hover:bg-white/10 transition">
          Nanti
        </button>
      </div>
    </div>
  );
}

/* ---------- QuickMenu (desktop visible) ---------- */
function QuickMenu() {
  const menuItems = [
    { to: "/quran", icon: "📖", label: "Qur'an", color: "text-green-500" },
    { to: "/dzikir", icon: "📿", label: "Dzikir", color: "text-blue-500" },
    { to: "/doa", icon: "🙏", label: "Doa", color: "text-purple-500" },
    { to: "/kiblat", icon: "🕋", label: "Kiblat", color: "text-yellow-500" },
    { to: "/jadwal-sholat", icon: "🕌", label: "Sholat", color: "text-indigo-500" },
    { to: "/asmaul-husna", icon: "✨", label: "More", color: "text-pink-500" },
  ];
  return (
    <div className="mb-6 hidden md:block">
      <div className="grid grid-cols-6 gap-4">
        {menuItems.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`text-2xl ${it.color} mb-1`}>{it.icon}</div>
            <span className="text-xs text-center text-gray-700">{it.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ---------- HybridCalendar ---------- */
function HybridCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hijriData, setHijriData] = useState({});
  const [loading, setLoading] = useState(false);
  const [specialDates, setSpecialDates] = useState({});

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
  const changeMonth = (offset) => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + offset, 1));
  const monthNameId = (i) =>
    ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][i];

  const fetchHijriDate = async (gDate) => {
    const key = `${gDate.getDate().toString().padStart(2, "0")}-${(gDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${gDate.getFullYear()}`;
    try {
      setLoading(true);
      const r = await fetch(`https://api.aladhan.com/v1/gToH/${key}?calendarMethod=UAQ`);
      const d = await r.json();
      if (d.code === 200) setHijriData((p) => ({ ...p, [key]: d.data.hijri }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date, isCurrentMonth = true) => {
    if (!isCurrentMonth) return;
    setSelectedDate(date);
    const key = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
    if (!hijriData[key]) fetchHijriDate(date);
  };

  useEffect(() => {
    const today = new Date();
    const key = `${today.getDate().toString().padStart(2, "0")}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getFullYear()}`;
    if (!hijriData[key]) fetchHijriDate(today);

    setSpecialDates({
      "15-08-2023": "Hari Kemerdekaan RI",
      "01-01-2024": "Tahun Baru Masehi",
      "12-04-2024": "Hari Raya Idul Fitri 1445 H",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = [];

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrev = getDaysInMonth(prevYear, prevMonth);
  for (let i = daysInPrev - firstDay + 1; i <= daysInPrev; i++) days.push(new Date(prevYear, prevMonth, i));
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

  const totalCells = 42;
  const remaining = totalCells - days.length;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  for (let i = 1; i <= remaining; i++) days.push(new Date(nextYear, nextMonth, i));

  return (
    <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border">
      <div className="flex justify-between items-center mb-3">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100">
          <i className="ri-arrow-left-s-line text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {monthNameId(month)} {year}
        </h2>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100">
          <i className="ri-arrow-right-s-line text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
          <div key={d} className="text-xs font-medium text-gray-500 py-1">
            {d}
          </div>
        ))}

        {days.map((date, idx) => {
          const isCur = date.getMonth() === month;
          const isToday = new Date().toDateString() === date.toDateString();
          const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
          return (
            <div
              key={idx}
              onClick={() => handleDateClick(date, isCur)}
              className={`h-9 w-9 mx-auto flex items-center justify-center rounded-lg cursor-pointer transition-all ${isCur
                  ? isToday
                    ? "bg-blue-100 border border-blue-300"
                    : isSelected
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  : "text-gray-400 hover:bg-gray-50"
                }`}
            >
              <span className={`text-sm font-medium ${isSelected ? "text-white" : ""}`}>
                {date.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-4">
          {loading ? (
            <p className="text-sm text-gray-600">Memuat data Hijriyah...</p>
          ) : (
            <SelectedDateInfo date={selectedDate} hijriData={hijriData} specialDates={specialDates} />
          )}
        </div>
      )}
    </div>
  );
}

function SelectedDateInfo({ date, hijriData, specialDates }) {
  const key = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}`;
  const monthNameId = (i) =>
    ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][i];

  const hijri = hijriData[key];
  return (
    <>
      {hijri ? (
        <p className="text-sm text-gray-600">
          {date.getDate()} {monthNameId(date.getMonth())} {date.getFullYear()} | {hijri.day} {hijri.month.en} {hijri.year} H
        </p>
      ) : (
        <p className="text-sm text-gray-600">Data Hijriyah tidak tersedia</p>
      )}
      {specialDates[key] && <p className="text-sm text-green-600 mt-1">{specialDates[key]}</p>}
    </>
  );
}

/* ---------- NewsSection ---------- */
function NewsSection() {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">News Islamic</h2>
      <div>
        <Link
          to="/artikel-1"
          className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="text-left">
            <h3 className="text-sm font-medium text-gray-800">Cara memakai sorban</h3>
            <p className="text-gray-600 text-xs mt-0.5">deskripsi</p>
          </div>
          <div className="ml-auto text-gray-400">
            <i className="ri-arrow-right-s-line text-lg" />
          </div>
        </Link>
      </div>
    </div>
  );
}

/* ---------- Recommendations ---------- */
function Recommendations() {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Rekomendasi Untukmu</h2>
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/dzikir/pagi"
          className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center">
            <div className="text-2xl text-yellow-500 mr-2">🌅</div>
            <div>
              <h3 className="text-sm font-medium text-gray-800">Dzikir Pagi</h3>
              <p className="text-xs text-gray-600">Baca sekarang</p>
            </div>
          </div>
        </Link>
        <Link
          to="/doa/harian"
          className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center">
            <div className="text-2xl text-green-500 mr-2">📖</div>
            <div>
              <h3 className="text-sm font-medium text-gray-800">Doa Harian</h3>
              <p className="text-xs text-gray-600">Doa sehari-hari</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

/* ---------- Donate ---------- */
function Donate() {
  return (
    <>
      <div className="h-[1px] my-4 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 max-w-lg mx-auto" />
      <Link
        to="/donate"
        className="flex items-center px-4 py-2 mb-2 bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="text-left">
          <h3 className="text-sm font-medium text-gray-800">Donate</h3>
          <p className="text-gray-600 text-xs mt-0.5">deskripsi</p>
        </div>
        <div className="ml-auto text-gray-400">
          <i className="ri-arrow-right-s-line text-lg" />
        </div>
      </Link>
    </>
  );
}

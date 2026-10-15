import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function HeaderDisplay() {
    const [cityId, setCityId] = useState(localStorage.getItem("cityId") || "");
    const [cityName, setCityName] = useState(localStorage.getItem("cityName") || "");
    const [jadwal, setJadwal] = useState(null);
    const [nextPrayer, setNextPrayer] = useState(null);
    const [timeLeft, setTimeLeft] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCityModal, setShowCityModal] = useState(false);
    const [cities, setCities] = useState([]);
    const [searchCity, setSearchCity] = useState("");

    const [notificationsOn, setNotificationsOn] = useState(true);
    const audioRef = useRef(null);

    const today = new Date();
    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    // 🔔 toggle notifikasi
    const toggleNotifications = () => {
        if (audioRef.current) {
            audioRef.current.play().catch((error) => console.log("Autoplay prevented:", error));
        }
        setNotificationsOn((prev) => !prev);
    };

    // 🏙️ ambil daftar kota
    const fetchCities = async () => {
        try {
            const res = await fetch("https://api.myquran.com/v2/sholat/kota/semua");
            const json = await res.json();
            if (json.status) setCities(json.data);
        } catch (err) {
            console.error("Error fetch kota:", err);
        }
    };

    // 📆 ambil jadwal sholat
    const fetchJadwal = async () => {
        if (!cityId) return;
        try {
            setLoading(true);
            const res = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${formatDate(today)}`);
            const json = await res.json();
            if (json.status) setJadwal(json.data.jadwal);
        } catch (err) {
            console.error("Error fetch jadwal:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cityId) fetchJadwal();
    }, [cityId]);

    useEffect(() => {
        if (!jadwal) return;

        const prayerTimes = [
            { name: "Subuh", time: jadwal.subuh },
            { name: "Dzuhur", time: jadwal.dzuhur },
            { name: "Ashar", time: jadwal.ashar },
            { name: "Maghrib", time: jadwal.maghrib },
            { name: "Isya", time: jadwal.isya },
        ];

        const parseTime = (timeStr) => {
            const [h, m] = timeStr.split(":").map(Number);
            const t = new Date();
            t.setHours(h, m, 0, 0);
            return t;
        };

        const tick = () => {
            const now = new Date();

            // cari waktu sholat berikutnya
            let next = prayerTimes.find((p) => parseTime(p.time) > now);

            // kalau sudah lewat semua → ambil Subuh besok
            if (!next) {
                const [h, m] = jadwal.subuh.split(":").map(Number);
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(h, m, 0, 0);

                next = { name: "Subuh", time: jadwal.subuh, date: tomorrow };
            } else {
                next = { ...next, date: parseTime(next.time) };
            }

            const diff = next.date - now;
            const hours = Math.floor(diff / 1000 / 3600);
            const minutes = Math.floor((diff / 1000 % 3600) / 60);
            const seconds = Math.floor(diff / 1000 % 60);

            setNextPrayer(next.name);
            setTimeLeft({
                hours,
                minutes: String(minutes).padStart(2, "0"),
                seconds: String(seconds).padStart(2, "0"),
            });
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [jadwal]);



    // pilih kota
    const selectCity = (city) => {
        setCityId(city.id);
        setCityName(city.lokasi);
        localStorage.setItem("cityId", city.id);
        localStorage.setItem("cityName", city.lokasi);
        setShowCityModal(false);
    };

    return (
        <div>
            <audio ref={audioRef} src="/audio/getar.mp3" />

            {/* Header tanggal + kota */}
            <div className="flex justify-between pt-4 items-center px-4 py-2 text-sm bg-[#fcfeff]">
                <span className="text-[#355485] font-medium">
                    {today.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </span>
                <button onClick={() => { fetchCities(); setShowCityModal(true); }}>
                    <span className="font-semibold text-[#4f90c6]">{cityName || "Pilih Kota"}</span>
                </button>
            </div>

            {/* Card utama */}
            <div className="flex justify-between items-center px-5 py-3 border-b bg-[#fcfeff]">
                <div className="space-y-[-4px]">
                    <div
                        className="w-[30px] h-[30px] flex items-center mb-2 justify-center rounded-[5px] bg-[#355485] cursor-pointer hover:bg-[#2a436c]"
                        onClick={toggleNotifications}
                    >
                        <i className={`text-white text-md ${notificationsOn ? "ri-notification-3-line" : "ri-notification-off-line"}`}></i>
                    </div>

                    {/* next prayer */}
                    <p className="font-normal pt-1 text-[#355485]">Next : {nextPrayer || "-"}</p>

                    {/* waktu sekarang (jam:menit format 24 jam) */}
                    <p className="font-semibold text-[25px] text-[#44515f]">
                        {new Date().toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        })}
                        <span className="text-[10px]"> (start time)</span>
                    </p>


                    {/* countdown waktu sholat berikutnya */}
                    <p className="text-sm text-[#6d9bbc]">
                        {timeLeft && (
                            <>
                                {timeLeft.hours} hour {timeLeft.minutes}
                                <span className="text-[10px]">.{timeLeft.seconds}</span> min left
                            </>
                        )}
                    </p>

                    <p className="text-[13px]">"Hamasah"</p>
                </div>

                <img src="/img/masjid.jpg" alt="Masjid" className="w-[150px] h-[150px] object-contain" />
            </div>

            {/* Prayer times */}
            <Link to="/jadwal-sholat">
                <div className="flex justify-around py-3 px-2 border-b bg-[#fcfeff]">
                    {jadwal ? (
                        [
                            { name: "Subuh", time: jadwal.subuh },
                            { name: "Dzuhur", time: jadwal.dzuhur },
                            { name: "Ashar", time: jadwal.ashar },
                            { name: "Maghrib", time: jadwal.maghrib },
                            { name: "Isya", time: jadwal.isya },
                        ].map((p, i) => (
                            <div key={i} className="text-center flex flex-col items-center">
                                <span className={`w-1.5 h-1.5 rounded-full mb-0.5 ${nextPrayer === p.name ? "bg-[#355485]" : "bg-gray-300"}`}></span>
                                <p className={`text-sm font-medium ${nextPrayer === p.name ? "text-[#355485]" : "text-gray-500"}`}>{p.name}</p>
                                <p className="text-xs text-[#6d9bbc]">{p.time}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm">Pilih kota untuk lihat jadwal</p>
                    )}
                </div>
            </Link>

            {/* Modal Pilih Kota */}
            {showCityModal && (
                <>
                    <div onClick={() => setShowCityModal(false)} className="fixed inset-0 bg-black bg-opacity-40 z-40" />
                    <div className="fixed mb-[55px] bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-xl max-h-[70vh] overflow-hidden max-w-xl mx-auto">
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
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="max-h-[50vh] overflow-y-auto space-y-2">
                                {cities
                                    .filter((c) => c.lokasi.toLowerCase().includes(searchCity.toLowerCase()))
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

export default HeaderDisplay;

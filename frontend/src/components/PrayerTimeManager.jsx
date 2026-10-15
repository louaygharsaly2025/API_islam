import React, { useState, useEffect } from 'react'

const PrayerTimeManager = ({ children }) => {
  const [prayerTimes, setPrayerTimes] = useState({
    Subuh: "--:--",
    Dzuhur: "--:--",
    Ashar: "--:--",
    Maghrib: "--:--",
    Isya: "--:--"
  });
  const [nextPrayer, setNextPrayer] = useState("Memuat...");
  const [nextPrayerTime, setNextPrayerTime] = useState("--:--");
  const [countdown, setCountdown] = useState("--:--:--");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCityId, setSelectedCityId] = useState(null);

  // Load kota yang dipilih dari localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity');
    const savedCityId = localStorage.getItem('selectedCityId');

    if (savedCity && savedCityId) {
      setSelectedCity(savedCity);
      setSelectedCityId(parseInt(savedCityId));
    }
  }, []);

  // Handle pemilihan kota
  const handleCitySelect = (cityId, cityName) => {
    setSelectedCityId(cityId);
    setSelectedCity(cityName);

    // Simpan ke localStorage
    localStorage.setItem('selectedCity', cityName);
    localStorage.setItem('selectedCityId', cityId.toString());
  };

  // Mengambil jadwal sholat berdasarkan kota
  useEffect(() => {
    // Jangan fetch jika kota belum dipilih
    if (!selectedCityId) return;

    const fetchPrayerTimes = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${selectedCityId}/${dateStr}`);
        const data = await response.json();

        if (data.status) {
          const jadwal = data.data.jadwal;

          // Simpan semua waktu sholat
          setPrayerTimes({
            Subuh: jadwal.subuh,
            Dzuhur: jadwal.dzuhur,
            Ashar: jadwal.ashar,
            Maghrib: jadwal.maghrib,
            Isya: jadwal.isya
          });

          // Hitung sholat berikutnya dan countdown
          calculateNextPrayer(jadwal);
        }
      } catch (error) {
        console.error("Error fetching prayer times:", error);
      }
    };

    fetchPrayerTimes();

    // Set interval untuk update countdown setiap detik
    const intervalId = setInterval(fetchPrayerTimes, 60000); // Update setiap menit

    return () => clearInterval(intervalId);
  }, [selectedCityId]);

  // Menghitung sholat berikutnya dan countdown
  const calculateNextPrayer = (jadwal) => {
    const now = new Date();
    const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    const waktuSholat = [
      { name: 'Subuh', time: jadwal.subuh },
      { name: 'Dzuhur', time: jadwal.dzuhur },
      { name: 'Ashar', time: jadwal.ashar },
      { name: 'Maghrib', time: jadwal.maghrib },
      { name: 'Isya', time: jadwal.isya }
    ];

    // Konversi semua waktu sholat ke detik
    const sholatTimesInSeconds = waktuSholat.map(sholat => {
      const [hours, minutes] = sholat.time.split(':').map(Number);
      return {
        name: sholat.name,
        time: sholat.time,
        totalSeconds: hours * 3600 + minutes * 60
      };
    });

    // Cari sholat berikutnya
    let nextSholat = null;
    for (let sholat of sholatTimesInSeconds) {
      if (sholat.totalSeconds > currentTime) {
        nextSholat = sholat;
        break;
      }
    }

    // Jika tidak ada sholat berikutnya hari ini, set ke Subuh besok
    if (!nextSholat) {
      nextSholat = sholatTimesInSeconds[0]; // Subuh
      nextSholat.totalSeconds += 24 * 3600; // Tambah 24 jam
    }

    setNextPrayer(nextSholat.name);
    setNextPrayerTime(nextSholat.time);

    // Hitung countdown
    const timeRemaining = nextSholat.totalSeconds - currentTime;

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

    // Set interval untuk update countdown setiap detik
    const countdownInterval = setInterval(() => {
      const newTimeRemaining = nextSholat.totalSeconds -
        (new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds());

      if (newTimeRemaining <= 0) {
        clearInterval(countdownInterval);
        // Refresh data jika countdown habis
        window.location.reload();
        return;
      }

      const newHours = Math.floor(newTimeRemaining / 3600);
      const newMinutes = Math.floor((newTimeRemaining % 3600) / 60);
      const newSeconds = newTimeRemaining % 60;

      setCountdown(`${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(countdownInterval);
  };

  return children({
    prayerTimes,
    nextPrayer,
    nextPrayerTime,
    countdown,
    selectedCity,
    handleCitySelect
  });
}

export default PrayerTimeManager;
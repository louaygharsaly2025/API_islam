// src/components/home/DateDisplay.jsx
import React, { useState, useEffect } from 'react';

export default function DateDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [hijriDate, setHijriDate] = useState("");
  
  // Tanggal Hijriah
  useEffect(() => {
    const fetchHijriDate = async () => {
      try {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const response = await fetch(
          `https://api.aladhan.com/v1/gToH?date=${day}-${month}-${year}`
        );
        const data = await response.json();
        if (data.code === 200) {
          const hijri = data.data.hijri;
          setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year} H`);
        } else {
          setHijriDate("Hijri date unavailable");
        }
      } catch (error) {
        console.error("Error fetching hijri date:", error);
        setHijriDate("Hijri date unavailable");
      }
    };

    fetchHijriDate();
  }, []);

  // Waktu real-time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  // Greeting
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour >= 1 && hour < 11) {
      setGreeting("Selamat Pagi");
    } else if (hour >= 11 && hour < 16) {
      setGreeting("Selamat Siang");
    } else if (hour >= 16 && hour < 18) {
      setGreeting("Selamat Sore");
    } else {
      setGreeting("Selamat Malam");
    }
  }, [currentTime]);

  // Format tanggal
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
      <p className="text-3xl font-semibold text-gray-900 mt-2 tracking-wide">
        {formattedTime}
      </p>
    </div>
  );
}
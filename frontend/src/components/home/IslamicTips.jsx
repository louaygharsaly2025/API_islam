// src/components/home/IslamicTips.jsx
import React, { useState, useEffect } from 'react';

export default function IslamicTips() {
  const [islamicTips, setIslamicTips] = useState("");

  // Ambil tips islami random
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
      "Jangan menunda sholat ketika sudah masuk waktunya"
    ];
    setIslamicTips(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  return (
    <div className="mb-6 bg-white p-4 rounded-xl border border-green-300 shadow-sm">
      <span className="inline-block text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full mb-2">
        💡 Islami Tips Harian
      </span>
      <p className="text-sm text-gray-700">{islamicTips}</p>
    </div>
  );
}
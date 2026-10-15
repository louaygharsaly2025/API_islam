import React from 'react';

export default function PrayerSchedule({ prayerTimes, nextPrayer, selectedCity }) {
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
          {[
            { name: "Subuh", time: prayerTimes?.Subuh },
            { name: "Dzuhur", time: prayerTimes?.Dzuhur },
            { name: "Ashar", time: prayerTimes?.Ashar },
            { name: "Maghrib", time: prayerTimes?.Maghrib },
            { name: "Isya", time: prayerTimes?.Isya },
          ].map(prayer => (
            <div 
              key={prayer.name} 
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition ${nextPrayer === prayer.name ? "bg-blue-50 border border-blue-400" : ""}`}
            >
              <span className="text-xs font-medium text-gray-700">
                {prayer.name}
              </span>
              <span className={`text-sm font-semibold ${nextPrayer === prayer.name ? "text-blue-600" : "text-gray-800"}`}>
                {prayer.time || "-"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
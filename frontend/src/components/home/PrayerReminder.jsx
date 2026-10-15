import React from 'react';

export default function PrayerReminder({ nextPrayer }) {
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
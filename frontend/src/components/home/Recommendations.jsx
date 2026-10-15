import React from 'react';
import { Link } from 'react-router-dom';

export default function Recommendations() {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Rekomendasi Untukmu</h2>
      <div className="grid grid-cols-2 gap-3">
        <Link to="/dzikir/pagi" className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 shadow-sm hover:shadow-md">
          <div className="flex items-center">
            <div className="text-2xl text-yellow-500 mr-2">🌅</div>
            <div>
              <h3 className="text-sm font-medium text-gray-800">Dzikir Pagi</h3>
              <p className="text-xs text-gray-600">Baca sekarang</p>
            </div>
          </div>
        </Link>
        <Link to="/doa/harian" className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 shadow-sm hover:shadow-md">
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
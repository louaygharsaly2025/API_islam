import React from "react";
import { Link } from "react-router-dom";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md w-full space-y-8">
        {/* Icon / Logo */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#355485] text-white shadow-md animate-bounce">
            <i className="ri-hourglass-2-line text-4xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-[#355485]">
            Segera Hadir!
          </h1>
          <p className="text-gray-500">
            Halaman ini masih dalam pengembangan.
            Nantikan fitur terbaru dari <span className="font-semibold">AlFath</span>.
          </p>
        </div>

        {/* Action */}
        <div className="flex justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-[#355485] text-white rounded-lg hover:bg-[#2a436c] transition-all flex items-center"
          >
            <i className="ri-home-4-line mr-2"></i>
            Kembali ke Beranda
          </Link>
        </div>

        {/* Footer note */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} AlFath. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

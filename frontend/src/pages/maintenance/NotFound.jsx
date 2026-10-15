import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-lg w-full space-y-10">
        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-6xl font-extrabold text-[#355485]">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Maaf, halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center"
          >
            <i className="ri-arrow-left-line mr-2 text-lg"></i>
            Kembali
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#355485] text-white rounded-lg hover:bg-[#2a436c] transition-all flex items-center justify-center"
          >
            <i className="ri-home-4-line mr-2 text-lg"></i>
            Ke Beranda
          </button>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-400">
            Butuh bantuan?{" "}
            <a
              href="https://wa.me/6282285512813"
              target="_blank"
              rel="noreferrer"
              className="text-[#4f90c6] hover:underline"
            >
              Hubungi Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

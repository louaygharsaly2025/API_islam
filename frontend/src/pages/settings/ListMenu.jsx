import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ListMenuPage() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setShowHeader(false); // scroll ke bawah -> hide header
      } else {
        setShowHeader(true); // scroll ke atas -> show header
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen pb-2">
      {/* Header */}
      <div
        className={`fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 transition-transform duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-3">
          <Link
            to="/"
            className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]"
          >
            <i className="ri-arrow-left-line"></i> Menu
          </Link>
          <Link to="/settings">
            <button className="text-[#355485]">
              <i className="ri-settings-5-line text-xl"></i>
            </button>
          </Link>
        </div>
      </div>

      {/* Konten */}
      <div className="max-w-xl mx-auto px-3 border-x border-gray-200 pt-[65px]">
        <h1 className="text-lg font-bold mb-4">Pilih Menu</h1>

        {/* List menu vertikal */}
        <div className="flex flex-col gap-3">
          <Link
            to="/manage/quotes"
            className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="text-left">
              <h3 className="text-sm font-medium text-gray-800">Manage Quotes</h3>
              <p className="text-gray-600 text-xs mt-0.5">deskripsi</p>
            </div>
            <div className="ml-auto text-gray-400">
              <i className="ri-arrow-right-s-line text-lg"></i>
            </div>
          </Link>
          <Link
            to="/manage/doa"
            className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="text-left">
              <h3 className="text-sm font-medium text-gray-800">Manage Doa</h3>
              <p className="text-gray-600 text-xs mt-0.5">deskripsi</p>
            </div>
            <div className="ml-auto text-gray-400">
              <i className="ri-arrow-right-s-line text-lg"></i>
            </div>
          </Link>

          <Link
            to="/manage/audio"
            className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="text-left">
              <h3 className="text-sm font-medium text-gray-800">Manage Audio</h3>
              <p className="text-gray-600 text-xs mt-0.5">deskripsi</p>
            </div>
            <div className="ml-auto text-gray-400">
              <i className="ri-arrow-right-s-line text-lg"></i>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

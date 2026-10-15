// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import LandingPage from "../components/LandingPage";
import BottomNav from "../components/BottomNav";
import NewsSection from "../components/home/NewsSection";
import QuranReminder from "../components/home/QuranReminder";
import HeaderDisplay from "../components/home/HeaderDisplay";
import FeatureGrid from "../components/home/FeatureGrid";
import VidMotivasi from "../components/home/VidMotivasi";
import DoaSection from "../components/home/DoaSection";

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // 🔹 Deteksi install PWA
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;
    setIsInstalled(isStandalone);

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setTransitioning(true);
      setTimeout(() => {
        setIsInstalled(true);
        setTransitioning(false);
      }, 700);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("User install choice:", outcome);

    if (outcome === "accepted") {
      setTransitioning(true);
      setTimeout(() => {
        setIsInstalled(true);
        setTransitioning(false);
      }, 700);
    }

    setDeferredPrompt(null);
  };

  /* 🔑 Logic:
     - Kalau belum diinstall (browser biasa) → LandingPage
     - Kalau sudah diinstall (PWA mode) → tampilkan App utama
  */
  if (!isInstalled) {
    return (
      <div
        className={`transition-opacity duration-700 ${transitioning ? "opacity-0" : "opacity-100"
          }`}
      >
        <LandingPage onInstall={handleInstall} />
      </div>
    );
  }

  // 🔹 App utama (kalau sudah install)
  return (
    <div
      className={`min-h-screen bg-white text-[#44515f] pb-10 transition-opacity duration-700 ${transitioning ? "opacity-0" : "opacity-100"
        }`}
    >
      <HeaderDisplay />
      <FeatureGrid />

      {/* Install Info Card */}
      <div className="px-4">
        <div className="mb-2 rounded-2xl bg-gradient-to-r from-[#355485] to-[#4f90c6] p-4 text-white shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-base">Install AlFath</p>
              {!isInstalled ? (
                <p className="text-sm text-white/90">
                  Rasakan pengalaman lebih cepat dengan aplikasi
                </p>
              ) : (
                <p className="text-sm text-white/90">
                  Aplikasi sudah terpasang, nikmati kemudahan akses 🎉
                </p>
              )}
            </div>

            {!isInstalled ? (
              <button
                onClick={handleInstall}
                className="ml-4 px-4 py-2 rounded-lg bg-white text-[#355485] font-semibold text-sm shadow hover:bg-gray-100 transition"
              >
                Install
              </button>
            ) : (
              <span className="ml-4 px-4 py-2 rounded-lg bg-white/20 text-white font-medium text-sm shadow">
                Terpasang
              </span>
            )}
          </div>
        </div>
      </div>

      <DoaSection />
      <VidMotivasi />
      <NewsSection />
      <QuranReminder />
      <BottomNav />
    </div>
  );
}

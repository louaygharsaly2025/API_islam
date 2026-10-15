import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LandingPage from "../components/LandingPage"; // buat desktop
import BottomNav from "../components/BottomNav";
import NewsSection from "../components/home/NewsSection";
import QuranReminder from "../components/home/QuranReminder";
import HeaderDisplay from "../components/home/HeaderDisplay";
import FeatureGrid from "../components/home/FeatureGrid";
import VidMotivasi from "../components/home/VidMotivasi";
import InstallBanner from "../components/home/InstallBanner";

export default function Home() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // update ketika resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // kalau desktop → LandingPage
  if (isDesktop) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-white text-[#44515f] pb-10">
      <HeaderDisplay />
      <FeatureGrid />
      <InstallBanner />
      <VidMotivasi />
      <NewsSection />
      <QuranReminder />
      <BottomNav />
    </div>
  );
}

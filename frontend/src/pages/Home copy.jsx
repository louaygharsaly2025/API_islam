import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import PrayerTimeManager from '../components/PrayerTimeManager'
import Donate from '../components/Donate'
import NavbarWaktuSholat from '../components/NavWaktuSholat'

// Import komponen-komponen home
import DateDisplay from '../components/home/DateDisplay'
import AyahOfTheDay from '../components/home/AyahOfTheDay'
import PrayerReminder from '../components/home/PrayerReminder'
import PrayerSchedule from '../components/home/PrayerSchedule'
import IslamicTips from '../components/home/IslamicTips'
import QuranReminder from '../components/home/QuranReminder'
import QuickMenu from '../components/home/QuickMenu'
import IslamicCalendar from '../components/home/IslamicCalendar'
import Recommendations from '../components/home/Recommendations'
import NewsSection from '../components/home/NewsSection'
import FeatureGrid from '../components/home/FeatureGrid'
import VidMotivasi from '../components/home/VidMotivasi'
import InstallButton from '../components/home/InstallBanner'

export default function Home() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("splashShown");

    if (!alreadyShown) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("splashShown", "true"); // tandai sudah lihat di sesi/tab ini
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);


  if (showSplash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center animate-fade-in">
          <img
            src="/logo-splash.png"
            alt="AlFath Logo"
            className="w-32 h-32 mb-0 animate-pulse"
            style={{ animation: 'pulse 2s infinite, scaleIn 1.5s ease-out' }}
          />
          <h1
            className="text-2xl font-bold mt-1.5 text-gray-800 animate-slide-in"
            style={{ animation: 'slideIn 1s ease-out 0.5s both, fadeIn 1.5s ease-out 0.5s both' }}
          >
            AlFath
          </h1>
          <p
            className="text-gray-600 animate-fade-in"
            style={{ animation: 'fadeIn 1.5s ease-out 1s both' }}
          >
            Muslim Daily
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-1 bg-gray-50">
      <PrayerTimeManager>
        {({ nextPrayer, nextPrayerTime, countdown, selectedCity, handleCitySelect, prayerTimes }) => (
          <>
            <NavbarWaktuSholat
              onCitySelect={handleCitySelect}
              nextPrayer={nextPrayer}
              nextPrayerTime={nextPrayerTime}
              countdown={countdown}
              selectedCity={selectedCity}
            />

            <div className="container mx-auto max-w-xl px-4 md:mb-0 mb-[70px] border-x border-gray-200 pt-2">
              <DateDisplay />
              <AyahOfTheDay />
              <FeatureGrid />
              <InstallButton/>
              <VidMotivasi />
              <PrayerReminder nextPrayer={nextPrayer} />
              <PrayerSchedule
                prayerTimes={prayerTimes}
                nextPrayer={nextPrayer}
                selectedCity={selectedCity}
              />
              <IslamicTips />
              <QuranReminder />
              <QuickMenu />
              <IslamicCalendar />
              <Recommendations />
              <NewsSection />
              <Donate />
            </div>
          </>
        )}
      </PrayerTimeManager>
      <BottomNav />
    </div>
  )
}

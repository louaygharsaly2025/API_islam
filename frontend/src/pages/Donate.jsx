import React, { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import NavbarWaktuSholat from "../components/NavWaktuSholat";
import PrayerTimeManager from "../components/PrayerTimeManager";

export default function Donate() {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    document.title = "Donate - Islamic";
  }, []);

  const packages = [
    {
      id: 1,
      title: "Niat Baik",
      price: "Rp5.000",
      img: "/qr-5k.jpeg",
      icon: "ri-hand-heart-line",
    },
    {
      id: 2,
      title: "Langkah Kebaikan",
      price: "Rp10.000",
      img: "/qr-10k.jpeg",
      icon: "ri-heart-2-line",
    },
    {
      id: 3,
      title: "Tebar Manfaat",
      price: "Rp25.000",
      img: "/qr-25k.jpeg",
      icon: "ri-team-line",
    },
    {
      id: 4,
      title: "Sedekah Berkah",
      price: "Rp50.000",
      img: "/qr-50k.jpeg",
      icon: "ri-moon-clear-line",
    },
  ];

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <PrayerTimeManager>
        {({
          nextPrayer,
          nextPrayerTime,
          countdown,
          selectedCity,
          handleCitySelect,
        }) => (
          <>
            <NavbarWaktuSholat
              onCitySelect={handleCitySelect}
              nextPrayer={nextPrayer}
              nextPrayerTime={nextPrayerTime}
              countdown={countdown}
              selectedCity={selectedCity}
            />

            {/* konten donasi */}
            <div className="container mx-auto max-w-5xl px-5 pt-24 pb-10">
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-3">
                Donasi Kebaikan 🤲
              </h1>
              <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
                Setiap donasi adalah langkah kecil menuju keberkahan besar.  
                Pilih paket donasi dan mari kita saling berbagi kebaikan 🌙✨
              </p>

              {/* grid paket donasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-lg transition"
                  >
                    <i
                      className={`${pkg.icon} text-5xl text-gray-700 mb-4`}
                    ></i>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {pkg.title}
                    </h2>
                    <p className="text-gray-600 mt-1">{pkg.price}</p>
                    <button
                      onClick={() => setSelected(pkg)}
                      className="mt-6 w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-xl"
                    >
                      Donate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </PrayerTimeManager>

      <BottomNav />

      {/* modal QR */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-5">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-lg">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
            <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
              {selected.title}
            </h3>
            <p className="text-center text-gray-600 mb-4">
              Scan QR untuk donasi {selected.price}
            </p>
            <img
              src={selected.img}
              alt="QR Code"
              className="w-60 mx-auto rounded-lg shadow"
            />
          </div>
        </div>
      )}
    </div>
  );
}

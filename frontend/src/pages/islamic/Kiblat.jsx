import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Kiblat() {
    const [qiblaDirection, setQiblaDirection] = useState(null);
    const [deviceOrientation, setDeviceOrientation] = useState(0);
    const [cityName, setCityName] = useState(localStorage.getItem("cityName") || "-");
    const [coords, setCoords] = useState({
        lat: localStorage.getItem("lat"),
        lng: localStorage.getItem("lng"),
    });

    // Hitung arah kiblat
    const calculateQibla = (lat, lng) => {
        const kaabaLat = 21.4225 * (Math.PI / 180);
        const kaabaLng = 39.8262 * (Math.PI / 180);
        const userLat = lat * (Math.PI / 180);
        const userLng = lng * (Math.PI / 180);

        const longDiff = kaabaLng - userLng;
        const y = Math.sin(longDiff);
        const x =
            Math.cos(userLat) * Math.tan(kaabaLat) -
            Math.sin(userLat) * Math.cos(longDiff);

        let bearing = (Math.atan2(y, x) * 180) / Math.PI;
        bearing = (bearing + 360) % 360;
        return bearing;
    };

    // Ambil lokasi dari localStorage
    useEffect(() => {
        if (coords.lat && coords.lng) {
            const qibla = calculateQibla(parseFloat(coords.lat), parseFloat(coords.lng));
            setQiblaDirection(qibla);
        }
    }, [coords]);

    // Update orientasi HP
    useEffect(() => {
        const handleOrientation = (event) => {
            if (event.alpha !== null) {
                setDeviceOrientation(event.alpha);
            }
        };
        window.addEventListener("deviceorientationabsolute", handleOrientation, true);
        window.addEventListener("deviceorientation", handleOrientation, true);

        return () => {
            window.removeEventListener("deviceorientationabsolute", handleOrientation);
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, []);

    // rotasi jarum kiblat
    const getRotation = () => {
        if (qiblaDirection === null) return 0;
        return qiblaDirection - deviceOrientation;
    };

    return (
        <div className="min-h-screen bg-[#fcfeff] relative">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between text-[#355485]">
                <Link to="/" className="flex items-center gap-2 text-[15px] font-semibold">
                    <i className="ri-arrow-left-line text-lg"></i> Arah Kiblat
                </Link>
                <button>
                    <i className="ri-information-line text-xl"></i>
                </button>
            </div>

            {/* Konten */}
            <div className="flex flex-col items-center justify-center pt-28 text-center px-4">
                {/* Lokasi */}
                <p className="flex items-center gap-1 text-sm text-[#355485] mb-1">
                    <i className="ri-map-pin-2-fill text-red-500"></i> {cityName}
                </p>
                {coords.lat && coords.lng && (
                    <p className="text-xs text-[#6d9bbc]">
                        Koordinat: {coords.lat}, {coords.lng}
                    </p>
                )}

                {/* Derajat */}
                <p className="text-sm text-[#6d9bbc] mt-1">Derajat Sudut Kiblat dari Utara</p>
                <h1 className="text-4xl font-bold mt-1 text-[#355485]">
                    {qiblaDirection ? `${qiblaDirection.toFixed(2)}°` : "--"}
                </h1>

                {/* Kompas */}
                <div className="relative w-72 h-72 rounded-full bg-white shadow-xl mt-8 flex items-center justify-center border border-gray-200">
                    {/* lingkaran dalam */}
                    <div className="absolute inset-6 rounded-full border border-gray-100"></div>

                    {/* label arah mata angin */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-bold text-[#355485]">U</div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-bold text-[#355485]">S</div>
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-sm font-bold text-[#355485]">B</div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-[#355485]">T</div>

                    {/* Jarum Kiblat */}
                    {qiblaDirection && (
                        <div
                            className="absolute w-1.5 h-28 bg-gradient-to-b from-[#4f90c6] to-[#355485] rounded-full origin-bottom"
                            style={{ transform: `rotate(${getRotation()}deg)` }}
                        >
                            <div className="w-6 h-6 rounded-full bg-[#355485] border-2 border-white absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center text-white text-xs">
                                <i className="ri-home-5-line"></i>
                            </div>
                        </div>
                    )}

                    {/* Jarum Utara */}
                    <div
                        className="absolute w-1 h-24 bg-red-500 origin-bottom"
                        style={{ transform: `rotate(${-deviceOrientation}deg)` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

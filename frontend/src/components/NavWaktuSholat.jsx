import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const NavbarWaktuSholat = ({ onCitySelect, nextPrayer, nextPrayerTime, countdown, selectedCity }) => {
    const [isVisible, setIsVisible] = useState(false); // Default false agar tersembunyi saat pertama dibuka
    const [lastScrollY, setLastScrollY] = useState(0);
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [showCityModal, setShowCityModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Mendapatkan data kota dari API (hanya sekali saat mount)
    useEffect(() => {
        const fetchCities = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("https://api.myquran.com/v2/sholat/kota/semua");
                const data = await response.json();
                if (data.status) {
                    setCities(data.data);
                    setFilteredCities(data.data);
                }
            } catch (error) {
                console.error("Error fetching cities:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCities();
    }, []);

    // Mencari kota berdasarkan query
    const searchCities = (query) => {
        if (query.length < 2) {
            setFilteredCities(cities);
            return;
        }

        const filtered = cities.filter(city =>
            city.lokasi.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCities(filtered);
    };

    // Handle scroll untuk show/hide navbar - DIPERBAIKI
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Jika di posisi paling atas, sembunyikan navbar
            if (currentScrollY === 0) {
                setIsVisible(false);
            } 
            // Jika scroll ke atas dan bukan di posisi paling atas
            else if (currentScrollY < lastScrollY) {
                setIsVisible(true);
            } 
            // Jika scroll ke bawah
            else if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const handleCityChange = (cityName, cityId) => {
        setShowCityModal(false);
        setSearchQuery("");
        setFilteredCities(cities);
        if (onCitySelect) onCitySelect(cityId, cityName);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        searchCities(query);
    };

    return (
        <>
            <div className={`fixed top-0 left-0 w-full bg-white transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"} z-40`}>
                <div className="max-w-xl mx-auto flex justify-between items-center px-4 py-3 text-gray-800 border border-b border-gray-200">
                    <div className="flex items-center">
                        <Link to="/">
                            <div className="bg-gray-100 p-2 rounded-lg">
                                <span className="text-xl">🕌</span>
                            </div>
                        </Link>
                        <div className="ml-3">
                            <h2 className="text-sm font-semibold">Waktu Sholat</h2>
                            <button
                                onClick={() => setShowCityModal(true)}
                                className="text-xs flex items-center text-gray-700"
                                disabled={isLoading}
                            >
                                {selectedCity || "Pilih Kota"}
                            </button>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">{nextPrayer} | {nextPrayerTime}</p>
                        <p className="text-xs text-gray-600">- {countdown}</p>
                    </div>
                </div>
            </div>

            {/* Modal Pilih Kota */}
            {showCityModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md overflow-hidden flex flex-col shadow-xl">
                        {/* Header Modal dengan Tombol Tutup */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Pilih Kota</h3>
                            <button
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                                onClick={() => {
                                    setShowCityModal(false);
                                    setSearchQuery("");
                                    setFilteredCities(cities);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari kota..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 pl-3"
                                />
                            </div>
                        </div>

                        {/* Daftar Kota */}
                        <div className="overflow-y-auto flex-grow max-h-72">
                            {filteredCities.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">Tidak ada kota ditemukan</p>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {filteredCities.map(city => (
                                        <button
                                            key={city.id}
                                            className={`w-full p-3 text-left transition-colors ${selectedCity === city.lokasi
                                                ? 'bg-gray-100 text-gray-900 font-medium'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                } pl-6 `}
                                            onClick={() => handleCityChange(city.lokasi, city.id)}
                                        >
                                            {city.lokasi}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NavbarWaktuSholat;
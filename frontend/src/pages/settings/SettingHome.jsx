// src/pages/settings/SettingHome.jsx
import { Link } from "react-router-dom";
import BottomNav from "../../components/BottomNav";

export default function SettingHome() {
    

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
           <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
                   <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-3">
                     <Link
                       to="/"
                       className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]"
                     >
                       <i className="ri-arrow-left-line"></i> Setting
                     </Link>
                     <button className="text-[#355485]">
                       <i className="ri-settings-5-line text-xl"></i>
                     </button>
                   </div>
                 </div>

            <div className="max-w-xl mx-auto px-4 pt-[70px]">
                {/* Profile Section */}
                <Link to="/login">
                    <div className="flex flex-col items-center mb-6 text-center">
                        <img
                            src="/img/logo-x.png"
                            alt="User avatar"
                            className="w-[120px] h-[120px] object-cover"
                        />
                        <p className="text-sm text-gray-500">
                            hadir sebagai teman harian muslim dengan Al-Qur’an, doa, dzikir, jadwal sholat, serta motivasi Islami yang menenangkan hati
                        </p>
                    </div>
                </Link>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                        { label: "Sholat", icon: "ri-time-line", link: "/jadwal-sholat" },
                        { label: "Quran", icon: "ri-book-2-line", link: "/quran" },
                        { label: "Qiblat", icon: "ri-compass-3-line", link: "/qiblat" },
                        { label: "Dzikir", icon: "ri-hand-heart-line", link: "/dzikir" },
                    ].map((m, i) => (
                        <Link
                            key={i}
                            to={m.link}
                            className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition"
                        >
                            <i className={`${m.icon} text-xl text-[#355485]`} />
                            <span className="text-xs mt-1 text-gray-700">{m.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Settings Options */}
                <div className="space-y-4">
                    {/* Notifikasi */}
                    <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div>
                            <p className="font-medium text-gray-700">Notifikasi</p>
                            <p className="text-sm text-gray-500">Aktifkan pengingat sholat</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#355485] transition"></div>
                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></span>
                        </label>
                    </div>

                    {/* Mode Hemat Data */}
                    <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div>
                            <p className="font-medium text-gray-700">Mode Hemat Data</p>
                            <p className="text-sm text-gray-500">
                                Kurangi penggunaan gambar & animasi
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#355485] transition"></div>
                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></span>
                        </label>
                    </div>

                    {/* Ukuran Font */}
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                        <p className="font-medium text-gray-700 mb-2">Ukuran Font</p>
                        <select className="w-full p-2 border border-gray-300 rounded-lg">
                            <option>Kecil</option>
                            <option>Sedang</option>
                            <option>Besar</option>
                        </select>
                    </div>

                    {/* Bahasa */}
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                        <p className="font-medium text-gray-700 mb-2">Bahasa</p>
                        <select className="w-full p-2 border border-gray-300 rounded-lg">
                            <option>Indonesia</option>
                            <option>English</option>
                        </select>
                    </div>

                    {/* Tentang */}
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                        <p className="font-medium text-gray-700 mb-1">Tentang Aplikasi</p>
                        <p className="text-sm text-gray-500">
                            AlFath — Muslim Daily. Versi 1.0.0
                        </p>
                    </div>

                    {/* Support */}
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 text-center">
                        <p className="text-sm text-gray-500 mb-2">Butuh bantuan?</p>
                        <a
                            href="https://wa.me/6282285512813"
                            className="px-4 py-2 rounded-lg bg-[#355485] text-white hover:bg-green-600 transition"
                        >
                            Hubungi Support
                        </a>
                    </div>
                </div>
            </div>
            <BottomNav/>
        </div>
    );
}

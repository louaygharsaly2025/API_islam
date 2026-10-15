import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function DoaList() {
    const kategoriList = [
        { label: "Kesembuhan", icon: "ri-health-book-line", link: "/doa/kesembuhan" },
        { label: "Akhlak Baik", icon: "ri-emotion-happy-line", link: "/doa/akhlak" },
        { label: "Makan & Minum", icon: "ri-restaurant-line", link: "/doa/makan-minum" },
        { label: "Berpergian", icon: "ri-flight-takeoff-line", link: "/doa/berpergian" },
        { label: "Keteguhan Hati", icon: "ri-shield-line", link: "/doa/keteguhan" },
    ];

    const doaList = [
        {
            nama: "Fatkhurrhn",
            waktu: "13 menit lalu",
            doa: "Niatkan semuanya karena Allaah, jangan ada lagi mahkluk dalam dirimu. Sertakan Allaah dalam segala kondisi agar hidupmu menjadi tenang 🌻✨",
        },
        {
            nama: "Ahmad",
            waktu: "25 menit lalu",
            doa: "Ya Allah, jadikanlah hati kami selalu ikhlas dalam beribadah, dan jauhkanlah kami dari sifat riya’ serta ujub.",
        },
        {
            nama: "Siti",
            waktu: "1 jam lalu",
            doa: "Semoga setiap langkah yang kita jalani senantiasa diberkahi dan diridhai oleh Allah SWT.",
        },
        {
            nama: "Rina",
            waktu: "2 jam lalu",
            doa: "Ya Allah, berikanlah kemudahan dalam setiap urusan kami dan jauhkanlah dari kesulitan yang menyulitkan.",
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleDoa = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-4">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
                <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-4">
                    <Link
                        to="/"
                        className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]"
                    >
                        <i className="ri-arrow-left-line"></i> Doa List
                    </Link>
                    <button className="text-[#355485]">
                        <i className="ri-settings-5-line text-xl"></i>
                    </button>
                </div>
            </div>

            {/* Isi konten */}
            <div className="max-w-xl mx-auto px-3 border-x border-gray-200 pt-[70px]">
                {/* Kategori Doa */}
                <h2 className="font-semibold text-[#355485] mb-3">Kategori Doa</h2>
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {kategoriList.map((kat, i) => (
                        <Link
                            key={i}
                            to={kat.link}
                            className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#cbdde9] bg-white hover:bg-gray-50 shadow-sm transition"
                        >
                            <i className={`${kat.icon} text-2xl text-[#4f90c6] mb-1`}></i>
                            <span className="text-[12px] text-[#355485] font-medium text-center">
                                {kat.label}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Doa List */}
                <h2 className="font-semibold text-[#355485] mb-3">
                    Doa-doa dari Saudaramu
                </h2>
                <div className="space-y-5">
                    {doaList.map((doa, idx) => (
                        <div key={idx}>
                            {/* Card Doa */}
                            <div className="rounded-2xl border border-[#cbdde9] bg-gray-100 p-4 text-[#355485]">
                                <div className="flex items-center mb-2">
                                    <img
                                        src="https://cdn-icons-png.freepik.com/512/7718/7718888.png"
                                        alt="profile"
                                        className="w-9 h-9 rounded-full mr-3"
                                    />
                                    <div>
                                        <p className="font-semibold">{doa.nama}</p>
                                        <p className="text-[13px] -mt-1 text-[#355485]">
                                            {doa.waktu}
                                        </p>
                                    </div>
                                </div>

                                {/* Isi doa */}
                                <p
                                    className="text-sm text-[#355485] text-justify leading-tight transition-all duration-300"
                                    style={
                                        openIndex === idx
                                            ? {}
                                            : {
                                                display: "-webkit-box",
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }
                                    }
                                >
                                    {doa.doa}
                                </p>

                                {/* Tombol selengkapnya */}
                                <button
                                    className="text-xs mt-1 text-gray-400 hover:underline"
                                    onClick={() => toggleDoa(idx)}
                                >
                                    {openIndex === idx ? "Tutup" : "Selengkapnya"}
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center px-2 mt-2 text-[#355485]">
                                <button className="flex items-center gap-1 text-sm font-medium hover:text-[#4f90c6]">
                                    <i className="ri-service-line"></i> Aamiin
                                </button>
                                <button className="flex items-center gap-1 text-sm font-medium hover:text-[#4f90c6]">
                                    <i className="ri-share-line"></i> Bagikan
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

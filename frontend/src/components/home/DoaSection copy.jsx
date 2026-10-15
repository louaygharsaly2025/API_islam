import React, { useState } from "react";
import { Link } from "react-router-dom";

function DoaSection() {
    const doaList = [
        {
            nama: "Fatkhurrhn",
            waktu: "13 menit lalu",
            doa: "Niatkan semuanya karena Allaah, jangan ada lagi mahkluk dalam dirimu. Sertakan Allaah dalam segala kondisi agar hidupmu menjadi tenang. Be the best servant of Allah because without Allaah we're nothing🌻✨",
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
    ];

    // State untuk item mana yang terbuka
    const [openIndex, setOpenIndex] = useState(null);

    const toggleDoa = (idx) => {
        if (openIndex === idx) {
            setOpenIndex(null); // kalau lagi terbuka, tutup
        } else {
            setOpenIndex(idx); // buka item ini
        }
    };

    return (
        <div className="px-4 pt-2">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-[#355485]">Aminkan Doa Saudaramu</h2>
                <Link to="/video">
                    <i className="ri-arrow-right-s-line text-xl text-[#6d9bbc]"></i>
                </Link>
            </div>

            {/* Scroll Horizontal */}
            <div className="flex gap-4 overflow-x-auto pb-3">
                {doaList.map((doa, idx) => (
                    <div
                        key={idx}
                        className="min-w-[280px] max-w-[280px] flex-shrink-0"
                    >
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
                                    <p className="text-[13px] -mt-1 text-[#355485]">{doa.waktu}</p>
                                </div>
                            </div>

                            {/* Isi doa */}
                            <p
                                className="text-sm text-[#355485] text-justify leading-tight transition-all duration-300"
                                style={
                                    openIndex === idx
                                        ? {} // full teks
                                        : {
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
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
                        <div className="flex justify-between items-center px-2 mt-3 text-[#355485]">
                            <button className="flex items-center gap-1 text-sm font-medium">
                                <i className="ri-service-line"></i> Aamiin
                            </button>
                            <button className="flex items-center gap-1 text-sm font-medium">
                                <i className="ri-share-line"></i> Bagikan
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DoaSection;

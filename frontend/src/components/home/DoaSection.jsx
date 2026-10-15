// src/components/home/DoaSection.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, onSnapshot, updateDoc, doc, increment } from "firebase/firestore";

function DoaSection() {
    const [doaList, setDoaList] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);
    const [liked, setLiked] = useState({});

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "doa"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
            }));
            data.sort((a, b) => b.createdAt - a.createdAt);
            setDoaList(data);
        });
        return () => unsub();
    }, []);

    const toggleDoa = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    const handleAmin = async (id) => {
        const ref = doc(db, "doa", id);
        await updateDoc(ref, { aminCount: increment(1) });
        setLiked((prev) => ({ ...prev, [id]: true }));
    };

    const timeAgo = (date) => {
        if (!date) return "";
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        if (seconds < 60) return `${seconds} detik lalu`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} menit lalu`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} jam lalu`;
        return `${Math.floor(hours / 24)} hari lalu`;
    };

    return (
        <div className="px-4 -pt-2">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-[#355485]">Aminkan Doa Saudaramu</h2>
                <Link to="/doa/add">
                    <i className="ri-add-line text-xl font-semibold text-[#355485]"></i>
                </Link>
            </div>

            {/* Scroll Horizontal */}
            <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar">
                {doaList.length > 0 ? (
                    doaList.slice(0, 3).map((doa, idx) => {
                        const isLong = doa.doa && doa.doa.length > 120; // cek panjang doa

                        return (
                            <div
                                key={doa.id}
                                className="min-w-[280px] max-w-[280px] flex-shrink-0"
                            >
                                {/* Card Doa */}
                                <div className="rounded-[13px] border border-[#d7e3ec] bg-gray-100 shadow-sm p-4 text-[#355485]">
                                    <div className="flex items-center mb-2">
                                        <img
                                            src="https://cdn-icons-png.freepik.com/512/7718/7718888.png"
                                            alt="profile"
                                            className="w-9 h-9 rounded-full mr-3"
                                        />
                                        <div>
                                            <p className="font-semibold">{doa.nama || "Anonim"}</p>
                                            <p className="text-[13px] -mt-1 text-[#355485]">
                                                {timeAgo(doa.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Isi doa */}
                                    <p
                                        className="text-sm text-gray-700 text-justify leading-tight transition-all duration-300"
                                        style={
                                            openIndex === idx
                                                ? {}
                                                : isLong
                                                    ? {
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                    }
                                                    : {}
                                        }
                                    >
                                        {doa.doa}
                                    </p>

                                    {/* Tombol selengkapnya → hanya muncul jika panjang */}
                                    {isLong && (
                                        <button
                                            className="text-xs mt-1 text-gray-400 hover:underline"
                                            onClick={() => toggleDoa(idx)}
                                        >
                                            {openIndex === idx ? "Tutup" : "Selengkapnya"}
                                        </button>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-between items-center px-2 mt-3 text-[#355485]">
                                    <button
                                        className="flex items-center gap-1 text-sm font-medium"
                                        onClick={() => handleAmin(doa.id)}
                                    >
                                        <i
                                            className={`ri-service-line ${liked[doa.id] ? "text-red-500" : ""
                                                }`}
                                        ></i>{" "}
                                        {doa.aminCount || 0} Aamiin
                                    </button>
                                    <button className="flex items-center gap-1 text-sm font-medium">
                                        <i className="ri-share-line"></i> Bagikan
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-400 text-sm">Belum ada doa</p>
                )}

                {/* Card Selengkapnya */}
                <div className="min-w-[120px] max-w-[120px] h-[140px] flex-shrink-0">
                    <Link to="/doa">
                        <div className="rounded-2xl border border-[#cbdde9] bg-gradient-to-br from-[#f9fbfc] to-[#eef4f8] flex items-center justify-center h-full text-[#355485] hover:bg-gray-200 transition">
                            <div className="flex flex-col items-center justify-center">
                                <i className="ri-arrow-right-s-line text-2xl mb-1"></i>
                                <span className="text-sm font-medium">Selengkapnya</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default DoaSection;

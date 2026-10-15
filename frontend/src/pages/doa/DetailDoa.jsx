// src/pages/doa/DetailDoa.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

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

export default function DetailDoa() {
    const { id } = useParams();
    const [doa, setDoa] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoa = async () => {
            const ref = doc(db, "doa", id);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                setDoa({ id: snap.id, ...snap.data(), createdAt: snap.data().createdAt?.toDate() });
            }
            setLoading(false);
        };
        fetchDoa();
    }, [id]);

    const handleAmin = async () => {
        const ref = doc(db, "doa", id);
        await updateDoc(ref, { aminCount: increment(1) });
        setDoa((prev) => ({ ...prev, aminCount: (prev.aminCount || 0) + 1 }));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center text-gray-500">
                    <i className="ri-loader-2-line animate-spin text-3xl mb-2"></i>
                    <p>Memuat data...</p>
                </div>
            </div>
        );
    }

    if (!doa) return <p className="text-center mt-10">Doa tidak ditemukan</p>;

    return (
        <div className="min-h-screen bg-gray-50 pb-4">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
                <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-4">
                    <Link to="/doa" className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]">
                        <i className="ri-arrow-left-line"></i> Detail Doa
                    </Link>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-3 border-x border-gray-200 pt-[70px]">
                <div className="rounded-2xl border border-[#cbdde9] bg-white p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                        <img
                            src="https://cdn-icons-png.freepik.com/512/7718/7718888.png"
                            alt="profile"
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                            <p className="font-semibold text-gray-800">{doa.nama}</p>
                            <p className="text-[13px] text-gray-500">{timeAgo(doa.createdAt)}</p>
                        </div>
                    </div>
                    <p className="text-gray-700 text-base">{doa.doa}</p>

                    {/* Actions */}
                    <div className="flex justify-between items-center mt-4 text-[#355485]">
                        <button
                            onClick={handleAmin}
                            className="flex items-center gap-1 text-sm font-medium hover:text-[#4f90c6]"
                        >
                            <i className="ri-service-line"></i> Aamiin ({doa.aminCount || 0})
                        </button>
                        <button className="flex items-center gap-1 text-sm font-medium hover:text-[#4f90c6]">
                            <i className="ri-share-line"></i> Bagikan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

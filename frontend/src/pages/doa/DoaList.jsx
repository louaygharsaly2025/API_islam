import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, onSnapshot, updateDoc, doc, increment } from "firebase/firestore";
import BottomNav from "../../components/BottomNav";

/* ---------- Helpers ---------- */
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

const highlightText = (text, keyword) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200">{part}</mark>
        ) : (
            part
        )
    );
};

/* ---------- Main ---------- */
export default function DoaList() {
    const [doaList, setDoaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [liked, setLiked] = useState({});
    const [sortAsc, setSortAsc] = useState(false); // default terbaru

    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                // Scroll ke bawah -> sembunyikan header
                setShowHeader(false);
            } else {
                // Scroll ke atas -> tampilkan header
                setShowHeader(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "doa"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
            }));
            setDoaList(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleAmin = async (id) => {
        const ref = doc(db, "doa", id);
        await updateDoc(ref, { aminCount: increment(1) });
        setLiked((prev) => ({ ...prev, [id]: true }));
    };

    const handleRepeat = (doaText) => {
        localStorage.setItem("draftDoa", doaText);
        window.location.href = "/doa/add"; // langsung pindah ke halaman add
    };


    const filteredDoa = doaList
        .filter(
            (doa) =>
                doa.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doa.doa?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) =>
            sortAsc
                ? a.createdAt - b.createdAt // lama → baru
                : b.createdAt - a.createdAt // baru → lama
        );

    return (
        <div className="min-h-screen pb-16 relative">
            <BottomNav />
            {/* Header */}
            <div className={`fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 transition-transform duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}>
                <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-3">
                    <Link to="/" className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]">
                        <i className="ri-arrow-left-line"></i> Do'a
                    </Link>
                    <Link to="/settings">
                        <button className="text-[#355485]">
                            <i className="ri-settings-5-line text-xl"></i>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Search */}
            <div className="max-w-xl mx-auto px-3 border-x border-gray-200 pt-[60px] mb-3">
                <div className="relative">
                    <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                        type="text"
                        placeholder="Cari nama atau doa..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* List Doa */}
            <div className="max-w-xl mx-auto px-3 border-x border-gray-200">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="font-semibold text-[#355485]">Doa-doa dari Saudaramu</h2>
                    <button
                        onClick={() => setSortAsc(!sortAsc)}
                        className="text-[#355485] hover:text-[#4f90c6] transition"
                        title={sortAsc ? "Urutkan terbaru" : "Urutkan terlama"}
                    >
                        <i className="ri-arrow-up-down-line text-lg"></i>
                    </button>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <i className="ri-loader-2-line text-2xl animate-spin mb-2"></i>
                        <p className="text-sm">Memuat data doa...</p>
                    </div>
                ) : filteredDoa.length > 0 ? (
                    <div className="space-y-3">
                        {filteredDoa.map((doa) => (
                            <div
                                key={doa.id}
                                className="rounded-2xl border border-[#cbdde9] bg-white p-4"
                            >
                                {/* Header */}
                                <div className="flex items-center mb-2">
                                    <img
                                        src="https://cdn-icons-png.freepik.com/512/7718/7718888.png"
                                        alt="profile"
                                        className="w-9 h-9 rounded-full mr-3"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {highlightText(doa.nama || "Anonim", searchTerm)}
                                        </p>
                                        <p className="text-[13px] text-gray-500">
                                            {timeAgo(doa.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Doa */}
                                <p className="text-sm text-gray-700 mb-1.5">
                                    {highlightText(doa.doa, searchTerm)}
                                </p>
                                <hr />
                                {/* Actions */}
                                <div className="flex justify-between items-center mt-1.5 text-[#355485] -mb-2">
                                    <button
                                        onClick={() => handleAmin(doa.id)}
                                        className="flex items-center gap-1 text-sm font-medium"
                                    >
                                        <i
                                            className={`ri-heart-line ${liked[doa.id] ? "text-red-500" : "text-gray-500"
                                                }`}
                                        ></i>
                                        {doa.aminCount || 0} Aamiin
                                    </button>
                                    {/* Kanan: icon actions */}
                                    <div className="flex items-center gap-3">
                                        <button className="flex items-center text-sm font-medium">
                                            <i className="ri-bookmark-line"></i>
                                        </button>
                                        <button
                                            onClick={() => handleRepeat(doa.doa)}
                                            className="flex items-center text-sm font-medium"
                                        >
                                            <i className="ri-repeat-2-line"></i>
                                        </button>

                                        <button className="flex items-center text-sm font-medium">
                                            <i className="ri-share-line"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 py-10">Belum ada doa</p>
                )}
            </div>

            {/* Floating Action Button */}
            <Link
                to="/doa/add"
                className="fixed bottom-[70px] right-6 bg-[#355485] hover:bg-[#2a3b5c] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition"
            >
                <i className="ri-add-line text-2xl"></i>
            </Link>
        </div>
    );
}

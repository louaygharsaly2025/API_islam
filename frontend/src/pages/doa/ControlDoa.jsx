import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

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

/* ---------- Main ---------- */
export default function ControlDoa() {
    const [doaList, setDoaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoa, setSelectedDoa] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "doa"), (snapshot) => {
            const data = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
                createdAt: d.data().createdAt?.toDate(),
            }));
            setDoaList(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // Scroll behavior untuk header
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY) {
                setShowHeader(false);
            } else {
                setShowHeader(true);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const confirmDelete = (doa) => setSelectedDoa(doa);

    const handleDelete = async () => {
        if (!selectedDoa) return;
        setDeleting(true);
        try {
            await deleteDoc(doc(db, "doa", selectedDoa.id));
            setSelectedDoa(null);
        } catch (err) {
            console.error("Error hapus doa:", err);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Header */}
            <div
                className={`fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 transition-transform duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"
                    }`}
            >
                <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-3">
                    <Link
                        to="/listmenu"
                        className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]"
                    >
                        <i className="ri-arrow-left-line"></i> Control Doa
                    </Link>
                    <Link to="/settings">
                        <button className="text-[#355485]">
                            <i className="ri-settings-5-line text-xl"></i>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Konten */}
            <div className="max-w-xl mx-auto px-4 border-x border-gray-200 pt-[70px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <i className="ri-loader-2-line text-3xl animate-spin mb-2"></i>
                        <p className="text-sm">Memuat semua doa...</p>
                    </div>
                ) : doaList.length > 0 ? (
                    <div className="flex flex-col gap-4 pb-6">
                        {doaList.map((doa) => (
                            <div
                                key={doa.id}
                                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 relative"
                            >
                                <button
                                    onClick={() => confirmDelete(doa)}
                                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                                >
                                    <i className="ri-delete-bin-5-line text-lg"></i>
                                </button>
                                <p className="font-semibold text-gray-800">
                                    {doa.nama || "Anonim"}
                                </p>
                                <p className="text-xs text-gray-500 mb-2">
                                    {timeAgo(doa.createdAt)}
                                </p>
                                <p className="text-sm text-gray-700 leading-relaxed text-justify">
                                    {doa.doa}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 py-12">Belum ada doa</p>
                )}
            </div>

            {/* Modal Konfirmasi */}
            {selectedDoa && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setSelectedDoa(null)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-fadeIn">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Hapus Doa
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Yakin ingin menghapus doa dari{" "}
                                <span className="font-semibold">
                                    {selectedDoa.nama || "Anonim"}
                                </span>
                                ?
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedDoa(null)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-70"
                                >
                                    {deleting ? (
                                        <i className="ri-loader-2-line animate-spin"></i>
                                    ) : (
                                        "Hapus"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

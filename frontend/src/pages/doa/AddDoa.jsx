import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, serverTimestamp } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddDoa() {
    const [nama, setNama] = useState("");
    const [doa, setDoa] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // 🔑 Cek apakah ada draft dari repeat
    useEffect(() => {
        const draft = localStorage.getItem("draftDoa");
        if (draft) {
            setDoa(draft);
            localStorage.removeItem("draftDoa"); // hapus biar ga keisi terus
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!doa.trim()) return;

        setLoading(true);
        try {
            await addDoc(collection(db, "doa"), {
                nama: anonymous ? "Anonymous" : nama || "Anonymous",
                doa,
                createdAt: serverTimestamp(),
                aminCount: 0,
            });
            setShowModal(true);

            setTimeout(() => {
                setShowModal(false);
                navigate("/doa");
            }, 1500);
        } catch (err) {
            console.error("Error tambah doa:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-4">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
                <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-3">
                    <Link
                        to="/doa"
                        className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]"
                    >
                        <i className="ri-arrow-left-line"></i> Tambah Doa
                    </Link>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-xl mx-auto px-3 border-x border-gray-200 pt-[70px]">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nama */}
                    <div>
                        <input
                            type="text"
                            placeholder="Nama kamu..."
                            className="w-full p-2 border rounded-lg"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            disabled={anonymous}
                        />
                        <label className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={anonymous}
                                onChange={() => setAnonymous(!anonymous)}
                            />
                            Kirim sebagai Anonymous
                        </label>
                    </div>

                    {/* Doa */}
                    <textarea
                        rows="4"
                        placeholder="Tulis doa kamu..."
                        className="w-full p-3 border rounded-lg"
                        value={doa}
                        onChange={(e) => setDoa(e.target.value)}
                        required
                    ></textarea>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#355485] text-white py-2 rounded-lg hover:bg-[#2a3b5c] transition"
                    >
                        {loading ? (
                            <i className="ri-loader-2-line animate-spin"></i>
                        ) : (
                            "Kirim Doa"
                        )}
                    </button>
                </form>
            </div>

            {/* Modal notif */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white px-6 py-4 rounded-xl shadow text-center">
                        <p className="text-[#355485] font-semibold">
                            Doa berhasil dibuat ✅
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

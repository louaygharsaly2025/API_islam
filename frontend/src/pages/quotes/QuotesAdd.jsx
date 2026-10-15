import { useState, useEffect } from "react";
import { myQuotesCollection } from "../../firebase";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { Link } from "react-router-dom";

const QuotesAdd = () => {
    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
    const [category, setCategory] = useState("motivation");
    const [isLoading, setIsLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    // 🔹 History state
    const [quoteHistory, setQuoteHistory] = useState([]);
    const [selectedAuthorPreset, setSelectedAuthorPreset] = useState("");

    // 🔹 Header scroll hide
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // 🔹 Load history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem("quoteHistory");
        if (savedHistory) {
            setQuoteHistory(JSON.parse(savedHistory));
        }
    }, []);

    // 🔹 Save history to localStorage
    const saveToHistory = (newQuote) => {
        const updatedHistory = [newQuote, ...quoteHistory].slice(0, 10); // Simpan max 10 history
        setQuoteHistory(updatedHistory);
        localStorage.setItem("quoteHistory", JSON.stringify(updatedHistory));
    };

    // 🔹 Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setShowHeader(currentScrollY < lastScrollY);
            setLastScrollY(currentScrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // 🔹 Handle author preset
    const handleAuthorPreset = (preset) => {
        setSelectedAuthorPreset(preset);
        if (preset === "storythur") {
            setAuthor("storythur");
        } else if (preset === "fatkhurrhn") {
            setAuthor("fatkhurrhn");
        }
    };

    // 🔹 Handle manual author change
    const handleManualAuthor = (e) => {
        setAuthor(e.target.value);
        setSelectedAuthorPreset(""); // Reset preset jika manual
    };

    // 🔹 Show notification popup
    const showPopupNotification = (message, isError = false) => {
        setNotificationMessage(message);
        setShowNotification(isError ? "error" : "success");

        // Popup hilang setelah 2 detik
        setTimeout(() => {
            setShowNotification(false);
        }, 2000);
    };

    // 🔹 Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const newQuote = {
                text: quote,
                author: author,
                category: category,
                status: "approved",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                likes: 0,
                views: 0,
            };

            await addDoc(myQuotesCollection, newQuote);

            // Simpan ke history
            saveToHistory({
                text: quote,
                author: author,
                category: category,
                timestamp: new Date().toISOString()
            });

            // Reset form
            setQuote("");
            setAuthor("");
            setCategory("motivation");
            setSelectedAuthorPreset("");

            // Tampilkan notifikasi popup
            showPopupNotification("Quote berhasil ditambahkan!");

        } catch (error) {
            console.error("Error adding quote: ", error);
            showPopupNotification("Terjadi kesalahan saat menambahkan quote", true);
        } finally {
            setIsLoading(false);
        }
    };

    // 🔹 Load history item ke form
    const loadHistoryItem = (item) => {
        setQuote(item.text);
        setAuthor(item.author);
        setCategory(item.category);
        // Reset preset karena pakai history
        setSelectedAuthorPreset("");
    };

    // 🔹 Clear all history
    const clearHistory = () => {
        if (window.confirm("Hapus semua history?")) {
            setQuoteHistory([]);
            localStorage.removeItem("quoteHistory");
            showPopupNotification("History berhasil dihapus");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            

            {/* 🔹 Header */}
            <div
                className={`fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 transition-transform duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"
                    }`}
            >
                <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-3">
                    <Link
                        to="/quotes"
                        className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]"
                    >
                        <i className="ri-arrow-left-line"></i> Tambah Quote
                    </Link>
                    <Link to="/settings">
                        <button className="text-[#355485]">
                            <i className="ri-settings-5-line text-xl"></i>
                        </button>
                    </Link>
                </div>
            </div>

            {/* 🔹 Form */}
            <div className="max-w-xl mx-auto px-3 border-x border-gray-200 pt-[70px] pb-10">
                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Quote */}
                    <textarea
                        placeholder="Tulis quotenya di sini..."
                        id="quote"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-800 focus:ring-2 focus:ring-[#4f90c6] focus:border-[#4f90c6] transition"
                        value={quote}
                        onChange={(e) => setQuote(e.target.value)}
                        required
                    />

                    {/* Author with Radio Buttons */}
                    <div className="space-y-2">
                        <div className="flex gap-4 mb-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="authorPreset"
                                    value="storythur"
                                    checked={selectedAuthorPreset === "storythur"}
                                    onChange={() => handleAuthorPreset("storythur")}
                                    className="w-4 h-4 text-[#355485]"
                                />
                                <span className="text-sm text-gray-700">storythur</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="authorPreset"
                                    value="fatkhurrhn"
                                    checked={selectedAuthorPreset === "fatkhurrhn"}
                                    onChange={() => handleAuthorPreset("fatkhurrhn")}
                                    className="w-4 h-4 text-[#355485]"
                                />
                                <span className="text-sm text-gray-700">fatkhurrhn</span>
                            </label>
                        </div>

                        <input
                            placeholder="Tanpa '@' atau tulis manual"
                            type="text"
                            id="author"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#4f90c6] focus:border-[#4f90c6] transition"
                            value={author}
                            onChange={handleManualAuthor}
                            required
                        />
                    </div>

                    {/* Category */}
                    <select
                        id="category"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#4f90c6] focus:border-[#4f90c6] transition"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="motivation">Motivasi</option>
                        <option value="life">Reminder</option>
                        <option value="love">Cinta</option>
                        <option value="funny">Lucu</option>
                        <option value="other">Lainnya</option>
                    </select>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-[#355485] text-white rounded-xl font-medium flex items-center justify-center disabled:opacity-70 hover:bg-[#2a436c] transition"
                    >
                        {isLoading ? (
                            <>
                                <i className="ri-loader-4-line animate-spin mr-2"></i>
                                Menambahkan...
                            </>
                        ) : (
                            "Tambah Quote"
                        )}
                    </button>
                </form>

                {/* 🔹 History Section */}
                {quoteHistory.length > 0 && (
                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <i className="ri-history-line"></i>
                                History Quote
                            </h3>
                            <button
                                onClick={clearHistory}
                                className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                                <i className="ri-delete-bin-line"></i>
                                Hapus semua
                            </button>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {quoteHistory.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer"
                                    onClick={() => loadHistoryItem(item)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs text-gray-400">
                                            {new Date(item.timestamp).toLocaleString('id-ID')}
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                            {item.category === "motivation" ? "Motivasi" :
                                                item.category === "life" ? "Reminder" :
                                                    item.category === "love" ? "Cinta" :
                                                        item.category === "funny" ? "Lucu" : "Lainnya"}
                                        </span>
                                    </div>
                                    <p className="text-gray-800 text-sm mb-2 line-clamp-2">
                                        "{item.text}"
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                        — {item.author || "Anonymous"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        
        </div>
    );
};

export default QuotesAdd;
import { useState, useEffect } from "react";
import { myQuotesCollection } from "../../firebase";
import { getDocs, query, orderBy, doc, updateDoc, increment } from "firebase/firestore";
import { Link } from "react-router-dom";
import AddQuote from "../../components/AddQuote";
import BottomNav from "../../components/BottomNav";

/* ---------- Helpers ---------- */
const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    return text.split(regex).map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200">{part}</mark>
        ) : (
            part
        )
    );
};

const getCategoryLabel = (cat) => {
    switch (cat) {
        case "motivation": return "motivasi";
        case "life":
        case "wisdom": return "reminder";
        case "love": return "cinta";
        case "funny": return "lucu";
        default: return "lainnya";
    }
};

const generateQuoteImage = async (quote, author, category) => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // ukuran square
        canvas.width = 1080;
        canvas.height = 1080;

        // Pilih background berdasarkan author
        let bgImage = new Image();
        let bgUrl = "/img/bg-storythur.png"; // default

        if (author.toLowerCase() === "fatkhurrhn") {
            bgUrl = "/img/bg-fatkhurrhn.png";
        } else if (author.toLowerCase() === "storythur") {
            bgUrl = "/img/bg-storythur.png";
        }

        bgImage.crossOrigin = "Anonymous";
        bgImage.src = bgUrl;

        bgImage.onload = () => {
            // Gambar background
            ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

            // Setting untuk teks quote
            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle"; // INI KUNCI NYA!
            ctx.font = "52px Arial";

            const maxWidth = 900;
            const wrapped = wrapText(ctx, quote, maxWidth);
            const lineHeight = 70;

            // Hitung posisi Y awal untuk baris pertama
            const totalTextHeight = wrapped.length * lineHeight;
            const startY = (canvas.height - totalTextHeight) / 2 + (lineHeight / 2);

            wrapped.forEach((line, i) => {
                ctx.fillText(line, canvas.width / 2, startY + i * lineHeight);
            });

            resolve(canvas.toDataURL("image/png"));
        };

        bgImage.onerror = () => {
            console.error("Gagal load background image, menggunakan background putih");
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle"; // INI JUGA
            ctx.font = "52px Arial";

            const maxWidth = 900;
            const wrapped = wrapText(ctx, quote, maxWidth);
            const lineHeight = 70;
            const totalTextHeight = wrapped.length * lineHeight;
            const startY = (canvas.height - totalTextHeight) / 2 + (lineHeight / 2);

            wrapped.forEach((line, i) => {
                ctx.fillText(line, canvas.width / 2, startY + i * lineHeight);
            });

            resolve(canvas.toDataURL("image/png"));
        };
    });
};

// helper wrapText
function wrapText(ctx, text, maxWidth) {
    const words = text.split(" ");
    let line = "";
    const lines = [];
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line.trim());
            line = words[n] + " ";
        } else {
            line = testLine;
        }
    }
    lines.push(line.trim());
    return lines;
}

/* ---------- Main Component ---------- */
export default function QuotesList() {
    const [quotes, setQuotes] = useState([]);
    const [filteredQuotes, setFilteredQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const [quoteStates, setQuoteStates] = useState({});
    const [showSearch, setShowSearch] = useState(false);
    const [showFilterSheet, setShowFilterSheet] = useState(false);

    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [sharingId, setSharingId] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null); // state untuk loading download

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

    // fetch quotes
    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const q = query(myQuotesCollection, orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                const approved = data.filter((q) => q.status === "approved");
                setQuotes(approved);
                setFilteredQuotes(approved);

                const initState = {};
                approved.forEach((q) => {
                    initState[q.id] = {
                        copied: false,
                        isLiked: false,
                        likesCount: q.likes || 0,
                        isLiking: false,
                    };
                });
                setQuoteStates(initState);
            } catch (err) {
                console.error("Error fetch quotes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuotes();
    }, []);

    // filter search + kategori
    useEffect(() => {
        let filtered = [...quotes];
        if (searchTerm.trim()) {
            filtered = filtered.filter(
                (q) =>
                    q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    q.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedCategory !== "all") {
            filtered = filtered.filter((q) => q.category === selectedCategory);
        }
        setFilteredQuotes(filtered);
    }, [searchTerm, selectedCategory, quotes]);

    // like handler
    const handleLike = async (id) => {
        setQuoteStates((prev) => ({
            ...prev,
            [id]: { ...prev[id], isLiking: true, isLiked: true, likesCount: prev[id].likesCount + 1 }
        }));
        try {
            const ref = doc(myQuotesCollection, id);
            await updateDoc(ref, { likes: increment(1) });
        } catch (err) {
            console.error("Error like:", err);
            setQuoteStates((prev) => ({
                ...prev,
                [id]: { ...prev[id], isLiked: false, likesCount: prev[id].likesCount - 1 }
            }));
        } finally {
            setQuoteStates((prev) => ({
                ...prev,
                [id]: { ...prev[id], isLiking: false }
            }));
        }
    };

    // copy handler
    const handleCopy = (id, text, author) => {
        navigator.clipboard.writeText(`${text} — ${author}`);
        setQuoteStates((prev) => ({
            ...prev,
            [id]: { ...prev[id], copied: true }
        }));
        setTimeout(() => {
            setQuoteStates((prev) => ({
                ...prev,
                [id]: { ...prev[id], copied: false }
            }));
        }, 1500);
    };

    // share handler
    const handleShare = async (q) => {
        setSharingId(q.id);
        try {
            const dataUrl = await generateQuoteImage(q.text, q.author, q.category);

            const res = await fetch(dataUrl);
            const blob = await res.blob();
            const file = new File([blob], "quote.png", { type: "image/png" });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: "Quote",
                    text: `${q.text} — ${q.author}`,
                });
            } else {
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = "quote.png";
                link.click();
            }
        } catch (err) {
            console.error("Error sharing:", err);
            alert("Gagal membuat gambar, silakan coba lagi");
        } finally {
            setSharingId(null);
        }
    };

    // download handler - fitur baru
    const handleDownload = async (q) => {
        setDownloadingId(q.id);
        try {
            const dataUrl = await generateQuoteImage(q.text, q.author, q.category);

            // Membuat link download
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `quote_${q.author}_${Date.now()}.png`; // nama file dengan timestamp
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Error downloading:", err);
            alert("Gagal mendownload gambar, silakan coba lagi");
        } finally {
            setDownloadingId(null);
        }
    };

    const getDisplayMessage = () => {
        if (loading) return "Memuat quotes...";
        if ((searchTerm || selectedCategory !== "all") && filteredQuotes.length === 0) {
            return "Tidak ada quote yang ditemukan";
        }
        if (searchTerm || selectedCategory !== "all") {
            return `Menampilkan ${filteredQuotes.length} dari ${quotes.length} quotes`;
        }
        return `Total ${quotes.length} quotes tersedia`;
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setShowFilterSheet(false);
    };

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800">
            <AddQuote />
            <BottomNav />
            <div className={`fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 transition-transform duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}>
                <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-3">
                    <Link to="/" className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]">
                        <i className="ri-arrow-left-line"></i> Quotes
                    </Link>
                    <div className="flex items-center gap-4">
                        <button
                            className="text-[#355485]"
                            onClick={() => setShowSearch(!showSearch)}
                        >
                            <i className="ri-search-2-line text-xl"></i>
                        </button>
                        <button
                            className="text-[#355485]"
                            onClick={() => setShowFilterSheet(true)}
                        >
                            <i className="ri-equalizer-line text-xl"></i>
                        </button>
                    </div>
                </div>

                {showSearch && (
                    <div className="px-3 pb-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari quote atau author..."
                                className="w-full p-2 pl-4 rounded-lg border border-gray-300 bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                                >
                                    <i className="ri-close-line"></i>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Sheet untuk Filter Kategori */}
            {showFilterSheet && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setShowFilterSheet(false)}
                    ></div>

                    <div className="relative bg-white rounded-t-2xl w-full max-w-full p-5 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold">Filter by Category</h2>
                            <button
                                onClick={() => setShowFilterSheet(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="grid gap-3">
                            <button
                                onClick={() => handleCategorySelect("all")}
                                className={`p-4 rounded-lg text-left ${selectedCategory === "all" ? "bg-[#355485] text-white" : "bg-gray-100"}`}
                            >
                                Semua Kategori
                            </button>
                            <button
                                onClick={() => handleCategorySelect("motivation")}
                                className={`p-4 rounded-lg text-left ${selectedCategory === "motivation" ? "bg-[#355485] text-white" : "bg-gray-100"}`}
                            >
                                Motivasi
                            </button>
                            <button
                                onClick={() => handleCategorySelect("life")}
                                className={`p-4 rounded-lg text-left ${selectedCategory === "life" ? "bg-[#355485] text-white" : "bg-gray-100"}`}
                            >
                                Reminder
                            </button>
                            <button
                                onClick={() => handleCategorySelect("love")}
                                className={`p-4 rounded-lg text-left ${selectedCategory === "love" ? "bg-[#355485] text-white" : "bg-gray-100"}`}
                            >
                                Cinta
                            </button>
                            <button
                                onClick={() => handleCategorySelect("funny")}
                                className={`p-4 rounded-lg text-left ${selectedCategory === "funny" ? "bg-[#355485] text-white" : "bg-gray-100"}`}
                            >
                                Lucu
                            </button>
                            <button
                                onClick={() => handleCategorySelect("other")}
                                className={`p-4 rounded-lg text-left ${selectedCategory === "other" ? "bg-[#355485] text-white" : "bg-gray-100"}`}
                            >
                                Lainnya
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 pt-[60px] pb-10">
                <div className="px-1 mt-3 mb-2">
                    <div className="text-sm text-gray-500 mb-2">{getDisplayMessage()}</div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="relative flex gap-4 px-1 mt-4 border-b mb-3 border-gray-200 pb-4">
                                <div className="flex-shrink-0 mr-[-4px]">
                                    <div className="w-11 h-11 rounded-full bg-gray-200 animate-pulse"></div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                                        </div>
                                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                                    </div>

                                    <div className="mt-2 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-hidden">
                        {filteredQuotes.length > 0 ? (
                            filteredQuotes.map((q) => {
                                const state = quoteStates[q.id] || {};
                                return (
                                    <div
                                        key={q.id}
                                        className="relative flex gap-4 px-1 mt-4 border-b mb-3 border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors pb-2"
                                    >
                                        <div className="flex-shrink-0 mr-[-4px]">
                                            <img
                                                src="https://cdn-icons-png.freepik.com/512/7718/7718888.png "
                                                alt="Profile"
                                                className="w-11 h-11 rounded-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[14px] font-semibold text-gray-800 leading-tight mb-[-5px]">
                                                        {highlightText(q.author, searchTerm)}
                                                    </p>
                                                    <span className="text-[12px] text-gray-500">
                                                        #{getCategoryLabel(q.category)}
                                                    </span>
                                                </div>
                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <i className="ri-more-line text-[18px]"></i>
                                                </button>
                                            </div>

                                            <p
                                                className="text-gray-800 mr-1 text-[15px] leading-relaxed cursor-pointer"
                                                onClick={() => handleCopy(q.id, q.text, q.author)}
                                            >
                                                {highlightText(q.text, searchTerm)}
                                            </p>

                                            <div className="flex items-center justify-between mt-1 mb-2">
                                                {/* Kiri: tombol like, copy, share */}
                                                <div className="flex items-center gap-2 text-gray-500 text-[14px]">
                                                    <button
                                                        onClick={() => handleLike(q.id)}
                                                        disabled={state.isLiking}
                                                        className="flex items-center gap-1 group hover:text-red-500"
                                                    >
                                                        <i
                                                            className={`ri-heart-${state.isLiked ? "fill" : "line"} ${state.isLiked ? "text-red-500" : ""
                                                                }`}
                                                        ></i>
                                                        <span className="text-xs">{state.likesCount}</span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleCopy(q.id, q.text, q.author)}
                                                        className="hover:text-gray-700"
                                                    >
                                                        <i className="ri-clipboard-line"></i>
                                                    </button>

                                                    <button
                                                        onClick={() => handleShare(q)}
                                                        disabled={sharingId === q.id}
                                                        className="hover:text-gray-700"
                                                    >
                                                        {sharingId === q.id ? (
                                                            <i className="ri-loader-4-line animate-spin"></i>
                                                        ) : (
                                                            <i className="ri-share-line"></i>
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Kanan: tombol download + notifikasi copied */}
                                                <div className="flex items-center gap-2">
                                                    {state.copied && (
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                                            Berhasil Disalin!
                                                        </span>
                                                    )}

                                                    <button
                                                        onClick={() => handleDownload(q)}
                                                        disabled={downloadingId === q.id}
                                                        className="text-gray-500 hover:text-green-600"
                                                    >
                                                        {downloadingId === q.id ? (
                                                            <i className="ri-loader-4-line animate-spin"></i>
                                                        ) : (
                                                            <i className="ri-download-line"></i>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-gray-500">Tidak ada quote</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
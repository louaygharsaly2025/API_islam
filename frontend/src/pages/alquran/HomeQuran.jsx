import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import QuranTabs from "../../components/quran/QuranTabs";
import SearchBar from "../../components/quran/SearchBar";
import SurahList from "../../components/quran/SurahList";
import JuzList from "../../components/quran/JuzList";
import BookmarkList from "../../components/quran/Bookmark"; // ganti komponen bookmark
import BottomNav from "../../components/BottomNav";

export default function HomeQuran() {
  const [surahList, setSurahList] = useState([]);
  const [juzList, setJuzList] = useState([]);
  const [bookmarkList, setBookmarkList] = useState([]);
  const [activeTab, setActiveTab] = useState("surah");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isJuzLoading, setIsJuzLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  const { tab } = useParams();
  const navigate = useNavigate();

  // Sync tab aktif dengan URL
  useEffect(() => {
    if (tab && ["surah", "juz", "bookmark"].includes(tab)) {
      setActiveTab(tab);
    } else {
      navigate("/quran/surah", { replace: true });
    }
  }, [tab, navigate]);

  useEffect(() => {
    document.title = "Al Qur'an - Islamic";

    const loadSurahList = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://equran.id/api/v2/surat");
        const data = await response.json();

        if (data && data.data) {
          const transformedData = data.data.map((surah) => ({
            number: surah.nomor,
            name: {
              transliteration: { id: surah.namaLatin },
              translation: { id: surah.arti },
              short: surah.nama,
            },
            numberOfVerses: surah.jumlahAyat,
            revelation: { id: surah.tempatTurun },
            description: surah.deskripsi,
            audio: surah.audioFull,
          }));
          setSurahList(transformedData);
        }
      } catch (error) {
        console.error("Error loading surah data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSurahList();
  }, []);

  useEffect(() => {
    if (activeTab === "juz" && juzList.length === 0) loadJuzList();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "bookmark" && bookmarkList.length === 0) loadBookmarkList();
  }, [activeTab]);

  const loadJuzList = async () => {
    try {
      setIsJuzLoading(true);
      const response = await fetch("https://api.myquran.com/v2/quran/juz/semua");
      const data = await response.json();
      if (data && data.data) setJuzList(data.data);
    } catch (error) {
      console.error("Error loading juz data:", error);
    } finally {
      setIsJuzLoading(false);
    }
  };

  const loadBookmarkList = async () => {
    try {
      setIsBookmarkLoading(true);
      // sementara pakai local data
      const bookmarkData = [
        {
          id: 1,
          title: "Surah Al-Fatihah",
          desc: "Bookmark bacaan harian",
          icon: "ri-bookmark-line",
        },
        {
          id: 2,
          title: "Surah Yasin",
          desc: "Bookmark untuk dibaca malam",
          icon: "ri-bookmark-line",
        },
      ];
      setBookmarkList(bookmarkData);
    } catch (error) {
      console.error("Error loading bookmark data:", error);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  // Render konten
  const renderContent = () => {
    switch (activeTab) {
      case "surah":
        return (
          <SurahList
            surahList={surahList}
            isLoading={isLoading}
            searchQuery={searchQuery}
          />
        );
      case "juz":
        return (
          <JuzList
            juzList={juzList}
            isJuzLoading={isJuzLoading}
            searchQuery={searchQuery}
          />
        );
      case "bookmark":
        return (
          <BookmarkList
            bookmarkList={bookmarkList}
            isBookmarkLoading={isBookmarkLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-2 bg-[#fcfeff]">
      <div className="max-w-xl mx-auto px-3 border-x border-gray-200">
        {/* Header */}
        <div className="fixed top-0 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 border-b border-gray-200 bg-white px-3 py-3">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-[15px] font-semibold text-[#355485]"
            >
              <i className="ri-arrow-left-line"></i>
              Al-Qur'an
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/quran/perhalaman">
                <button className="text-[#355485]">
                  <i className="ri-book-open-line text-xl"></i>
                </button>
              </Link>
              <button className="text-[#355485]">
                <i className="ri-filter-line text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-[70px]">
          {/* Tabs */}
          <QuranTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Search hanya untuk surah/juz */}
          {(activeTab === "surah" || activeTab === "juz") && (
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeTab={activeTab}
            />
          )}

          {/* Konten */}
          {renderContent()}
        </div>
      </div>
      <BottomNav/>
    </div>
  );
}

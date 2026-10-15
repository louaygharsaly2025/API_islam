import React from "react";
import { useNavigate } from "react-router-dom";

const QuranTabs = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/quran/${tab}`);
  };

  const tabStyle = (tab) =>
    `flex-1 py-2 text-center font-medium rounded-lg transition-all ${activeTab === tab
      ? "bg-[#355485] text-white shadow-md"
      : "text-[#355485] hover:text-[#4f90c6]"
    }`;

  return (
    <div className="flex gap-2 bg-[#f0f1f2] p-2 rounded-xl mb-2">
      <button className={tabStyle("surah")} onClick={() => handleTabChange("surah")}>
        Surah
      </button>
      <button className={tabStyle("juz")} onClick={() => handleTabChange("juz")}>
        Juz
      </button>
      <button className={tabStyle("bookmark")} onClick={() => handleTabChange("bookmark")}>
        Bookmark
      </button>
    </div>
  );
};

export default QuranTabs;

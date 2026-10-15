
import React, { useState } from "react";
import GamesList from "./GameList";
import History from "./History";
import { Link } from "react-router-dom";

export default function GameHome() {
  const [activeTab, setActiveTab] = useState("games");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
          <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-3">
            <Link
              to="/"
              className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]"
            >
              <i className="ri-arrow-left-line"></i> Game Have Fun
            </Link>
            <button className="text-[#355485]">
              <i className="ri-settings-5-line text-xl"></i>
            </button>
          </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-200">
          <button
            onClick={() => setActiveTab("games")}
            className={`flex-1 py-3 text-center text-sm font-medium transition ${activeTab === "games"
                ? "text-[#355485] border-b-2 border-[#355485]"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Games
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 text-center text-sm font-medium transition ${activeTab === "history"
                ? "text-[#355485] border-b-2 border-[#355485]"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto pt-[120px] px-3">
        {activeTab === "games" ? <GamesList /> : <History />}
      </div>
    </div>
  );
}

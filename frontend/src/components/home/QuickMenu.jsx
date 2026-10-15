import React from 'react';
import { Link } from 'react-router-dom';

const menuItems = [
  { to: "/quran", icon: "📖", label: "Qur'an", color: "text-green-500" },
  { to: "/dzikir", icon: "📿", label: "Dzikir", color: "text-blue-500" },
  { to: "/doa", icon: "🙏", label: "Doa", color: "text-purple-500" },
  { to: "/kiblat", icon: "🕋", label: "Kiblat", color: "text-yellow-500" },
  { to: "/jadwal-sholat", icon: "🕌", label: "Sholat", color: "text-indigo-500" },
  { to: "/asmaul-husna", icon: "✨", label: "More", color: "text-pink-500" },
];

export default function QuickMenu() {
  return (
    <div className="mb-6 hidden md:block">
      <div className="flex overflow-x-auto space-x-3 pb-2 no-scrollbar md:grid md:grid-cols-6 md:gap-4 md:space-x-0 md:overflow-visible">
        {menuItems.map(item => (
          <Link 
            key={item.to} 
            to={item.to} 
            className="flex flex-col items-center min-w-[80px] p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`text-2xl md:text-3xl ${item.color} mb-1`}>
              {item.icon}
            </div>
            <span className="text-xs md:text-sm text-center text-gray-700">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
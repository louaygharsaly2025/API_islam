import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, activeTab }) => {
  return (
    <div className="p-2 border-b border-gray-200">
      <div className="relative">
        <i className="ri-search-line absolute left-3 top-3 text-gray-400"></i>
        <input
          type="text"
          placeholder={`Cari ${activeTab === 'surah' ? 'nama surah' : 'juz'}...`}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:ring-green-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
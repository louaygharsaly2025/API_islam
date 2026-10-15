import React from 'react';
import { Link } from 'react-router-dom';

const JuzList = ({ juzList, isJuzLoading, searchQuery }) => {
  // Filter juz berdasarkan pencarian
  const filteredJuz = juzList.filter(juz => {
    return (
      juz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      juz.name_start_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      juz.name_end_id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Jumlah kata Arabic yang ditampilkan per juz
  const getWordCountByJuz = (juzNumber) => {
    const wordCountMap = {
      1: 2, 2: 2, 3: 3, 4: 3, 5: 2, 6: 3,
      7: 2, 8: 3, 9: 3, 10: 2, 11: 3, 12: 4,
      13: 3, 14: 3, 15: 2, 16: 3, 17: 2, 18: 2,
      19: 3, 20: 3, 21: 3, 22: 3, 23: 3, 24: 3,
      25: 3, 26: 3, 27: 3, 28: 2, 29: 2, 30: 8
    };
    return wordCountMap[juzNumber] || 2;
  };

  // Ambil kata pertama Arabic sesuai mapping
  const getArabicWords = (arabicText, juzNumber) => {
    if (!arabicText) return '';
    const wordCount = getWordCountByJuz(parseInt(juzNumber));
    const words = arabicText.split(' ').filter(word => word.trim() !== '');
    return words.slice(0, wordCount).join(' ');
  };

  if (isJuzLoading) {
    return <div className="p-4 text-center text-[#6d9bbc]">Memuat data juz...</div>;
  }

  if (filteredJuz.length === 0) {
    return <div className="p-4 text-center text-[#6d9bbc]">Juz tidak ditemukan</div>;
  }

  return (
    <div className="bg-[#fcfeff] rounded-xl mb-[60px] shadow-sm divide-y divide-[#f0f1f2]">
      {filteredJuz.map(juz => (
        <div
          key={juz.number}
          className="block hover:bg-[#f0f1f2] transition-colors duration-200"
        >
          <div className="flex items-center px-2 py-3">
            {/* Nomor Juz */}
            <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#cbdde9] text-[#355485] font-semibold shadow-sm">
              {juz.number}
            </div>

            {/* Info Juz */}
            <Link
              to={`/quran/juz/${juz.number}`}
              className="flex w-full items-center justify-between"
            >
              {/* Kiri: Nama Juz */}
              <div className="flex-1">
                <h3 className="font-semibold text-[#355485]">
                  Juz Ke {juz.number}
                </h3>
                <p className="text-xs text-[#6d9bbc]">
                  {juz.name_start_id} {juz.verse_start} • {juz.name_end_id} {juz.verse_end}
                </p>
              </div>

              {/* Kanan: Potongan Arabic */}
              <p className="font-mushaf text-xl text-[#355485] text-right ml-2">
                {getArabicWords(juz.ayat_arab, juz.number)}
              </p>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JuzList;

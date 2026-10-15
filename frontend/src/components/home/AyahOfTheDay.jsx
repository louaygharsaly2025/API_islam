// src/components/home/AyahOfTheDay.jsx
import React, { useState, useEffect, useCallback } from 'react';

// Fallback ayah data
const FALLBACK_AYAH = {
  surahNumber: 112,
  surahName: "Al-Ikhlas",
  ayahNumber: 1,
  arabicText: "قُلْ هُوَ اللّٰهُ اَحَدٌۚ",
  translation: "Katakanlah (Muhammad), 'Dialah Allah, Yang Maha Esa.'",
  tafsir: "Allah menyuruh Nabi Muhammad menjawab pertanyaan tentang sifat Tuhannya"
}

export default function AyahOfTheDay() {
  const [randomAyah, setRandomAyah] = useState(FALLBACK_AYAH);
  const [showTafsir, setShowTafsir] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Random ayat
  const getRandomAyah = useCallback(async () => {
    try {
      const randomSurah = Math.floor(Math.random() * 114) + 1;
      const response = await fetch(`/data/surah/${randomSurah}.json`);
      if (!response.ok) throw new Error('Failed to fetch surah');

      const surahData = await response.json();
      const surah = surahData[randomSurah.toString()];
      const totalAyah = parseInt(surah.number_of_ayah);
      const randomAyahNumber = Math.floor(Math.random() * totalAyah) + 1;

      setRandomAyah({
        surahNumber: surah.number,
        surahName: surah.name_latin,
        ayahNumber: randomAyahNumber,
        arabicText: surah.text[randomAyahNumber.toString()],
        translation: surah.translations.id.text[randomAyahNumber.toString()],
        tafsir: surah.tafsir.id.kemenag.text[randomAyahNumber.toString()]
      });
    } catch (error) {
      console.error("Error fetching random ayah:", error);
      setRandomAyah(FALLBACK_AYAH);
    }
  }, []);

  // Ambil ayat random
  useEffect(() => {
    getRandomAyah();
  }, [getRandomAyah]);

  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-4 shadow-sm">
        <p className="text-2xl text-center text-gray-800 font-mushaf leading-loose">
          {randomAyah.arabicText}
        </p>
        <div className="text-xs text-center text-gray-600 mt-3">
          {randomAyah.surahName} : {randomAyah.ayahNumber} |
          <span 
            onClick={() => setShowTafsir(true)} 
            className="cursor-pointer hover:text-blue-600 mx-1"
          >
            Tafsir
          </span> -
          <span 
            onClick={() => setShowTranslation(true)} 
            className="cursor-pointer hover:text-blue-600 mx-1"
          >
            Terjemah
          </span>
        </div>
      </div>

      {/* Modal Tafsir */}
      {showTafsir && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Tafsir {randomAyah.surahName} Ayat {randomAyah.ayahNumber}</h3>
              <button className="text-gray-500 hover:text-gray-700 text-xl" onClick={() => setShowTafsir(false)}>&times;</button>
            </div>
            <p className="text-gray-700 text-sm text-justify">{randomAyah.tafsir}</p>
          </div>
        </div>
      )}

      {/* Modal Terjemah */}
      {showTranslation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Terjemah {randomAyah.surahName} Ayat {randomAyah.ayahNumber}</h3>
              <button className="text-gray-500 hover:text-gray-700 text-xl" onClick={() => setShowTranslation(false)}>&times;</button>
            </div>
            <p className="text-xl text-center text-gray-800 font-uthmani mb-4">{randomAyah.arabicText}</p>
            <p className="text-gray-700 text-sm text-justify">"{randomAyah.translation}"</p>
          </div>
        </div>
      )}
    </>
  );
}
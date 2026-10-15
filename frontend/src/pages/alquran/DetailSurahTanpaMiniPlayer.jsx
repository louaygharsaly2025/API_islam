import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

export default function DetailPerSurah() {
    const { id, verseNumber } = useParams()
    const navigate = useNavigate()

    /* ---------- state lama ---------- */
    const [surahData, setSurahData] = useState(null)
    const [verses, setVerses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showFilterModal, setShowFilterModal] = useState(false)
    const [allSurahs, setAllSurahs] = useState([])
    const [selectedSurah, setSelectedSurah] = useState(id)
    const [selectedVerse, setSelectedVerse] = useState(verseNumber || '')
    const [allDataReady, setAllDataReady] = useState(false)
    const [showNavback, setShowNavback] = useState(true)
    const lastScrollY = useRef(0)
    const navbackRef = useRef(null)

    /* ---------- state baru ---------- */
    // bottom-sheet
    const [sheetSurah, setSheetSurah] = useState(null)
    const [sheetVerse, setSheetVerse] = useState(null)
    // mini-player
    const audioRef = useRef(null)
    const [currentAudio, setCurrentAudio] = useState(null)
    const [playingVerse, setPlayingVerse] = useState(null)

    /* ---------- fetch data lama (tanpa perubahan) ---------- */
    useEffect(() => {
        const fetchAllSurahs = async () => {
            try {
                const response = await fetch('https://api.myquran.com/v2/quran/surat/semua')
                const result = await response.json()
                if (result.status) setAllSurahs(result.data)
            } catch (err) {
                console.error('Gagal mengambil data surah:', err)
            }
        }
        fetchAllSurahs()
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setShowNavback(false)
            } else {
                setShowNavback(true)
            }
            lastScrollY.current = currentScrollY
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const fetchSurahData = async () => {
            try {
                setIsLoading(true)
                setAllDataReady(false)
                setError(null)

                const surahInfoResponse = await fetch(`https://api.myquran.com/v2/quran/surat/${id}`)
                const surahInfoResult = await surahInfoResponse.json()
                if (!surahInfoResult.status) throw new Error('Failed to fetch surah info')
                setSurahData(surahInfoResult.data)
                setSelectedSurah(id)

                const numberOfVerses = parseInt(surahInfoResult.data.number_of_verses)
                const ayatPromises = []
                for (let i = 1; i <= numberOfVerses; i++) {
                    ayatPromises.push(
                        fetch(`https://api.myquran.com/v2/quran/ayat/${id}/${i}`)
                            .then(response => response.json())
                    )
                }
                const ayatResults = await Promise.all(ayatPromises)
                const transformedVerses = ayatResults.map(result => ({
                    number: { inSurah: parseInt(result.data[0].ayah) },
                    text: { arab: result.data[0].arab },
                    translation: { id: result.data[0].text },
                    latin: result.data[0].latin,
                    audio: result.data[0].audio,
                    juz: result.data[0].juz
                }))
                setVerses(transformedVerses)
                document.title = `${surahInfoResult.data.name_id} - Islamic`

                if (verseNumber) {
                    setTimeout(() => {
                        const navHeight = navbackRef.current?.offsetHeight || 64
                        const element = document.getElementById(`verse-${verseNumber}`)
                        if (element) {
                            const offsetTop = element.offsetTop - navHeight - 4
                            window.scrollTo({ top: offsetTop, behavior: 'smooth' })
                            element.classList.add('bg-yellow-100')
                            setTimeout(() => element.classList.remove('bg-yellow-100'), 3000)
                        }
                    }, 500)
                } else {
                    window.scrollTo(0, 0)
                }
                setAllDataReady(true)
            } catch (err) {
                setError(err.message)
                document.title = 'Detail Surah - Islamic'
            } finally {
                setIsLoading(false)
            }
        }
        fetchSurahData()
    }, [id, verseNumber])

    const navigateToSurah = (surahId, verseId = '') => {
        navigate(`/quran/surah/${surahId}${verseId ? `/${verseId}` : ''}`)
        window.scrollTo(0, 0)
    }

    const handleFilter = () => {
        setShowFilterModal(false)
        navigateToSurah(selectedSurah, selectedVerse)
    }

    /* ---------- fungsi baru ---------- */
    const openSheet = (surah, verse) => {
        setSheetSurah(surah)
        setSheetVerse(verse)
    }

    const closeSheet = () => {
        setSheetSurah(null)
        setSheetVerse(null)
    }

    const playAudio = () => {
        if (!audioRef.current) return
        const audioUrl = sheetVerse.audio
        if (currentAudio !== audioUrl) {
            audioRef.current.src = audioUrl
            audioRef.current.play()
            setCurrentAudio(audioUrl)
            setPlayingVerse(sheetVerse.number.inSurah)
        } else {
            audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause()
        }
    }

    // auto-next ayat
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return
        const handleEnded = () => {
            const currentIndex = verses.findIndex(v => v.number.inSurah === playingVerse)
            const next = verses[currentIndex + 1]
            if (next) {
                audio.src = next.audio
                audio.play()
                setCurrentAudio(next.audio)
                setPlayingVerse(next.number.inSurah)
            } else {
                // habis
                setCurrentAudio(null)
                setPlayingVerse(null)
            }
        }
        audio.addEventListener('ended', handleEnded)
        return () => audio.removeEventListener('ended', handleEnded)
    }, [playingVerse, verses])

    /* ---------- render ---------- */
    if (!allDataReady) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-xl px-4 md:mb-0 mb-[70px] border-x border-gray-200 bg-white min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <i className="ri-loader-2-line text-2xl text-blue-700 mb-2"></i>
                        <p className="text-gray-600">Memuat surah...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-xl px-4 md:mb-0 pt-20 mb-[70px] border-x border-gray-200 bg-white min-h-screen">
                    <div className="p-4 text-center text-red-500">Error: {error}</div>
                    <div className="text-center mt-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Coba Lagi
                        </button>
                    </div>
                    <div className="text-center mt-4">
                        <Link to="/" className="text-gray-500 hover:text-gray-700">
                            Kembali ke Halaman Utama
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-2 bg-gray-50">
            {/* Modal Filter (tanpa perubahan) */}
            {showFilterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-semibold text-lg">Pilih Surah & Ayat</h3>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[60vh]">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Surah</label>
                                <select
                                    value={selectedSurah}
                                    onChange={(e) => {
                                        setSelectedSurah(e.target.value)
                                        setSelectedVerse("")
                                    }}
                                    className="w-full p-2 font-mushaf border border-gray-300 rounded-md"
                                >
                                    {Array.isArray(allSurahs) && allSurahs.length ? (
                                        allSurahs.map(surah => (
                                            <option key={surah.number} value={surah.number}>
                                                {surah.number}. {surah.name_id} ({surah.name_short})
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Loading surat...</option>
                                    )}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pilih Ayat{" "}
                                    <span className="text-gray-500 text-xs">
                                        (1 - {surahData?.number_of_verses})
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={surahData?.number_of_verses}
                                    value={selectedVerse}
                                    onChange={(e) => setSelectedVerse(e.target.value)}
                                    placeholder="0"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleFilter}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Terapkan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-xl mx-auto bg-white min-h-screen shadow-lg">
                {/* Navback (tanpa perubahan) */}
                <div
                    ref={navbackRef}
                    className={`sticky top-0 z-40 bg-white px-4 py-4 border-b border-gray-200 flex items-center justify-between shadow-sm transition-transform duration-300 ${showNavback ? 'translate-y-0' : '-translate-y-full'
                        }`}
                >
                    <Link
                        to="/quran"
                        className="flex items-center font-semibold gap-2 text-gray-800 text-[15px]"
                    >
                        <i className="ri-arrow-left-line"></i> Surah {surahData.name_id}
                    </Link>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowFilterModal(true)}
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <i className="ri-filter-line text-xl"></i>
                        </button>
                        <button className="text-gray-600 hover:text-blue-600 transition-colors">
                            <i className="ri-settings-5-line text-xl"></i>
                        </button>
                    </div>
                </div>

                {/* Konten surah dan ayat (tanpa perubahan kecuali tombol more) */}
                {surahData && (
                    <div className="px-4 pt-6 pb-4">
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => navigateToSurah(parseInt(surahData.number) > 1 ? parseInt(surahData.number) - 1 : 114)}
                                className="text-gray-500 hover:text-gray-700 p-2"
                                disabled={isLoading}
                            >
                                <i className="ri-arrow-left-s-line text-2xl"></i>
                            </button>

                            <div className="text-center flex-1">
                                <p className="text-gray-900 font-mushaf text-2xl">
                                    {surahData.name_short}
                                </p>
                                <p className="text-gray-600 pt-1">
                                    {surahData.name_id} - {surahData.translation_id}
                                </p>
                                <p className="text-[12px] text-gray-500">
                                    {surahData.revelation_id} | {surahData.number_of_verses} Ayat
                                </p>
                            </div>

                            <button
                                onClick={() => navigateToSurah(parseInt(surahData.number) < 114 ? parseInt(surahData.number) + 1 : 1)}
                                className="text-gray-500 hover:text-gray-700 p-2"
                                disabled={isLoading}
                            >
                                <i className="ri-arrow-right-s-line text-2xl"></i>
                            </button>
                        </div>

                        {parseInt(surahData.number) !== 1 && parseInt(surahData.number) !== 9 && (
                            <div className="text-center my-6 py-4 border-y border-gray-100">
                                <p className="font-uthmani text-4xl text-gray-800 mb-3">
                                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                                </p>
                                <p className="text-sm text-gray-600">
                                    Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Daftar Ayat → tombol more terbaru */}
                <div className="divide-y divide-gray-100">
                    {verses.map((verse, index) => (
                        <div
                            key={index}
                            id={`verse-${verse.number.inSurah}`}
                            className={`p-4 ${playingVerse === verse.number.inSurah ? 'bg-yellow-100' : ''}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <button
                                    onClick={() => openSheet(surahData, verse)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <i className="ri-more-2-fill text-xl"></i>
                                </button>
                                <p className="font-mushaf text-[22px] leading-loose text-right flex-1 ml-4">
                                    {verse.text.arab}
                                </p>
                            </div>

                            <div className='text-[15px]'>
                                <p className="text-gray-800 text-justify">
                                    <span className="mr-2 font-semibold">({verse.number.inSurah})</span>
                                    {verse.translation.id}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ---------- Bottom Sheet ---------- */}
            {sheetSurah && sheetVerse && (
                <>
                    {/* overlay */}
                    <div
                        onClick={closeSheet}
                        className="fixed inset-0 bg-black bg-opacity-40 z-40"
                    />
                    {/* sheet */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-2xl max-w-xl mx-auto">
                        <div className="p-4 border-b flex items-center justify-between">
                            <p className="font-semibold text-gray-800">
                                QS {sheetSurah.name_id} ayat {sheetVerse.number.inSurah} (Juz {sheetVerse.juz})
                            </p>
                            <button onClick={closeSheet}>
                                <i className="ri-close-line text-xl text-gray-500"></i>
                            </button>
                        </div>

                        <div className="p-4 space-y-3">
                            <button
                                onClick={() => {
                                    closeSheet()
                                    playAudio()
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white"
                            >
                                <i className="ri-play-fill"></i> Play / Putar ayat
                            </button>

                            <button className="w-full flex items-center gap-2 px-4 py-2 rounded bg-gray-100 text-gray-800">
                                <i className="ri-share-line"></i> Bagikan
                            </button>

                            <button className="w-full flex items-center gap-2 px-4 py-2 rounded bg-gray-100 text-gray-800">
                                <i className="ri-bookmark-line"></i> Tandai akhir ayat
                            </button>

                            <button className="w-full flex items-center gap-2 px-4 py-2 rounded bg-gray-100 text-gray-800">
                                <i className="ri-bookmark-3-line"></i> Bookmark
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* ---------- Audio element (hidden) ---------- */}
            <audio ref={audioRef} className="hidden" />
        </div>
    )
}
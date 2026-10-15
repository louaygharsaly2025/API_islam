// src/pages/alquran/DetailSurah.jsx
import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

const QARI_NAME = 'Syekh Mishari Alafasy'

export default function DetailPerSurah() {
    const { id, verseNumber } = useParams()
    const navigate = useNavigate()

    /* ---------- state ---------- */
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
    const [isBookmarked, setIsBookmarked] = useState(false)
    const lastScrollY = useRef(0)
    const navbackRef = useRef(null)

    /* bottom sheet */
    const [sheetSurah, setSheetSurah] = useState(null)
    const [sheetVerse, setSheetVerse] = useState(null)

    /* audio */
    const audioRef = useRef(null)
    const [currentTrack, setCurrentTrack] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)

    /* localStorage keys */
    const PLAYER_STORAGE_KEY = 'quran-miniplayer'
    const BOOKMARK_STORAGE_KEY = 'quran-bookmarks'

    /* ---------- useEffect untuk localStorage ---------- */
    // Load data dari localStorage saat komponen dimount
    useEffect(() => {
        const savedPlayer = JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))
        if (savedPlayer) {
            setCurrentTrack(savedPlayer)
            setIsPlaying(true)
        }

        // Cek apakah surah ini sudah di-bookmark
        const bookmarks = JSON.parse(localStorage.getItem(BOOKMARK_STORAGE_KEY)) || []
        const isSurahBookmarked = bookmarks.some(bookmark => bookmark.surahId === id)
        setIsBookmarked(isSurahBookmarked)
    }, [id])

    // Simpan currentTrack ke localStorage
    useEffect(() => {
        if (currentTrack) {
            localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(currentTrack))
        } else {
            localStorage.removeItem(PLAYER_STORAGE_KEY)
        }
    }, [currentTrack])

    /* ---------- fungsi bookmark ---------- */
    const toggleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem(BOOKMARK_STORAGE_KEY)) || []

        if (isBookmarked) {
            // Hapus bookmark
            const updatedBookmarks = bookmarks.filter(bookmark => bookmark.surahId !== id)
            localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(updatedBookmarks))
            setIsBookmarked(false)
        } else {
            // Tambah bookmark
            const newBookmark = {
                surahId: id,
                surahName: surahData.name_id,
                surahNameArabic: surahData.name_short,
                totalVerses: surahData.number_of_verses,
                timestamp: new Date().toISOString()
            }
            const updatedBookmarks = [...bookmarks, newBookmark]
            localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(updatedBookmarks))
            setIsBookmarked(true)
        }
    }

    /* ---------- fetch data ---------- */
    useEffect(() => {
        const fetchAllSurahs = async () => {
            try {
                const res = await fetch('https://api.myquran.com/v2/quran/surat/semua')
                const json = await res.json()
                if (json.status) setAllSurahs(json.data)
            } catch (err) {
                console.error('Gagal fetch semua surah:', err)
            }
        }
        fetchAllSurahs()
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const current = window.scrollY
            setShowNavback(current < lastScrollY.current || current < 100)
            lastScrollY.current = current
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                setAllDataReady(false)
                setError(null)

                const surahRes = await fetch(`https://api.myquran.com/v2/quran/surat/${id}`)
                const surahJson = await surahRes.json()
                if (!surahJson.status) throw new Error('Gagal fetch surah')
                setSurahData(surahJson.data)

                const total = parseInt(surahJson.data.number_of_verses)
                const ayatPromises = []
                for (let i = 1; i <= total; i++) {
                    ayatPromises.push(
                        fetch(`https://api.myquran.com/v2/quran/ayat/${id}/${i}`)
                            .then(r => r.json())
                    )
                }
                const ayatResults = await Promise.all(ayatPromises)
                const transformed = ayatResults.map(r => ({
                    number: { inSurah: parseInt(r.data[0].ayah) },
                    text: { arab: r.data[0].arab },
                    translation: { id: r.data[0].text },
                    latin: r.data[0].latin,
                    audio: r.data[0].audio,
                    juz: r.data[0].juz
                }))
                setVerses(transformed)
                document.title = `${surahJson.data.name_id} - Islamic`

                if (verseNumber) {
                    setTimeout(() => {
                        const navHeight = navbackRef.current?.offsetHeight || 64
                        const el = document.getElementById(`verse-${verseNumber}`)
                        if (el) {
                            const offset = el.offsetTop - navHeight - 4
                            window.scrollTo({ top: offset, behavior: 'smooth' })
                            el.classList.add('bg-yellow-100')
                            setTimeout(() => el.classList.remove('bg-yellow-100'), 3000)
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
        fetchData()
    }, [id, verseNumber])

    /* ---------- helpers ---------- */
    const navigateToSurah = (surahId, verseId = '') => {
        navigate(`/quran/surah/${surahId}${verseId ? `/${verseId}` : ''}`)
        window.scrollTo(0, 0)
    }

    const handleFilter = () => {
        setShowFilterModal(false)
        navigateToSurah(selectedSurah, selectedVerse)
    }

    /* audio */
    const play = async (surahId, ayah, audioUrl) => {
        if (!audioRef.current) return
        audioRef.current.src = audioUrl
        try {
            await audioRef.current.play()
            setCurrentTrack({ surahId: String(surahId), ayah, audio: audioUrl })
            setIsPlaying(true)
        } catch (e) {
            console.error(e)
        }
    }

    const togglePlay = () => {
        if (!audioRef.current) return
        if (audioRef.current.paused) {
            audioRef.current.play()
            setIsPlaying(true)
        } else {
            audioRef.current.pause()
            setIsPlaying(false)
        }
    }

    useEffect(() => {
        if (!currentTrack) return
        const el = document.getElementById(`verse-${currentTrack.ayah}`)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [currentTrack])

    const prevAyat = async () => {
        if (!currentTrack) return
        let prev = currentTrack.ayah - 1
        if (prev < 1) {
            const prevSurahId = parseInt(currentTrack.surahId) - 1 || 114
            const res = await fetch(`https://api.myquran.com/v2/quran/surat/${prevSurahId}`)
            const json = await res.json()
            const lastAyah = parseInt(json.data.number_of_verses)
            play(prevSurahId, lastAyah, json.data.verses?.[lastAyah - 1]?.audio)
        } else {
            const res = await fetch(`https://api.myquran.com/v2/quran/ayat/${currentTrack.surahId}/${prev}`)
            const json = await res.json()
            play(currentTrack.surahId, prev, json.data[0].audio)
        }
    }

    const nextAyat = async () => {
        if (!currentTrack) return
        const next = currentTrack.ayah + 1
        try {
            const res = await fetch(`https://api.myquran.com/v2/quran/ayat/${currentTrack.surahId}/${next}`)
            const json = await res.json()
            if (json.status) {
                play(currentTrack.surahId, next, json.data[0].audio)
            } else {
                throw new Error('Ayat habis')
            }
        } catch {
            const nextSurahId = parseInt(currentTrack.surahId) + 1 > 114 ? 1 : parseInt(currentTrack.surahId) + 1
            const res = await fetch(`https://api.myquran.com/v2/quran/ayat/${nextSurahId}/1`)
            const json = await res.json()
            play(nextSurahId, 1, json.data[0].audio)
        }
    }

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.src = ''
        }
        setCurrentTrack(null)
        setIsPlaying(false)
    }

    /* auto next */
    useEffect(() => {
        const audio = audioRef.current
        if (!audio || !currentTrack) return
        const onEnd = () => nextAyat()
        audio.addEventListener('ended', onEnd)
        return () => audio.removeEventListener('ended', onEnd)
    }, [currentTrack])

    /* sync play/pause */
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return
        const onPlay = () => setIsPlaying(true)
        const onPause = () => setIsPlaying(false)
        audio.addEventListener('play', onPlay)
        audio.addEventListener('pause', onPause)
        return () => {
            audio.removeEventListener('play', onPlay)
            audio.removeEventListener('pause', onPause)
        }
    }, [])

    /* bottom sheet */
    const openSheet = (surah, verse) => {
        setSheetSurah(surah)
        setSheetVerse(verse)
    }

    const closeSheet = () => {
        setSheetSurah(null)
        setSheetVerse(null)
    }

    /* ---------- render ---------- */
    if (!allDataReady) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-xl px-4 md:mb-0 mb-[70px] border-x border-gray-200 bg-white min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <i className="ri-loader-2-line text-2xl text-[#1f3963] mb-2"></i>
                        <p className="text-[#355485]">Memuat surah...</p>
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
                        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#355485] text-white rounded">
                            Coba Lagi
                        </button>
                    </div>
                    <div className="text-center mt-4">
                        <Link to="/" className="text-[#355485] hover:text-[#1f3963]">
                            Kembali ke Halaman Utama
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-2 bg-gray-50">
            {/* Modal Filter */}
            {showFilterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-semibold text-lg text-[#1f3963]">Pilih Surah & Ayat</h3>
                            <button onClick={() => setShowFilterModal(false)}>
                                <i className="ri-close-line text-xl text-[#355485]"></i>
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[60vh]">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#1f3963] mb-2">Pilih Surah</label>
                                <select
                                    value={selectedSurah}
                                    onChange={(e) => {
                                        setSelectedSurah(e.target.value)
                                        setSelectedVerse('')
                                    }}
                                    className="w-full p-2 font-mushaf border text-[#1f3963] border-gray-300 rounded-md"
                                >
                                    {allSurahs.map(s => (
                                        <option key={s.number} value={s.number}>
                                            {s.number}. {s.name_id} ({s.name_short})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#1f3963] mb-2">
                                    Pilih Ayat{" "}
                                    <span className="text-[#355485] text-xs">(1 - {surahData?.number_of_verses})</span>
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
                        <div className="p-4 border-t flex justify-end gap-2">
                            <button onClick={() => setShowFilterModal(false)} className="px-4 py-2 text-[#355485]">
                                Batal
                            </button>
                            <button onClick={handleFilter} className="px-4 py-2 bg-[#355485] text-white rounded-md">
                                Terapkan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-xl mx-auto bg-white min-h-screen shadow-lg">
                {/* Navback */}
                <div
                    ref={navbackRef}
                    className={`sticky top-0 z-40 bg-white px-4 py-4 border-b border-gray-200 flex items-center justify-between shadow-sm transition-transform duration-300 ${showNavback ? 'translate-y-0' : '-translate-y-full'}`}
                >
                    <Link to="/quran" className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]">
                        <i className="ri-arrow-left-line"></i> Surah {surahData.name_id}
                    </Link>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleBookmark}
                            className="text-[#355485]"
                        >
                            <i className={isBookmarked ? "ri-bookmark-2-fill text-red-500" : "ri-bookmark-line"}></i>
                        </button>
                        <button onClick={() => setShowFilterModal(true)} className="text-[#355485]">
                            <i className="ri-filter-line text-xl"></i>
                        </button>
                        <button className="text-[#355485]">
                            <i className="ri-settings-5-line text-xl"></i>
                        </button>
                    </div>
                </div>
                {/* text-[#355485] */}

                {/* info data surah */}
                {surahData && (
                    <div className="px-4 pt-6 pb-4">
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => navigateToSurah(parseInt(surahData.number) > 1 ? parseInt(surahData.number) - 1 : 114)}
                                className="text-[#355485] hover:text-[#1f3963] p-2"
                            >
                                <i className="ri-arrow-left-s-line text-2xl"></i>
                            </button>
                            <div className="text-center flex-1">
                                <p className="text-[#1f3963] font-mushaf text-2xl">{surahData.name_short}</p>
                                <p className="text-[#355485] pt-1">
                                    {surahData.name_id} - {surahData.translation_id}
                                </p>
                                <p className="text-[12px] text-[#355485]">
                                    {surahData.revelation_id} | {surahData.number_of_verses} Ayat
                                </p>
                            </div>
                            <button
                                onClick={() => navigateToSurah(parseInt(surahData.number) < 114 ? parseInt(surahData.number) + 1 : 1)}
                                className="text-[#355485] hover:text-[#1f3963] p-2"
                            >
                                <i className="ri-arrow-right-s-line text-2xl"></i>
                            </button>
                        </div>

                        {parseInt(surahData.number) !== 1 && parseInt(surahData.number) !== 9 && (
                            <div className="text-center my-6 py-4 border-y border-gray-100">
                                <p className="font-mushaf text-3xl text-[#1f3963] mb-3">
                                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                                </p>
                                <p className="text-sm text-[#355485]">
                                    Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Daftar Ayat */}
                <div className="divide-y divide-gray-100">
                    {verses.map((verse, index) => (
                        <div
                            key={index}
                            id={`verse-${verse.number.inSurah}`}
                            className={`p-4 ${currentTrack?.ayah === verse.number.inSurah && parseInt(currentTrack?.surahId) === parseInt(id) ? 'bg-[#cbdde9]' : ''}`}
                        >
                            <div className="flex mb-4">
                                {/* Kolom kiri: tombol more di atas, bookmark di bawah */}
                                <div className="flex flex-col justify-between items-start">
                                    <button
                                        onClick={() => openSheet(surahData, verse)}
                                        className="text-[#355485]"
                                    >
                                        <i className="ri-more-2-fill text-xl"></i>
                                    </button>
                                </div>

                                {/* Teks arab di kanan */}
                                <p className="font-mushaf text-[#1f3963] text-[22px] leading-loose text-right flex-1 ml-4">
                                    {verse.text.arab}
                                </p>
                            </div>

                            <div className="text-[15px]">
                                <p className="text-[#355485] text-justify">
                                    <span className="mr-2 font-semibold">({verse.number.inSurah})</span>
                                    {verse.translation.id}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Sheet */}
            {sheetSurah && sheetVerse && (
                <>
                    <div onClick={closeSheet} className="fixed inset-0 bg-black bg-opacity-40 z-40" />
                    <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-2xl max-w-xl mx-auto">
                        <div className="p-4 border-b flex items-center justify-between">
                            <p className="font-semibold text-[#355485]">
                                QS {sheetSurah.name_id} ayat {sheetVerse.number.inSurah} (Juz {sheetVerse.juz})
                            </p>
                            <button onClick={closeSheet}>
                                <i className="ri-close-line text-xl text-[#355485]"></i>
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            <button
                                onClick={() => {
                                    closeSheet()
                                    play(id, sheetVerse.number.inSurah, sheetVerse.audio)
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 rounded bg-[#355485] text-white"
                            >
                                <i className="ri-play-fill"></i> Play / Putar ayat
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 rounded bg-gray-100 text-[#355485]">
                                <i className="ri-share-line"></i> Bagikan
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 rounded bg-gray-100 text-[#355485]">
                                <i className="ri-bookmark-line"></i> Tandai akhir ayat
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 rounded bg-gray-100 text-[#355485]">
                                <i className="ri-bookmark-3-line"></i> Bookmark
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Mini Player */}
            {currentTrack && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border shadow-xl rounded-2xl w-[90%] max-w-md z-30">
                    <div className="flex items-center justify-between px-4 py-3">

                        {/* Info Surah */}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[#1f3963] text-sm truncate">
                                QS. {allSurahs.find(s => s.number === currentTrack.surahId)?.name_id || ''} · Ayat {currentTrack.ayah}
                            </p>
                            <p className="text-xs text-[#355485]">{QARI_NAME}</p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 ml-4">
                            <button onClick={prevAyat} className="text-[#355485] transition">
                                <i className="ri-skip-back-fill text-xl"></i>
                            </button>
                            <button onClick={togglePlay} className="text-[#355485] hover:text-[#1f3963] transition">
                                <i className={`text-3xl ${isPlaying ? 'ri-pause-circle-fill' : 'ri-play-circle-fill'}`}></i>
                            </button>
                            <button onClick={nextAyat} className="text-[#355485] transition">
                                <i className="ri-skip-forward-fill text-xl"></i>
                            </button>
                            <button onClick={stop} className="text-red-500 hover:text-red-600 transition">
                                <i className="ri-close-circle-fill text-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <audio ref={audioRef} className="hidden" />
        </div>
    )
}
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom';

// Komponen BottomSheet
const BottomSheet = ({ isOpen, onClose, verse, onPlayAudio }) => {
    if (!isOpen) return null;

    return (
        <>
            <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-40 z-40" />
            <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-2xl max-w-xl mx-auto">
                <div className="p-4 border-b flex items-center justify-between">
                    <p className="font-semibold text-[#355485]">
                        QS {verse?.surah_name_id} ayat {verse?.ayah} (Juz {verse?.juz})
                    </p>
                    <button onClick={onClose}>
                        <i className="ri-close-line text-xl text-gray-500"></i>
                    </button>
                </div>
                <div className="p-4 space-y-3">
                    <button
                        onClick={() => {
                            onClose();
                            onPlayAudio();
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
    );
};

// Komponen MiniPlayer
const MiniPlayer = ({ currentTrack, allSurahs, isPlaying, onTogglePlay, onPrev, onNext, onStop }) => {
    const QARI_NAME = 'Syekh Mishari Alafasy';

    if (!currentTrack) return null;

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border shadow-xl rounded-2xl w-[90%] max-w-md z-30">
            <div className="flex items-center justify-between px-4 py-3">
                {/* Info Surah */}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                        QS. {allSurahs.find(s => s.number === currentTrack.surahId)?.name_id || ''} · Ayat {currentTrack.ayah}
                    </p>
                    <p className="text-xs text-gray-500">{QARI_NAME}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 ml-4">
                    <button onClick={onPrev} className="text-gray-600 hover:text-[#355485] transition">
                        <i className="ri-skip-back-fill text-xl"></i>
                    </button>
                    <button onClick={onTogglePlay} className="text-gray-600 hover:text-gray-700 transition">
                        <i className={`text-3xl ${isPlaying ? 'ri-pause-circle-fill' : 'ri-play-circle-fill'}`}></i>
                    </button>
                    <button onClick={onNext} className="text-gray-600 hover:text-[#355485] transition">
                        <i className="ri-skip-forward-fill text-xl"></i>
                    </button>
                    <button onClick={onStop} className="text-red-500 hover:text-red-600 transition">
                        <i className="ri-close-circle-fill text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function DetailPerJuz() {
    const { id } = useParams()
    const [juzData, setJuzData] = useState(null)
    const [verses, setVerses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [allJuz, setAllJuz] = useState([])
    const [showNavback, setShowNavback] = useState(true)
    const lastScrollY = useRef(0)

    // Bottom sheet state
    const [sheetVerse, setSheetVerse] = useState(null)

    // Audio state
    const audioRef = useRef(null)
    const [currentTrack, setCurrentTrack] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [allSurahs, setAllSurahs] = useState([])

    // Fetch daftar semua juz
    useEffect(() => {
        const fetchAllJuz = async () => {
            try {
                const response = await fetch('https://api.myquran.com/v2/quran/juz/semua')
                const result = await response.json()

                if (result.status) {
                    setAllJuz(result.data)
                }
            } catch (err) {
                console.error('Gagal mengambil daftar juz:', err)
            }
        }

        fetchAllJuz()
    }, [])

    // Fetch semua surah untuk info nama surah
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

    // Handle scroll untuk navback
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
        const fetchJuzData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                // Fetch data juz
                const response = await fetch(`https://api.myquran.com/v2/quran/ayat/juz/${id}`)
                const result = await response.json()

                if (!result.status) {
                    throw new Error('Failed to fetch juz data')
                }

                setJuzData(result)
                setVerses(result.data)

                // Set document title
                document.title = `Juz ${id} - Islamic`

                // Scroll ke atas setelah data dimuat
                window.scrollTo(0, 0)
            } catch (err) {
                setError(err.message)
                document.title = "Detail Juz - Islamic"
            } finally {
                setIsLoading(false)
            }
        }

        fetchJuzData()
    }, [id])

    // Navigasi juz
    const navigateToJuz = (juzId) => {
        window.location.href = `/quran/juz/${juzId}`
    }

    // Bottom sheet functions
    const openSheet = (verse) => {
        setSheetVerse(verse)
    }

    const closeSheet = () => {
        setSheetVerse(null)
    }

    // Audio functions
    const play = useCallback(async (surahId, ayah, audioUrl) => {
        if (!audioRef.current) return
        audioRef.current.src = audioUrl
        try {
            await audioRef.current.play()
            setCurrentTrack({ surahId: String(surahId), ayah, audio: audioUrl })
            setIsPlaying(true)
        } catch (e) {
            console.error(e)
        }
    }, [])

    const togglePlay = useCallback(() => {
        if (!audioRef.current) return
        if (audioRef.current.paused) {
            audioRef.current.play()
            setIsPlaying(true)
        } else {
            audioRef.current.pause()
            setIsPlaying(false)
        }
    }, [])

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.src = ''
        }
        setCurrentTrack(null)
        setIsPlaying(false)
    }, [])

    const prevAyat = useCallback(async () => {
        if (!currentTrack) return

        // Cari index ayat saat ini
        const currentIndex = verses.findIndex(v =>
            parseInt(v.surah) === parseInt(currentTrack.surahId) &&
            parseInt(v.ayah) === parseInt(currentTrack.ayah)
        )

        if (currentIndex > 0) {
            const prevVerse = verses[currentIndex - 1]
            play(prevVerse.surah, prevVerse.ayah, prevVerse.audio)
        } else {
            // Jika sudah di ayat pertama, pindah ke juz sebelumnya
            const prevJuzId = parseInt(id) > 1 ? parseInt(id) - 1 : 30
            navigateToJuz(prevJuzId)
        }
    }, [currentTrack, verses, id, play])

    const nextAyat = useCallback(async () => {
        if (!currentTrack) return

        // Cari index ayat saat ini
        const currentIndex = verses.findIndex(v =>
            parseInt(v.surah) === parseInt(currentTrack.surahId) &&
            parseInt(v.ayah) === parseInt(currentTrack.ayah)
        )

        if (currentIndex < verses.length - 1) {
            const nextVerse = verses[currentIndex + 1]
            play(nextVerse.surah, nextVerse.ayah, nextVerse.audio)
        } else {
            // Jika sudah di ayat terakhir, pindah ke juz berikutnya
            const nextJuzId = parseInt(id) < 30 ? parseInt(id) + 1 : 1
            navigateToJuz(nextJuzId)
        }
    }, [currentTrack, verses, id, play])

    // Auto next ketika audio selesai
    useEffect(() => {
        const audio = audioRef.current
        if (!audio || !currentTrack) return

        const onEnd = () => nextAyat()
        audio.addEventListener('ended', onEnd)

        return () => {
            audio.removeEventListener('ended', onEnd)
        }
    }, [currentTrack, nextAyat])

    // Sync play/pause state
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

    // Highlight ayat yang sedang diputar
    useEffect(() => {
        if (!currentTrack) return

        // Hapus highlight sebelumnya
        const prevHighlighted = document.querySelector('.verse-highlighted')
        if (prevHighlighted) {
            prevHighlighted.classList.remove('verse-highlighted', 'bg-yellow-100')
        }

        // Highlight ayat yang sedang diputar
        const el = document.getElementById(`verse-${currentTrack.surahId}-${currentTrack.ayah}`)
        if (el) {
            el.classList.add('verse-highlighted', 'bg-yellow-100')
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [currentTrack])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-xl px-4 md:mb-0 mb-[70px] border-x border-gray-200 bg-white min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <i className="ri-loader-2-line text-2xl text-blue-700 mb-2 animate-spin"></i>
                        <p className="text-gray-600">Memuat Juz {id}</p>
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
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Coba Lagi
                        </button>
                    </div>
                    <div className="text-center mt-4">
                        <Link
                            to="/quran/juz"
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Kembali ke Daftar Juz
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-20 bg-gray-50">
            <div className="max-w-xl mx-auto bg-white min-h-screen shadow-lg">
                {/* Navback */}
                <div className={`sticky top-0 z-40 bg-white px-4 py-4 border-b border-gray-200 flex items-center justify-between shadow-sm transition-transform duration-300 ${showNavback ? 'translate-y-0' : '-translate-y-full'}`}>
                    <Link to="/quran/juz" className="flex items-center font-semibold gap-2 text-[#355485] text-[15px] transition-colors">
                        <i className="ri-arrow-left-line"></i> Juz {id}
                    </Link>
                    <div className="flex items-center gap-3">
                        <button className="text-gray-600 transition-colors">
                            <i className="ri-filter-line text-xl"></i>
                        </button>
                        <button className="text-gray-600 transition-colors">
                            <i className="ri-settings-5-line text-xl"></i>
                        </button>
                    </div>
                </div>

                {/* Info Juz */}
                {juzData && allJuz.length > 0 && (
                    <div className="px-4 pt-6 pb-4">
                        <div className="text-center">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl py-5 px-6 border border-blue-100 relative">
                                <button
                                    onClick={() => navigateToJuz(parseInt(id) > 1 ? parseInt(id) - 1 : 30)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    <i className="ri-arrow-left-s-line text-2xl"></i>
                                </button>

                                <p className="text-gray-900 font-mushaf text-3xl mb-2">
                                    الجزء {id}
                                </p>
                                <p className="text-gray-700 font-semibold text-lg">
                                    Juz {id}
                                </p>
                                <div className="mt-4 text-sm text-gray-600">
                                    <p className="mb-1">
                                        <span className="font-medium">Dimulai dari:</span> {
                                            allJuz.find(j => j.number === id)?.name_start_id || ''
                                        } ayat {allJuz.find(j => j.number === id)?.verse_start || ''}
                                    </p>
                                    <p>
                                        <span className="font-medium">Diakhiri dengan:</span> {
                                            allJuz.find(j => j.number === id)?.name_end_id || ''
                                        } ayat {allJuz.find(j => j.number === id)?.verse_end || ''}
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigateToJuz(parseInt(id) < 30 ? parseInt(id) + 1 : 1)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    <i className="ri-arrow-right-s-line text-2xl"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Daftar Ayat */}
                <div className="divide-y divide-gray-100">
                    {verses.map((verse, index) => (
                        <div
                            key={index}
                            id={`verse-${verse.surah}-${verse.ayah}`}
                            className={`p-5 ${currentTrack?.ayah === parseInt(verse.ayah) && parseInt(currentTrack?.surahId) === parseInt(verse.surah) ? 'bg-yellow-100' : ''}`}
                        >
                            {/* 

                            key={index}
                            id={`verse-${verse.number.inSurah}`}
                            className={`p-4 ${currentTrack?.ayah === verse.number.inSurah && parseInt(currentTrack?.surahId) === parseInt(id) ? 'bg-yellow-100' : ''}`}
                        >
                            
                            */}
                            <div className="flex items-start justify-between mb-4">
                                <button
                                    onClick={() => openSheet(verse)}
                                    className="text-gray-500 flex-shrink-0 transition-colors"
                                >
                                    <i className="ri-more-2-fill text-xl"></i>
                                </button>
                                <p className="font-mushaf text-[22px] text-[#1f3963] leading-loose text-right flex-1 ml-4">
                                    {verse.arab}
                                </p>
                            </div>
                            <div className='text-[15px] mb-3'>
                                <p className="text-[#355485] text-justify">
                                    <span className='font-semibold mr-2'>[{verse.surah}:{verse.ayah}]</span>
                                    {verse.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Sheet */}
            <BottomSheet
                isOpen={!!sheetVerse}
                onClose={closeSheet}
                verse={sheetVerse}
                onPlayAudio={() => play(sheetVerse?.surah, sheetVerse?.ayah, sheetVerse?.audio)}
            />

            {/* Mini Player */}
            <MiniPlayer
                currentTrack={currentTrack}
                allSurahs={allSurahs}
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                onPrev={prevAyat}
                onNext={nextAyat}
                onStop={stop}
            />

            <audio ref={audioRef} className="hidden" />
        </div>
    )
}
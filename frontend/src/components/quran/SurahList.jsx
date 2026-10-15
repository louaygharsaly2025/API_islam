import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ================== MINI PLAYER ==================
const MiniPlayer = ({
    surahData,
    sheikh,
    isPlaying,
    onTogglePlay,
    onClose,
    onExpand
}) => {
    if (!surahData || !sheikh) return null;

    return (
        <div className="fixed bottom-4 right-4 mb-[50px] left-4 bg-[#fcfeff] rounded-xl shadow-lg border border-[#cbdde9] p-3 z-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        className="w-10 h-10 flex items-center justify-center bg-[#355485] text-white rounded-full mr-3"
                        onClick={onTogglePlay}
                    >
                        <i className={isPlaying ? 'ri-pause-line' : 'ri-play-line'}></i>
                    </button>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[#355485] truncate">
                            {surahData.nomor}. {surahData.namaLatin}
                        </h4>
                        <p className="text-xs text-[#6d9bbc] truncate">{getSheikhName(sheikh)}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        className="w-8 h-8 flex items-center justify-center text-[#6d9bbc] hover:text-[#4f90c6]"
                        onClick={onExpand}
                    >
                        <i className="ri-expand-diagonal-line"></i>
                    </button>
                    <button
                        className="w-8 h-8 flex items-center justify-center text-[#6d9bbc] hover:text-red-500"
                        onClick={onClose}
                    >
                        <i className="ri-close-line"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};



// ================== SURAH LIST ==================
const SurahList = ({ surahList, isLoading, searchQuery }) => {
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [surahAudioData, setSurahAudioData] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const [selectedSheikh, setSelectedSheikh] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    // Load saved state
    useEffect(() => {
        const savedSheikh = localStorage.getItem('selectedSheikh');
        const savedSurah = localStorage.getItem('playingSurah');
        const savedIsPlaying = localStorage.getItem('isPlaying');
        const savedCurrentTime = localStorage.getItem('currentTime');

        if (savedSheikh) setSelectedSheikh(savedSheikh);
        if (savedSurah) setSelectedSurah(JSON.parse(savedSurah));
        if (savedIsPlaying === 'true') setIsPlaying(true);
        if (savedCurrentTime) setCurrentTime(parseFloat(savedCurrentTime));

        if (savedSurah && savedSheikh) {
            setIsMiniPlayerVisible(true);
            loadAudioData(JSON.parse(savedSurah));
        }
    }, []);

    // Save state
    useEffect(() => {
        if (selectedSheikh) localStorage.setItem('selectedSheikh', selectedSheikh);
        if (selectedSurah) localStorage.setItem('playingSurah', JSON.stringify(selectedSurah));
        localStorage.setItem('isPlaying', isPlaying.toString());
        localStorage.setItem('currentTime', currentTime.toString());
    }, [selectedSheikh, selectedSurah, isPlaying, currentTime]);

    // Load audio
    const loadAudioData = async (surah) => {
        setIsLoadingAudio(true);
        try {
            const response = await fetch(`https://equran.id/api/v2/surat/${surah.number}`);
            const data = await response.json();
            setSurahAudioData(data.data);
        } catch (error) {
            console.error('Error fetching audio data:', error);
        } finally {
            setIsLoadingAudio(false);
        }
    };

    const handlePlayClick = async (surah) => {
        setSelectedSurah(surah);
        setIsLoadingAudio(true);
        setIsSidebarOpen(true);
        setIsMiniPlayerVisible(false);
        await loadAudioData(surah);

        setTimeout(() => {
            if (audioRef.current && selectedSheikh) {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }, 100);
    };

    const handleMinimize = () => {
        setIsSidebarOpen(false);
        setIsMiniPlayerVisible(true);
    };

    const handleExpand = () => {
        setIsSidebarOpen(true);
        setIsMiniPlayerVisible(false);
    };

    const handleClose = () => {
        setIsMiniPlayerVisible(false);
        if (audioRef.current) audioRef.current.pause();
        setIsPlaying(false);
        setSelectedSurah(null);
        setSurahAudioData(null);
        localStorage.removeItem('playingSurah');
        localStorage.removeItem('isPlaying');
        localStorage.removeItem('currentTime');
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleSheikhSelect = (sheikhKey) => {
        setSelectedSheikh(sheikhKey);
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }, 100);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleSeek = (e) => {
        if (audioRef.current) {
            const seekTime = parseFloat(e.target.value);
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };

    const playNextSurah = () => {
        if (selectedSurah && surahList.length > 0) {
            const currentIndex = surahList.findIndex(s => s.number === selectedSurah.number);
            if (currentIndex < surahList.length - 1) {
                const nextSurah = surahList[currentIndex + 1];
                handlePlayClick(nextSurah);
            }
        }
    };

    const playPrevSurah = () => {
        if (selectedSurah && surahList.length > 0) {
            const currentIndex = surahList.findIndex(s => s.number === selectedSurah.number);
            if (currentIndex > 0) {
                const prevSurah = surahList[currentIndex - 1];
                handlePlayClick(prevSurah);
            }
        }
    };

    // Filter surah
    const filteredSurahs = surahList.filter(surah =>
        surah.name.transliteration.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.name.translation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.number.toString().includes(searchQuery)
    );

    if (isLoading) return <div className="p-4 text-center text-[#6d9bbc]">Memuat data surah...</div>;
    if (filteredSurahs.length === 0) return <div className="p-4 text-center text-[#6d9bbc]">Surah tidak ditemukan</div>;

    return (
        <>
            {/* List Surah */}
            <div className="bg-[#fcfeff] rounded-xl mb-[130px] shadow-sm divide-y divide-[#f0f1f2]">
                {filteredSurahs.map((surah, index) => (
                    <div key={index} className="block hover:bg-[#f0f1f2] transition-colors duration-200">
                        <div className="flex items-center px-2 py-3">
                            <button
                                onClick={() => handlePlayClick(surah)}
                                className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#cbdde9] text-[#355485] hover:bg-[#90b6d5]"
                            >
                                <i className="ri-volume-up-line"></i>
                            </button>

                            <Link to={`/quran/surah/${surah.number}`} className="flex w-full items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-[#355485]">
                                        {surah.number}. {surah.name.transliteration.id}
                                    </h3>
                                    <p className="text-xs text-[#6d9bbc]">
                                        {surah.name.translation.id} • {surah.numberOfVerses} Ayat
                                    </p>
                                </div>
                                <p className="font-mushaf text-xl text-[#355485] text-right">
                                    {surah.name.short}
                                </p>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sidebar Player */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 mb-[45px] overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                    <div className="absolute bottom-0 inset-x-0 bg-[#fcfeff] rounded-t-2xl shadow-lg p-4 max-h-[80vh] overflow-y-auto">
                        <button
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#f0f1f2] hover:bg-[#cbdde9]"
                            onClick={handleMinimize}
                        >
                            <i className="ri-collapse-diagonal-line text-[#355485]"></i>
                        </button>

                        {isLoadingAudio ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#355485]"></div>
                                <span className="ml-3 text-[#44515f]">Memuat data audio...</span>
                            </div>
                        ) : surahAudioData ? (
                            <>
                                <h2 className="text-xl font-bold mb-4 text-center text-[#355485]">
                                    {surahAudioData.nomor}. Surah {surahAudioData.namaLatin}
                                </h2>

                                <div className="mb-6">
                                    <h3 className="font-medium text-[#44515f] mb-3">Pilih Qari Favoritmu</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {Object.entries(surahAudioData.audioFull).map(([key]) => (
                                            <button
                                                key={key}
                                                className={`p-3 rounded-lg text-left ${selectedSheikh === key
                                                        ? 'bg-[#355485] text-white shadow'
                                                        : 'bg-[#f0f1f2] text-[#44515f] hover:bg-[#cbdde9]'
                                                    }`}
                                                onClick={() => handleSheikhSelect(key)}
                                            >
                                                <p className="font-medium">{getSheikhName(key)}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {selectedSheikh && surahAudioData.audioFull[selectedSheikh] && (
                                    <div className="bg-[#f0f1f2] rounded-xl p-4 mb-4">
                                        <div className="mb-2">
                                            <input
                                                type="range"
                                                min="0"
                                                max={duration || 0}
                                                value={currentTime}
                                                onChange={handleSeek}
                                                className="w-full h-2 bg-[#cbdde9] rounded-lg appearance-none cursor-pointer accent-[#355485]"
                                            />
                                            <div className="flex justify-between text-xs text-[#6d9bbc] mt-1">
                                                <span>{formatTime(currentTime)}</span>
                                                <span>{formatTime(duration)}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-center items-center space-x-4 mt-3">
                                            <button onClick={playPrevSurah} disabled={selectedSurah.number === 1}
                                                className="w-8 h-8 flex items-center justify-center text-[#6d9bbc] hover:text-[#355485] disabled:opacity-40">
                                                <i className="ri-skip-back-line text-xl"></i>
                                            </button>
                                            <button
                                                onClick={togglePlayPause}
                                                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#355485] text-white hover:bg-[#4f90c6]"
                                            >
                                                <i className={isPlaying ? 'ri-pause-line' : 'ri-play-line'}></i>
                                            </button>
                                            <button onClick={playNextSurah} disabled={selectedSurah.number === 114}
                                                className="w-8 h-8 flex items-center justify-center text-[#6d9bbc] hover:text-[#355485] disabled:opacity-40">
                                                <i className="ri-skip-forward-line text-xl"></i>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-8 text-[#6d9bbc]">
                                <i className="ri-error-warning-line text-3xl mb-2"></i>
                                <p>Gagal memuat data audio</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <audio
                ref={audioRef}
                src={selectedSheikh && surahAudioData?.audioFull?.[selectedSheikh]}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setDuration(audioRef.current.duration || 0)}
                onEnded={() => { setIsPlaying(false); playNextSurah(); }}
                autoPlay={isPlaying}
                className="hidden"
            />

            {isMiniPlayerVisible && selectedSurah && surahAudioData && selectedSheikh && (
                <MiniPlayer
                    surahData={surahAudioData}
                    sheikh={selectedSheikh}
                    isPlaying={isPlaying}
                    onTogglePlay={togglePlayPause}
                    onClose={handleClose}
                    onExpand={handleExpand}
                />
            )}
        </>
    );
};

// ================== HELPER ==================
function getSheikhName(key) {
    const sheikhMap = {
        '01': 'Syaikh Abdullah Al-Juhany',
        '02': 'Syaikh Abdul Muhsin Al-Qasim',
        '03': 'Syaikh Abdurrahman as-Sudais',
        '04': 'Syaikh Ibrahim Al-Dossari',
        '05': 'Syaikh Misyari Rasyid Al-Afasi'
    };
    return sheikhMap[key] || `Qari ${key}`;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

export default SurahList;

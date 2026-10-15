import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import VidMotivasi from '../../components/home/VidMotivasi';

export default function DetailVideo() {
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    // load state dari localStorage
    useEffect(() => {
        const savedLike = localStorage.getItem("liked") === "true";
        const savedDislike = localStorage.getItem("disliked") === "true";
        setLiked(savedLike);
        setDisliked(savedDislike);
    }, []);

    // simpan ke localStorage tiap kali berubah
    useEffect(() => {
        localStorage.setItem("liked", liked);
        localStorage.setItem("disliked", disliked);
    }, [liked, disliked]);

    const toggleLike = () => {
        setLiked(!liked);
        if (!liked && disliked) setDisliked(false);
    };

    const toggleDislike = () => {
        setDisliked(!disliked);
        if (!disliked && liked) setLiked(false);
    };
    const { id } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);

    const [videos, setVideos] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hoverControls, setHoverControls] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [sortAscending, setSortAscending] = useState(false);

    // toast/modal copy & status download
    const [toast, setToast] = useState({ open: false, message: '' });
    const [downloading, setDownloading] = useState(false);

    // ---- layout constants (sesuaikan kalau mau) ----
    // header fixed: 56px, video fixed: 220px => total offset konten = 276px
    const HEADER_H = 56;
    const PLAYER_H = 220;
    const CONTENT_OFFSET = HEADER_H + PLAYER_H;

    // helper: rapikan url video (kalau ada leading '/')
    const cleanUrl = (url = '') => url.replace(/^\/+/, '');

    // Ambil data video
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('/data/vidmotivasi.json');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                // Urutkan desc by id (default)
                const sortedData = [...data].sort((a, b) => b.id - a.id).map(v => ({
                    ...v,
                    video_url: cleanUrl(v.video_url),
                }));
                setVideos(sortedData);

                const video = sortedData.find(v => v.id === Number(id));
                if (video) setCurrentVideo(video);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching video data:', error);
                setLoading(false);
            }
        };
        fetchVideos();
    }, [id]);

    // Setup video listeners
    useEffect(() => {
        if (videoRef.current && currentVideo) {
            const video = videoRef.current;

            const updateProgress = () => {
                if (video.duration) {
                    setProgress((video.currentTime / video.duration) * 100);
                    setCurrentTime(video.currentTime);
                }
            };

            const setVideoDuration = () => setDuration(video.duration || 0);

            const onEnded = () => handleVideoEnd();

            video.addEventListener('timeupdate', updateProgress);
            video.addEventListener('loadedmetadata', setVideoDuration);
            video.addEventListener('ended', onEnded);

            const playVideo = async () => {
                try {
                    await video.play();
                    setIsPlaying(true);
                } catch {
                    setIsPlaying(false);
                }
            };
            playVideo();

            return () => {
                video.removeEventListener('timeupdate', updateProgress);
                video.removeEventListener('loadedmetadata', setVideoDuration);
                video.removeEventListener('ended', onEnded);
            };
        }
    }, [currentVideo]);

    const togglePlayPause = (e) => {
        e.stopPropagation();
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) {
            v.play();
            setIsPlaying(true);
        } else {
            v.pause();
            setIsPlaying(false);
        }
    };

    const handleVideoEnd = () => {
        const list = sortAscending ? [...videos].reverse() : videos;
        const idx = list.findIndex(v => v.id === currentVideo.id);
        if (idx < list.length - 1) {
            const nextVideo = list[idx + 1];
            navigate(`/detail/video/${nextVideo.id}`);
        }
    };

    const handleNextVideo = (e) => {
        e.stopPropagation();
        const list = sortAscending ? [...videos].reverse() : videos;
        const idx = list.findIndex(v => v.id === currentVideo.id);
        if (idx < list.length - 1) {
            const nextVideo = list[idx + 1];
            navigate(`/detail/video/${nextVideo.id}`);
        }
    };

    const handlePrevVideo = (e) => {
        e.stopPropagation();
        const list = sortAscending ? [...videos].reverse() : videos;
        const idx = list.findIndex(v => v.id === currentVideo.id);
        if (idx > 0) {
            const prevVideo = list[idx - 1];
            navigate(`/detail/video/${prevVideo.id}`);
        }
    };

    const handleSeek = (e) => {
        e.stopPropagation();
        const v = videoRef.current;
        if (!v || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
        v.currentTime = percent * duration;
    };

    const toggleFullscreen = async (e) => {
        e.stopPropagation();
        try {
            if (!document.fullscreenElement) {
                await videoRef.current?.requestFullscreen();
                if (screen.orientation?.lock) {
                    try {
                        await screen.orientation.lock("landscape");
                    } catch (err) {
                        console.warn("Orientation lock not supported:", err);
                    }
                }
                setIsFullscreen(true);
            } else {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        } catch (err) {
            console.warn('Fullscreen not supported:', err);
        }
    };

    const formatTime = (time = 0) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleVideoSelect = (videoId) => navigate(`/detail/video/${videoId}`);

    const toggleSortOrder = () => setSortAscending(v => !v);

    const showToast = (message) => {
        setToast({ open: true, message });
        setTimeout(() => setToast({ open: false, message: '' }), 1800);
    };

    const handleShare = async () => {
        if (!currentVideo?.share_url) return;
        try {
            await navigator.clipboard.writeText(currentVideo.share_url);
            showToast('Link berhasil dicopy');
        } catch {
            // fallback: buat input sementara
            const input = document.createElement('input');
            input.value = currentVideo.share_url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            showToast('Link berhasil dicopy');
        }
    };

    const slugify = (str = '') =>
        str
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

    const handleDownload = async () => {
        if (!currentVideo?.video_url) return;
        setDownloading(true);
        try {
            const res = await fetch(currentVideo.video_url, { mode: 'cors' });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${slugify(currentVideo.title || 'video')}.mp4`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            showToast('Mengunduh dimulai');
        } catch (err) {
            console.error('Download error:', err);
            // fallback: coba arahkan langsung (tetap akan save/open tergantung browser)
            window.location.href = currentVideo.video_url;
            showToast('Mencoba mengunduh...');
        } finally {
            setDownloading(false);
        }
    };

    const sortedVideos = sortAscending ? [...videos].reverse() : videos;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gray-800 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-gray-600">Memuat video...</p>
                </div>
            </div>
        );
    }

    if (!currentVideo) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <i className="ri-error-warning-line text-5xl text-red-500 mb-4"></i>
                    <h2 className="text-xl font-semibold text-gray-800">Video tidak ditemukan</h2>
                    <Link to="/" className="mt-4 inline-block px-6 py-2 bg-gray-900 text-white rounded-lg">Kembali ke Beranda</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header fixed */}
            <div
                className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 bg-white border-b border-gray-200"
                style={{ height: HEADER_H }}
            >
                <div className="h-full px-3 flex items-center justify-between">
                    <Link to="/video" className="flex items-center font-semibold gap-2 text-gray-800 text-[15px]">
                        <i className="ri-arrow-left-line"></i> Video Motivasi
                    </Link>
                    <button className="text-gray-700 hover:text-black">
                        <i className="ri-settings-5-line text-xl"></i>
                    </button>
                </div>
            </div>

            {/* Video player fixed */}
            <div
                className="fixed left-1/2 -translate-x-1/2 w-full max-w-xl z-40 bg-black"
                style={{ top: HEADER_H, height: PLAYER_H }}
                onMouseEnter={() => setHoverControls(true)}
                onMouseLeave={() => setHoverControls(false)}
            >
                <div className="relative w-full h-full">
                    <video
                        ref={videoRef}
                        src={currentVideo.video_url}
                        className="w-full h-full object-cover"
                        playsInline
                        controls={false}
                    />

                    {/* overlay controls (prev/play/next) */}
                    {hoverControls && (
                        <div className="absolute inset-0 flex items-center justify-center space-x-6">
                            <button
                                onClick={handlePrevVideo}
                                className="w-11 h-11 flex items-center justify-center bg-black/60 text-white rounded-full hover:bg-black/75"
                            >
                                <i className="ri-skip-back-line text-lg"></i>
                            </button>

                            <button
                                onClick={togglePlayPause}
                                className="w-16 h-16 flex items-center justify-center bg-black/60 text-white rounded-full hover:bg-black/75"
                            >
                                <i className={`ri-${isPlaying ? 'pause' : 'play'}-line text-2xl`}></i>
                            </button>

                            <button
                                onClick={handleNextVideo}
                                className="w-11 h-11 flex items-center justify-center bg-black/60 text-white rounded-full hover:bg-black/75"
                            >
                                <i className="ri-skip-forward-line text-xl"></i>
                            </button>
                        </div>
                    )}

                    {/* progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 cursor-pointer" onClick={handleSeek}>
                        <div className="h-full bg-red-600" style={{ width: `${progress}%` }}></div>
                    </div>

                    {/* time & fullscreen */}
                    {hoverControls && (
                        <>
                            <div className="absolute bottom-3 left-2 text-white text-xs px-2 py-0.5">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </div>
                            <button
                                onClick={toggleFullscreen}
                                className="absolute bottom-0 right-1 text-white p-2"
                            >
                                <i className={`ri-${isFullscreen ? 'fullscreen-exit-line' : 'fullscreen-fill'} text-md`}></i>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* SCROLL AREA: info + list */}
            <div
                className="max-w-xl mx-auto px-3"
                style={{ paddingTop: CONTENT_OFFSET, paddingBottom: 16 }}
            >
                {/* Info video (ikut scroll) */}
                <div className="py-2 border-b space-y-2">
                    {/* Judul */}
                    <h1 className="text-xl font-semibold leading-tight line-clamp-2">
                        {currentVideo.title}
                    </h1>

                    {/* Meta: views & tanggal */}
                    <div className="text-sm text-gray-600">
                        {currentVideo.views} rb x ditonton • {currentVideo.upload_date} #quotes #motivation
                    </div>

                    {/* Channel + Subscribe */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0">
                            <Link to="/profile/storythur" className="flex items-center min-w-0">
                                <img
                                    src="https://fatkhurrhn.vercel.app/preview.jpg"
                                    alt="StoryThur"
                                    className="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0"
                                />
                                <p className="font-medium text-[16px]">StoryThur <span className='text-gray-500 font-normal text-[12px]'>84 rb</span></p>
                            </Link>
                        </div>

                        <a
                            href="https://instagram.com/storythur"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center px-4 py-2 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 active:scale-[0.98] transition"
                            aria-label="Subscribe ke StoryThur di Instagram"
                        >
                            Subscribe
                        </a>
                    </div>

                    {/* Aksi: scrollable bar */}
                    <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar">
                        {/* Like & Dislike */}
                        <div className="inline-flex items-center bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                            <button onClick={toggleLike} className="inline-flex items-center gap-2 px-3 py-2 hover:bg-gray-200 text-sm">
                                <i className={liked ? "ri-thumb-up-fill text-black text-base" : "ri-thumb-up-line text-base"} />
                            </button>
                            <span className="w-px h-6 bg-gray-300" />
                            <button onClick={toggleDislike} className="inline-flex items-center gap-2 px-3 py-2 hover:bg-gray-200 text-sm">
                                <i className={disliked ? "ri-thumb-down-fill text-black text-base" : "ri-thumb-down-line text-base"} />
                            </button>
                        </div>


                        <button
                            onClick={handleShare}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm"
                            title="Bagikan"
                        >
                            <i className="ri-share-forward-line text-base" />
                            <span>Bagikan</span>
                        </button>

                        {/* Unduh */}
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-sm flex-shrink-0"
                        >
                            <i className="ri-download-line text-base" />
                            <span>{downloading ? "Menyiapkan…" : "Unduh"}</span>
                        </button>

                        {/* Simpan */}
                        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm flex-shrink-0">
                            <i className="ri-bookmark-line text-base" />
                            <span>Simpan</span>
                        </button>

                        {/* Komentar */}
                        <button
                            onClick={() => document.getElementById("komentar")?.scrollIntoView({ behavior: "smooth" })}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm flex-shrink-0"
                        >
                            <i className="ri-chat-3-line text-base" />
                            <span>Komentar</span>
                        </button>
                    </div>

                </div>



                <hr />

                {/* Toggle urutan */}
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-gray-900 text-base font-semibold">Video Lainnya</h2>
                    <button onClick={toggleSortOrder} className="p-2 hover:bg-gray-100 rounded-md" title="Urutkan">
                        <i className={`ri-arrow-${sortAscending ? 'down' : 'up'}-line text-xl`}></i>
                    </button>
                </div>

                {/* LIST (konten ini sudah dalam area scroll page). 
            Kalau mau LIST-nya sendiri yang overflow-y auto, bisa bungkus pakai div max-h calc dan overflow-y-auto */}
                <div
                    className="space-y-2"
                    style={{ maxHeight: `calc(100vh - ${CONTENT_OFFSET + 120}px)` }} // +- untuk viewport kecil
                >
                    {sortedVideos.map(video => (
                        <div
                            key={video.id}
                            className={`flex items-center rounded-lg overflow-hidden cursor-pointer border ${video.id === currentVideo.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'}`}
                            onClick={() => handleVideoSelect(video.id)}
                        >
                            <div className="relative w-32 h-20 flex-shrink-0 bg-gray-100">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <i className="ri-play-fill text-white"></i>
                                </div>
                                {video.duration && (
                                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                                        {video.duration}
                                    </div>
                                )}
                                {video.id === currentVideo.id && (
                                    <div className="absolute top-1 left-1 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <i className="ri-play-fill"></i> Sedang diputar
                                    </div>
                                )}
                            </div>

                            <div className="p-3 flex-1">
                                <h3 className={`text-sm font-medium line-clamp-2 ${video.id === currentVideo.id ? 'text-gray-900' : 'text-gray-800'}`}>
                                    {video.title}
                                </h3>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>{video.upload_date}</span>
                                    <span className="flex items-center">
                                        <i className="ri-eye-line mr-1"></i>
                                        {video.views}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="h-6" />
            </div>

            {/* TOAST / POPUP */}
            {toast.open && (
                <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-[60]">
                    <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow">
                        {toast.message}
                    </div>
                </div>
            )}
        </div>
    );
}
